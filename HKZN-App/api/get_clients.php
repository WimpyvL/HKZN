<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("get_clients.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message, 'data' => []]); // Include empty data array
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("get_clients.php: Including db_connect.php...");
include 'db_connect.php';
error_log("get_clients.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("get_clients.php: DB connection check passed.");

// Prepare SQL statement to select all clients
$sql = "SELECT id, name, email, phone, address, referred_by_agent_id, status, join_date, notes, created_at, updated_at FROM clients ORDER BY name";
error_log("get_clients.php: Preparing SQL: " . $sql);

$result = $conn->query($sql);

if ($result === false) {
    send_json_error("SQL Query failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Query Error");
}
error_log("get_clients.php: SQL query executed successfully.");

$clients = [];
if ($result->num_rows > 0) {
    // Fetch all results
    while($row = $result->fetch_assoc()) {
        // Explicitly handle potential nulls before encoding (belt-and-suspenders)
        foreach ($row as $key => $value) {
            if ($value === null) {
                $row[$key] = ''; // Or handle appropriately (e.g., skip, set default)
            }
        }
        $clients[] = $row;
    }
    error_log("get_clients.php: Fetched " . count($clients) . " clients.");
} else {
    error_log("get_clients.php: No clients found.");
}

// Send success response with the clients data
http_response_code(200);
// Use JSON_PARTIAL_OUTPUT_ON_ERROR for debugging if encoding fails silently
$json_output = json_encode(['success' => true, 'message' => 'Clients retrieved successfully.', 'data' => $clients], JSON_PARTIAL_OUTPUT_ON_ERROR);

if ($json_output === false) {
     send_json_error("JSON Encode failed: " . json_last_error_msg(), 500, "JSON Encode Error");
}

echo $json_output;


// Close the connection
error_log("get_clients.php: Closing connection...");
$result->free(); // Free result set
$conn->close();
error_log("get_clients.php: Script finished.");
?>
