<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("add_agent.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("add_agent.php: Including db_connect.php...");
include 'db_connect.php';
error_log("add_agent.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("add_agent.php: DB connection check passed.");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_error('Invalid request method. Only POST is allowed.', 405, "Method Not Allowed");
}
error_log("add_agent.php: Request method is POST.");

// Get the posted data
error_log("add_agent.php: Reading php://input...");
$inputJSON = file_get_contents('php://input');
error_log("add_agent.php: Raw input length: " . strlen($inputJSON));

// Decode JSON
error_log("add_agent.php: Decoding JSON input...");
$input = json_decode($inputJSON, TRUE);

// Check if JSON decoding worked
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json_error('Invalid JSON input: ' . json_last_error_msg(), 400, "JSON Decode Error");
}
error_log("add_agent.php: JSON decoded successfully.");

// Validate input data (adjust based on required fields from AgentFormModal)
error_log("add_agent.php: Validating input data...");
if (empty($input['name']) || empty($input['email']) || empty($input['phone']) || empty($input['referralCode']) || !isset($input['commissionRate']) || !isset($input['status'])) {
    send_json_error('Missing required agent data (name, email, phone, referralCode, commissionRate, status).', 400, "Validation Error");
}

// Prepare data for insertion (match column names from schema)
$user_id = null; // Assuming user_id is nullable or set differently (e.g., linked to a users table later)
$name = $conn->real_escape_string($input['name']);
$phone = $conn->real_escape_string($input['phone']);
$referral_code = $conn->real_escape_string($input['referralCode']);
$active_clients = 0; // Default for new agent
$total_sales = 0.0; // Default for new agent
$commission_rate = floatval($input['commissionRate']); // Use commission_rate from schema
$status = $conn->real_escape_string($input['status']);
$join_date = date('Y-m-d'); // Set join date to today

// Need email to check/insert into users table first?
// For now, assuming email is not directly in agents table based on schema, but user_id links it.
// This part needs clarification on how agents relate to users.
// If email IS in agents table, add it here.
// $email = $conn->real_escape_string($input['email']);

// TODO: Add logic to potentially create a corresponding user in the 'users' table first
// and get the user_id, or handle linking existing users. This example assumes user_id can be null for now.

error_log("add_agent.php: Data prepared. Name: $name, Phone: $phone, Code: $referral_code, Rate: $commission_rate, Status: $status, Join: $join_date");

// Prepare SQL statement (match schema columns)
$sql = "INSERT INTO agents (user_id, name, phone, referral_code, active_clients, total_sales, commission_rate, status, join_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
error_log("add_agent.php: Preparing SQL: " . $sql);
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    send_json_error("SQL Prepare failed: (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
}
error_log("add_agent.php: SQL statement prepared successfully.");

// Bind parameters (adjust types: i=integer, d=double, s=string)
// Assuming user_id is integer (i), active_clients integer (i), total_sales double (d), commission_rate double (d)
// Types: i, s, s, s, i, d, d, s, s
error_log("add_agent.php: Binding parameters...");
$bindResult = $stmt->bind_param("isssiddss",
    $user_id, // Assuming nullable int for now
    $name,
    $phone,
    $referral_code,
    $active_clients,
    $total_sales,
    $commission_rate,
    $status,
    $join_date
);

if ($bindResult === false) {
    $stmt_error = $stmt->error; // Capture error before closing
    $stmt->close();
    send_json_error("Binding parameters failed: (" . $stmt->errno . ") " . $stmt_error, 500, "SQL Bind Error");
}
error_log("add_agent.php: Parameters bound successfully.");

// Execute the statement
error_log("add_agent.php: Executing statement...");
if ($stmt->execute()) {
    $new_agent_id = $stmt->insert_id;
    error_log("add_agent.php: Statement executed successfully. New agent ID: " . $new_agent_id);
    http_response_code(201); // Created
    // Return the newly created agent's ID and potentially other details
    echo json_encode(['success' => true, 'message' => 'Agent added successfully.', 'agent_id' => $new_agent_id]);
} else {
    $error_code = $stmt->errno;
    $error_message = $stmt->error;
    // Check for duplicate referral code if it's unique
    if ($error_code == 1062) { // Error code for duplicate entry
         send_json_error('Failed to add agent: Duplicate referral code or other unique constraint violation.', 409, "SQL Execute Error (Duplicate)");
    } else {
         send_json_error("Failed to add agent: (" . $error_code . ") " . $error_message, 500, "SQL Execute Error");
    }
}

// Close statement and connection
error_log("add_agent.php: Closing statement and connection...");
$stmt->close();
$conn->close();
error_log("add_agent.php: Script finished.");
?>
