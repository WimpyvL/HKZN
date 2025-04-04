<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("get_transactions.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message, 'data' => []]); // Include empty data array
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("get_transactions.php: Including db_connect.php...");
include 'db_connect.php';
error_log("get_transactions.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("get_transactions.php: DB connection check passed.");

// Prepare SQL statement to select all transactions
// Adjust columns based on the actual 'transactions' table structure
// Consider joining with agents, clients, products tables if you need names directly
$sql = "SELECT id, transaction_date, agent_id, client_id, product_id, amount, commission_amount, status, payment_method, notes, created_at, updated_at FROM transactions ORDER BY transaction_date DESC";
error_log("get_transactions.php: Preparing SQL: " . $sql);

$result = $conn->query($sql);

if ($result === false) {
    send_json_error("SQL Query failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Query Error");
}
error_log("get_transactions.php: SQL query executed successfully.");

$transactions = [];
if ($result->num_rows > 0) {
    // Fetch all results
    while($row = $result->fetch_assoc()) {
        // Ensure numeric types are correct
         if (isset($row['amount'])) {
            $row['amount'] = floatval($row['amount']);
        }
        // Use commission_amount from the database schema
        if (isset($row['commission_amount'])) {
            $row['commission'] = floatval($row['commission_amount']); // Map to 'commission' for frontend consistency if needed, or update frontend
            unset($row['commission_amount']); // Remove original if mapped
        } else {
             $row['commission'] = 0.0; // Default if column doesn't exist or is null
        }

        // Map transaction_date to date for frontend consistency if needed
        if (isset($row['transaction_date'])) {
            $row['date'] = $row['transaction_date'];
            unset($row['transaction_date']);
        }

        // You might want to fetch agent/client/product names here via separate queries or a JOIN
        // For now, just returning IDs
        $transactions[] = $row;
    }
    error_log("get_transactions.php: Fetched " . count($transactions) . " transactions.");
} else {
    error_log("get_transactions.php: No transactions found.");
}

// Send success response with the transactions data
http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Transactions retrieved successfully.', 'data' => $transactions]);

// Close the connection
error_log("get_transactions.php: Closing connection...");
$result->free(); // Free result set
$conn->close();
error_log("get_transactions.php: Script finished.");
?>
