<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("add_client.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("add_client.php: Including db_connect.php...");
include 'db_connect.php';
error_log("add_client.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("add_client.php: DB connection check passed.");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_error('Invalid request method. Only POST is allowed.', 405, "Method Not Allowed");
}
error_log("add_client.php: Request method is POST.");

// Get the posted data
error_log("add_client.php: Reading php://input...");
$inputJSON = file_get_contents('php://input');
error_log("add_client.php: Raw input length: " . strlen($inputJSON));

// Decode JSON
error_log("add_client.php: Decoding JSON input...");
$input = json_decode($inputJSON, TRUE);

// Check if JSON decoding worked
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json_error('Invalid JSON input: ' . json_last_error_msg(), 400, "JSON Decode Error");
}
error_log("add_client.php: JSON decoded successfully.");

// Validate input data (match fields from ClientFormModal)
error_log("add_client.php: Validating input data...");
if (empty($input['name']) || empty($input['email']) || empty($input['phone']) || !isset($input['status'])) {
    // Note: referredByAgentId and productId might be optional or handled differently
    send_json_error('Missing required client data (name, email, phone, status).', 400, "Validation Error");
}

// Prepare data for insertion (match column names from schema)
$name = $conn->real_escape_string($input['name']);
$email = $conn->real_escape_string($input['email']);
$phone = $conn->real_escape_string($input['phone']);
$address = isset($input['address']) ? $conn->real_escape_string($input['address']) : null;
$referred_by_agent_id = isset($input['referredByAgentId']) && !empty($input['referredByAgentId']) ? intval($input['referredByAgentId']) : null; // Assuming it's an INT ID, nullable
$status = $conn->real_escape_string($input['status']);
$join_date = date('Y-m-d'); // Set join date to today
$notes = null; // Assuming notes are added later

// product_id is not in the clients table schema provided

error_log("add_client.php: Data prepared. Name: $name, Email: $email, Phone: $phone, AgentID: $referred_by_agent_id, Status: $status, Join: $join_date");

// Prepare SQL statement (match schema columns)
$sql = "INSERT INTO clients (name, email, phone, address, referred_by_agent_id, status, join_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
error_log("add_client.php: Preparing SQL: " . $sql);
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    send_json_error("SQL Prepare failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
}
error_log("add_client.php: SQL statement prepared successfully.");

// Bind parameters (adjust types: s=string, i=integer)
// Types: s, s, s, s, i, s, s, s
error_log("add_client.php: Binding parameters...");
$bindResult = $stmt->bind_param("ssssisss",
    $name,
    $email,
    $phone,
    $address,
    $referred_by_agent_id,
    $status,
    $join_date,
    $notes
);

if ($bindResult === false) {
    $stmt_error = $stmt->error; // Capture error before closing
    $stmt->close();
    send_json_error("Binding parameters failed: (" . $stmt->errno . ") " . $stmt_error, 500, "SQL Bind Error");
}
error_log("add_client.php: Parameters bound successfully.");

// Execute the statement
error_log("add_client.php: Executing statement...");
if ($stmt->execute()) {
    $new_client_id = $stmt->insert_id;
    error_log("add_client.php: Statement executed successfully. New client ID: " . $new_client_id);
    http_response_code(201); // Created
    // Return the newly created client's ID
    echo json_encode(['success' => true, 'message' => 'Client added successfully.', 'client_id' => $new_client_id]);
} else {
    $error_code = $stmt->errno;
    $error_message = $stmt->error;
    // Check for duplicate email if it's unique
    if ($error_code == 1062) { // Error code for duplicate entry
         send_json_error('Failed to add client: Duplicate email or other unique constraint violation.', 409, "SQL Execute Error (Duplicate)");
    } else {
         send_json_error("Failed to add client: (" . $error_code . ") " . $error_message, 500, "SQL Execute Error");
    }
}

// Close statement and connection
error_log("add_client.php: Closing statement and connection...");
$stmt->close();
$conn->close();
error_log("add_client.php: Script finished.");
?>
