<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("update_quote_status.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("update_quote_status.php: Including db_connect.php...");
include 'db_connect.php';
error_log("update_quote_status.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("update_quote_status.php: DB connection check passed.");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_error('Invalid request method. Only POST is allowed.', 405, "Method Not Allowed");
}
error_log("update_quote_status.php: Request method is POST.");

// Get the posted data
error_log("update_quote_status.php: Reading php://input...");
$inputJSON = file_get_contents('php://input');
error_log("update_quote_status.php: Raw input length: " . strlen($inputJSON));

// Decode JSON
error_log("update_quote_status.php: Decoding JSON input...");
$input = json_decode($inputJSON, TRUE);

// Check if JSON decoding worked
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json_error('Invalid JSON input: ' . json_last_error_msg(), 400, "JSON Decode Error");
}
error_log("update_quote_status.php: JSON decoded successfully.");

// Validate input data
error_log("update_quote_status.php: Validating input data...");
if (!isset($input['quote_id']) || !is_numeric($input['quote_id']) || empty($input['new_status'])) {
    send_json_error('Missing or invalid required data (quote_id, new_status).', 400, "Validation Error");
}

$quote_id = intval($input['quote_id']);
$new_status = $conn->real_escape_string($input['new_status']);

// Define allowed statuses (adjust as needed)
$allowed_statuses = ['pending', 'approved', 'rejected', 'invoiced'];
if (!in_array($new_status, $allowed_statuses)) {
    send_json_error('Invalid status value provided.', 400, "Validation Error");
}
error_log("update_quote_status.php: Input validation passed. Quote ID: $quote_id, New Status: $new_status");

// Prepare SQL statement
error_log("update_quote_status.php: Preparing SQL statement...");
$stmt = $conn->prepare("UPDATE quotes SET status = ? WHERE id = ?");

if ($stmt === false) {
    send_json_error("SQL Prepare failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
}
error_log("update_quote_status.php: SQL statement prepared successfully.");

// Bind parameters
error_log("update_quote_status.php: Binding parameters...");
$bindResult = $stmt->bind_param("si", $new_status, $quote_id);

if ($bindResult === false) {
    $stmt_error = $stmt->error; // Capture error before closing
    $stmt->close();
    send_json_error("Binding parameters failed: (" . $stmt->errno . ") " . $stmt_error, 500, "SQL Bind Error");
}
error_log("update_quote_status.php: Parameters bound successfully.");

// Execute the statement
error_log("update_quote_status.php: Executing statement...");
if ($stmt->execute()) {
    $affected_rows = $stmt->affected_rows;
    error_log("update_quote_status.php: Statement executed successfully. Affected rows: " . $affected_rows);
    if ($affected_rows > 0) {
        http_response_code(200); // OK
        echo json_encode(['success' => true, 'message' => 'Quote status updated successfully.']);
    } else {
        // No rows affected - quote ID might not exist or status was already the same
        http_response_code(404); // Not Found (or maybe 200 with a specific message)
        echo json_encode(['success' => false, 'message' => 'Quote not found or status already set.']);
    }
} else {
    $error_code = $stmt->errno;
    $error_message = $stmt->error;
    send_json_error("Failed to update quote status: (" . $error_code . ") " . $error_message, 500, "SQL Execute Error");
}

// Close statement and connection
error_log("update_quote_status.php: Closing statement and connection...");
$stmt->close();
$conn->close();
error_log("update_quote_status.php: Script finished.");
?>
