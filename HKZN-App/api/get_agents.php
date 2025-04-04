<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("get_agents.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message, 'data' => []]); // Include empty data array
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("get_agents.php: Including db_connect.php...");
include 'db_connect.php';
error_log("get_agents.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("get_agents.php: DB connection check passed.");

// Prepare SQL statement to select all agents
// Adjust columns based on the actual 'agents' table structure
$sql = "SELECT id, user_id, name, phone, referral_code, active_clients, total_sales, commission_rate, status, join_date, created_at, updated_at FROM agents ORDER BY name";
error_log("get_agents.php: Preparing SQL: " . $sql);

$result = $conn->query($sql);

if ($result === false) {
    send_json_error("SQL Query failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Query Error");
}
error_log("get_agents.php: SQL query executed successfully.");

$agents = [];
if ($result->num_rows > 0) {
    // Fetch all results
    while($row = $result->fetch_assoc()) {
        // Ensure numeric types are correct
        if (isset($row['commission_rate'])) {
            $row['commission_rate'] = floatval($row['commission_rate']);
        }
        if (isset($row['active_clients'])) {
            $row['active_clients'] = intval($row['active_clients']);
        }
         if (isset($row['total_sales'])) {
            $row['total_sales'] = floatval($row['total_sales']);
        }
        $agents[] = $row;
    }
    error_log("get_agents.php: Fetched " . count($agents) . " agents.");
} else {
    error_log("get_agents.php: No agents found.");
}

// Send success response with the agents data
http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Agents retrieved successfully.', 'data' => $agents]);

// Close the connection
error_log("get_agents.php: Closing connection...");
$result->free(); // Free result set
$conn->close();
error_log("get_agents.php: Script finished.");
?>
