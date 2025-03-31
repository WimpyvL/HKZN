<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("add_transaction.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("add_transaction.php: Including db_connect.php...");
include 'db_connect.php';
error_log("add_transaction.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("add_transaction.php: DB connection check passed.");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_error('Invalid request method. Only POST is allowed.', 405, "Method Not Allowed");
}
error_log("add_transaction.php: Request method is POST.");

// Get the posted data
error_log("add_transaction.php: Reading php://input...");
$inputJSON = file_get_contents('php://input');
error_log("add_transaction.php: Raw input length: " . strlen($inputJSON));

// Decode JSON
error_log("add_transaction.php: Decoding JSON input...");
$input = json_decode($inputJSON, TRUE);

// Check if JSON decoding worked
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json_error('Invalid JSON input: ' . json_last_error_msg(), 400, "JSON Decode Error");
}
error_log("add_transaction.php: JSON decoded successfully.");

// Validate input data (match fields expected from the frontend modal)
error_log("add_transaction.php: Validating input data...");
if (
    empty($input['agent_id']) || !is_numeric($input['agent_id']) ||
    empty($input['client_id']) || !is_numeric($input['client_id']) ||
    empty($input['product_id']) || !is_numeric($input['product_id']) ||
    !isset($input['amount']) || !is_numeric($input['amount']) ||
    !isset($input['commission_amount']) || !is_numeric($input['commission_amount']) || // Expecting commission_amount based on schema
    empty($input['status']) ||
    empty($input['payment_method'])
) {
    send_json_error('Missing or invalid required transaction data (agent_id, client_id, product_id, amount, commission_amount, status, payment_method).', 400, "Validation Error");
}

// Prepare data for insertion (match column names from schema)
$transaction_date = date('Y-m-d'); // Set transaction date to today, or get from input if provided
// $transaction_date = isset($input['date']) ? $conn->real_escape_string($input['date']) : date('Y-m-d');
$agent_id = intval($input['agent_id']);
$client_id = intval($input['client_id']);
$product_id = intval($input['product_id']);
$amount = floatval($input['amount']);
$commission_amount = floatval($input['commission_amount']);
$status = $conn->real_escape_string($input['status']);
$payment_method = $conn->real_escape_string($input['payment_method']);
$notes = isset($input['notes']) ? $conn->real_escape_string($input['notes']) : null;

// Validate status enum
$allowed_statuses = ['completed', 'pending', 'failed', 'refunded'];
if (!in_array($status, $allowed_statuses)) {
    send_json_error('Invalid status value provided.', 400, "Validation Error");
}

error_log("add_transaction.php: Data prepared. AgentID: $agent_id, ClientID: $client_id, ProductID: $product_id, Amount: $amount, Commission: $commission_amount, Status: $status");

// Prepare SQL statement (match schema columns)
$sql = "INSERT INTO transactions (transaction_date, agent_id, client_id, product_id, amount, commission_amount, status, payment_method, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
error_log("add_transaction.php: Preparing SQL: " . $sql);
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    send_json_error("SQL Prepare failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
}
error_log("add_transaction.php: SQL statement prepared successfully.");

// Bind parameters (adjust types: s=string, i=integer, d=double)
// Types: s, i, i, i, d, d, s, s, s
error_log("add_transaction.php: Binding parameters...");
$bindResult = $stmt->bind_param("siiiddsss",
    $transaction_date,
    $agent_id,
    $client_id,
    $product_id,
    $amount,
    $commission_amount,
    $status,
    $payment_method,
    $notes
);

if ($bindResult === false) {
    $stmt_error = $stmt->error; // Capture error before closing
    $stmt->close();
    send_json_error("Binding parameters failed: (" . $stmt->errno . ") " . $stmt_error, 500, "SQL Bind Error");
}
error_log("add_transaction.php: Parameters bound successfully.");

// Execute the statement
error_log("add_transaction.php: Executing statement...");
if ($stmt->execute()) {
    $new_transaction_id = $stmt->insert_id;
    error_log("add_transaction.php: Statement executed successfully. New transaction ID: " . $new_transaction_id);
    http_response_code(201); // Created
    // Return the newly created transaction's ID
    echo json_encode(['success' => true, 'message' => 'Transaction added successfully.', 'transaction_id' => $new_transaction_id]);
} else {
    $error_code = $stmt->errno;
    $error_message = $stmt->error;
    send_json_error("Failed to add transaction: (" . $error_code . ") " . $error_message, 500, "SQL Execute Error");
}

// Close statement and connection
error_log("add_transaction.php: Closing statement and connection...");
$stmt->close();
$conn->close();
error_log("add_transaction.php: Script finished.");
?>
