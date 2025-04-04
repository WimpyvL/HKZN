<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("add_product.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("add_product.php: Including db_connect.php...");
include 'db_connect.php';
error_log("add_product.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("add_product.php: DB connection check passed.");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_error('Invalid request method. Only POST is allowed.', 405, "Method Not Allowed");
}
error_log("add_product.php: Request method is POST.");

// Get the posted data
error_log("add_product.php: Reading php://input...");
$inputJSON = file_get_contents('php://input');
error_log("add_product.php: Raw input length: " . strlen($inputJSON));

// Decode JSON
error_log("add_product.php: Decoding JSON input...");
$input = json_decode($inputJSON, TRUE);

// Check if JSON decoding worked
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json_error('Invalid JSON input: ' . json_last_error_msg(), 400, "JSON Decode Error");
}
error_log("add_product.php: JSON decoded successfully.");

// Validate input data (match fields from ProductManagement form)
error_log("add_product.php: Validating input data...");
if (
    empty($input['name']) ||
    !isset($input['price']) || !is_numeric($input['price']) || $input['price'] <= 0 ||
    !isset($input['commissionRate']) || !is_numeric($input['commissionRate']) ||
    empty($input['category']) ||
    !isset($input['features']) || !is_array($input['features']) // Ensure features is an array
) {
    send_json_error('Missing or invalid required product data (name, price, commissionRate, category, features).', 400, "Validation Error");
}

// Prepare data for insertion (match column names from schema)
$name = $conn->real_escape_string($input['name']);
$description = isset($input['description']) ? $conn->real_escape_string($input['description']) : '';
$price = floatval($input['price']);
$commission_rate = floatval($input['commissionRate']); // Use commission_rate from schema
$features_json = json_encode($input['features']); // Encode features array as JSON
$is_active = 1; // Default new products to active (tinyint(1))
$category = $conn->real_escape_string($input['category']);

error_log("add_product.php: Data prepared. Name: $name, Price: $price, Rate: $commission_rate, Category: $category");

// Prepare SQL statement (match schema columns)
$sql = "INSERT INTO products (name, description, price, commission_rate, features, is_active, category) VALUES (?, ?, ?, ?, ?, ?, ?)";
error_log("add_product.php: Preparing SQL: " . $sql);
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    send_json_error("SQL Prepare failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
}
error_log("add_product.php: SQL statement prepared successfully.");

// Bind parameters (adjust types: s=string, d=double, i=integer)
// Types: s, s, d, d, s, i, s
error_log("add_product.php: Binding parameters...");
$bindResult = $stmt->bind_param("ssddsis",
    $name,
    $description,
    $price,
    $commission_rate,
    $features_json,
    $is_active,
    $category
);

if ($bindResult === false) {
    $stmt_error = $stmt->error; // Capture error before closing
    $stmt->close();
    send_json_error("Binding parameters failed: (" . $stmt->errno . ") " . $stmt_error, 500, "SQL Bind Error");
}
error_log("add_product.php: Parameters bound successfully.");

// Execute the statement
error_log("add_product.php: Executing statement...");
if ($stmt->execute()) {
    $new_product_id = $stmt->insert_id;
    error_log("add_product.php: Statement executed successfully. New product ID: " . $new_product_id);
    http_response_code(201); // Created
    // Return the newly created product's ID
    echo json_encode(['success' => true, 'message' => 'Product added successfully.', 'product_id' => $new_product_id]);
} else {
    $error_code = $stmt->errno;
    $error_message = $stmt->error;
     // Check for duplicate name if it's unique
    if ($error_code == 1062) { // Error code for duplicate entry
         send_json_error('Failed to add product: Duplicate name or other unique constraint violation.', 409, "SQL Execute Error (Duplicate)");
    } else {
        send_json_error("Failed to add product: (" . $error_code . ") " . $error_message, 500, "SQL Execute Error");
    }
}

// Close statement and connection
error_log("add_product.php: Closing statement and connection...");
$stmt->close();
$conn->close();
error_log("add_product.php: Script finished.");
?>
