<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("get_commission_payouts.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message, 'data' => []]); // Include empty data array
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("get_commission_payouts.php: Including db_connect.php...");
include 'db_connect.php';
error_log("get_commission_payouts.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("get_commission_payouts.php: DB connection check passed.");

// Prepare SQL statement to select all commission payouts
// Adjust columns based on your actual 'commission_payouts' table structure
// Consider joining with agents table if you need agent names directly
$sql = "SELECT id, agent_id, amount, period, status, payment_date FROM commission_payouts ORDER BY period DESC, agent_id";
error_log("get_commission_payouts.php: Preparing SQL: " . $sql);

$result = $conn->query($sql);

if ($result === false) {
    send_json_error("SQL Query failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Query Error");
}
error_log("get_commission_payouts.php: SQL query executed successfully.");

$payouts = [];
if ($result->num_rows > 0) {
    // Fetch all results
    while($row = $result->fetch_assoc()) {
        // Ensure numeric types are correct
        if (isset($row['amount'])) {
            $row['amount'] = floatval($row['amount']);
        }
        // You might want to fetch agent name here via separate query or a JOIN
        // For now, just returning agent_id
        $payouts[] = $row;
    }
    error_log("get_commission_payouts.php: Fetched " . count($payouts) . " payouts.");
} else {
    error_log("get_commission_payouts.php: No commission payouts found.");
}

// Send success response with the payouts data
http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Commission payouts retrieved successfully.', 'data' => $payouts]);

// Close the connection
error_log("get_commission_payouts.php: Closing connection...");
$result->free(); // Free result set
$conn->close();
error_log("get_commission_payouts.php: Script finished.");
?>
