<?php
// --- TEMPORARY DEBUGGING: Force display errors ---
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
// --- END TEMPORARY DEBUGGING ---

// Log entry point
error_log("--- save_quote.php accessed at " . date('Y-m-d H:i:s') . " ---");

// Set header immediately *after* potential error display settings
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("save_quote.php - " . $log_prefix . ": " . $message); // Log the error before exiting
    http_response_code($code);
    // Try to send JSON, but error might have already occurred
    echo json_encode(['success' => false, 'message' => $message]);
    global $conn; // Ensure $conn is accessible
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
        error_log("save_quote.php - DB connection closed after error.");
    }
    exit();
}

// Try including the DB connection
error_log("save_quote.php: Attempting to include db_connect.php...");
include 'db_connect.php';
error_log("save_quote.php: db_connect.php included.");

// Check if connection object exists and is valid after include
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
error_log("save_quote.php: DB connection object is valid mysqli instance.");

// Check connection error property
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("save_quote.php: DB connection check passed.");

// Get the posted data
error_log("save_quote.php: Reading php://input...");
$inputJSON = file_get_contents('php://input');
error_log("save_quote.php: Raw input length: " . strlen($inputJSON));

// Decode JSON
error_log("save_quote.php: Decoding JSON input...");
$input = json_decode($inputJSON, TRUE);

// Check if JSON decoding worked
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json_error('Invalid JSON input: ' . json_last_error_msg(), 400, "JSON Decode Error");
}
error_log("save_quote.php: JSON decoded successfully.");

// Basic validation
error_log("save_quote.php: Validating input data...");
if (empty($input['quoteNumber']) || empty($input['clientDetails']) || empty($input['selectedServices']) || !isset($input['subTotal']) || !isset($input['vatAmount']) || !isset($input['totalAmount'])) {
    send_json_error('Missing required quote data.', 400, "Validation Error");
}
error_log("save_quote.php: Input validation passed.");

// Prepare data for insertion
error_log("save_quote.php: Preparing data for insertion...");
try {
    $quote_number = $conn->real_escape_string($input['quoteNumber']);
    $client_details_json = json_encode($input['clientDetails'], JSON_THROW_ON_ERROR);
    $website_details_json = isset($input['websiteDetails']) ? json_encode($input['websiteDetails'], JSON_THROW_ON_ERROR) : null;
    $selected_services_json = json_encode($input['selectedServices'], JSON_THROW_ON_ERROR);
    $sub_total = floatval($input['subTotal']);
    $vat_amount = floatval($input['vatAmount']);
    $total_amount = floatval($input['totalAmount']);
    $status = 'pending';
    error_log("save_quote.php: Data prepared successfully.");
} catch (JsonException $e) {
    send_json_error('Error processing quote data during JSON encode: ' . $e->getMessage(), 500, "JSON Encode Error");
}

// Prepare SQL statement
error_log("save_quote.php: Preparing SQL statement...");
$stmt = $conn->prepare("INSERT INTO quotes (quote_number, client_details, website_details, selected_services, sub_total, vat_amount, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

if ($stmt === false) {
    send_json_error("SQL Prepare failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
}
error_log("save_quote.php: SQL statement prepared successfully.");

// Bind parameters
error_log("save_quote.php: Binding parameters...");
$bindResult = $stmt->bind_param("ssssddds",
    $quote_number,
    $client_details_json,
    $website_details_json,
    $selected_services_json,
    $sub_total,
    $vat_amount,
    $total_amount,
    $status
);

if ($bindResult === false) {
    $stmt_error = $stmt->error; // Capture error before closing
    $stmt->close();
    send_json_error("Binding parameters failed: (" . $stmt->errno . ") " . $stmt_error, 500, "SQL Bind Error");
}
error_log("save_quote.php: Parameters bound successfully.");

// Execute the statement
error_log("save_quote.php: Executing statement...");
if ($stmt->execute()) {
    $new_quote_id = $stmt->insert_id;
    error_log("save_quote.php: Statement executed successfully. New quote ID: " . $new_quote_id);
    http_response_code(201); // Created
    echo json_encode(['success' => true, 'message' => 'Quote saved successfully.', 'quote_id' => $new_quote_id]);
} else {
    $error_code = $stmt->errno;
    $error_message = $stmt->error;
    if ($error_code == 1062) {
         send_json_error('Failed to save quote: Duplicate quote number.', 409, "SQL Execute Error (Duplicate)");
    } else {
         send_json_error("Failed to save quote: (" . $error_code . ") " . $error_message, 500, "SQL Execute Error");
    }
}

// Close statement and connection
error_log("save_quote.php: Closing statement and connection...");
$stmt->close();
$conn->close();
error_log("save_quote.php: Script finished.");
?>
