<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("get_quotes.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message, 'data' => []]); // Include empty data array
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("get_quotes.php: Including db_connect.php...");
include 'db_connect.php';
error_log("get_quotes.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("get_quotes.php: DB connection check passed.");

// Prepare SQL statement to select all quotes, ordered by creation date descending
// Assuming 'id' and 'created_at' columns exist. Adjust if column names differ.
$sql = "SELECT id, quote_number, client_details, website_details, selected_services, sub_total, vat_amount, total_amount, status, created_at FROM quotes ORDER BY created_at DESC";
error_log("get_quotes.php: Preparing SQL: " . $sql);

$result = $conn->query($sql);

if ($result === false) {
    send_json_error("SQL Query failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Query Error");
}
error_log("get_quotes.php: SQL query executed successfully.");

$quotes = [];
if ($result->num_rows > 0) {
    // Fetch all results
    while($row = $result->fetch_assoc()) {
        // Attempt to decode JSON fields, default to original string on error
        $row['client_details'] = json_decode($row['client_details'], true) ?? $row['client_details'];
        $row['website_details'] = json_decode($row['website_details'], true) ?? $row['website_details'];
        $row['selected_services'] = json_decode($row['selected_services'], true) ?? $row['selected_services'];
        $quotes[] = $row;
    }
    error_log("get_quotes.php: Fetched " . count($quotes) . " quotes.");
} else {
    error_log("get_quotes.php: No quotes found.");
}

// Send success response with the quotes data
http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Quotes retrieved successfully.', 'data' => $quotes]);

// Close the connection
error_log("get_quotes.php: Closing connection...");
$result->free(); // Free result set
$conn->close();
error_log("get_quotes.php: Script finished.");
?>
