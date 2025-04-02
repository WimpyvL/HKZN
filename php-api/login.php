<?php
session_start(); // Start the session at the very beginning

// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("login.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("login.php: Including db_connect.php...");
include 'db_connect.php'; // $conn is expected from here
error_log("login.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("login.php: DB connection check passed.");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_error('Invalid request method. Only POST is allowed.', 405, "Method Not Allowed");
}
error_log("login.php: Request method is POST.");

// Get the posted data
error_log("login.php: Reading php://input...");
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE);

// Check if JSON decoding worked
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json_error('Invalid JSON input: ' . json_last_error_msg(), 400, "JSON Decode Error");
}
error_log("login.php: JSON decoded successfully.");

// Validate input data
if (empty($input['email']) || empty($input['password'])) {
    send_json_error('Email and password are required.', 400, "Validation Error");
}

$email = $conn->real_escape_string($input['email']);
$password = $input['password']; // Don't escape password before verification

error_log("login.php: Attempting login for email: $email");

// Find user by email
$sql = "SELECT id, email, password_hash, name, role FROM users WHERE email = ? LIMIT 1";
$stmt = $conn->prepare($sql);
if ($stmt === false) {
    send_json_error("SQL Prepare failed (find user): (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
}

$stmt->bind_param("s", $email);
if (!$stmt->execute()) {
    $error_msg = $stmt->error;
    $stmt->close();
    send_json_error("SQL Execute failed (find user): " . $error_msg, 500, "SQL Execute Error");
}

$result = $stmt->get_result();
if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password
    if (password_verify($password, $user['password_hash'])) {
        error_log("login.php: Password verified for user ID: " . $user['id']);

        // Regenerate session ID for security
        session_regenerate_id(true);

        // Store user information in session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['logged_in'] = true;

        error_log("login.php: Session created for user ID: " . $_SESSION['user_id'] . ", Role: " . $_SESSION['user_role']);

        // Send success response with user data (excluding hash)
        unset($user['password_hash']); // Don't send hash to client
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Login successful.', 'user' => $user]);

    } else {
        error_log("login.php: Invalid password for email: $email");
        send_json_error('Invalid email or password.', 401, "Authentication Failed"); // 401 Unauthorized
    }
} else {
    $stmt->close();
    error_log("login.php: Email not found: $email");
    send_json_error('Invalid email or password.', 401, "Authentication Failed"); // 401 Unauthorized
}

// Close the connection
$conn->close();
error_log("login.php: Script finished.");
?>
