<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("get_products.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message, 'data' => []]); // Include empty data array
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("get_products.php: Including db_connect.php...");
include 'db_connect.php';
error_log("get_products.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("get_products.php: DB connection check passed.");

// Prepare SQL statement to select all products
// Adjust columns based on your actual 'products' table structure
$sql = "SELECT id, name, description, category, price, features, created_at FROM products ORDER BY category, name";
error_log("get_products.php: Preparing SQL: " . $sql);

$result = $conn->query($sql);

if ($result === false) {
    send_json_error("SQL Query failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Query Error");
}
error_log("get_products.php: SQL query executed successfully.");

$products = [];
if ($result->num_rows > 0) {
    // Fetch all results
    while($row = $result->fetch_assoc()) {
        // Attempt to decode JSON fields if applicable (e.g., features)
        if (isset($row['features'])) {
             $decoded_features = json_decode($row['features'], true);
             // Only replace if decoding was successful, otherwise keep original string
             if (json_last_error() === JSON_ERROR_NONE) {
                 $row['features'] = $decoded_features;
             } else {
                 error_log("get_products.php: Failed to decode features JSON for product ID " . $row['id'] . ". Error: " . json_last_error_msg());
             }
        }
        $products[] = $row;
    }
    error_log("get_products.php: Fetched " . count($products) . " products.");
} else {
    error_log("get_products.php: No products found.");
}

// Send success response with the products data
http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Products retrieved successfully.', 'data' => $products]);

// Close the connection
error_log("get_products.php: Closing connection...");
$result->free(); // Free result set
$conn->close();
error_log("get_products.php: Script finished.");
?>
