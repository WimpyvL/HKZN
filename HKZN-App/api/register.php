<?php
// Set header immediately
header('Content-Type: application/json');

// Basic check to see if script is hit
// error_log("register.php script accessed."); // Optional: Log to PHP error log

include 'db_connect.php'; // Include the database connection
error_log("save_quote.php: db_connect.php included successfully."); // Log after include

// Add explicit check for $conn object after include
if (!isset($conn) || !$conn instanceof mysqli) {
     error_log("register.php: Failed to get valid DB connection from db_connect.php");
     http_response_code(500);
     echo json_encode(['success' => false, 'message' => 'Internal server error: DB connection invalid.']);
     exit();
}
// Check connection error property *after* confirming $conn is an object
if ($conn->connect_error) {
    error_log("register.php - DB Connection Error: " . $conn->connect_error); // Log specific error
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection error.']);
    exit();
}

// Get the posted data
$inputJSON = file_get_contents('php://input');
// error_log("register.php - Raw input: " . $inputJSON); // Optional: Log raw input

$input = json_decode($inputJSON, TRUE); //convert JSON into array

// Check if JSON decoding worked
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input: ' . json_last_error_msg()]);
    exit();
}
// error_log("register.php - Decoded input: " . print_r($input, true)); // Optional: Log decoded input


// --- Input Validation ---
if (empty($input['email']) || empty($input['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit();
}

if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
     http_response_code(400);
     echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
     exit();
}

// Add password strength validation if desired (e.g., minimum length)
if (strlen($input['password']) < 6) { // Example: Minimum 6 characters
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Password must be at least 6 characters long.']);
    exit();
}

$email = $conn->real_escape_string($input['email']);
$password = $input['password']; // Get plain password

// --- Password Hashing ---
// IMPORTANT: Use password_hash() for secure storage
$password_hash = password_hash($password, PASSWORD_DEFAULT); // Use default strong hashing algorithm

if ($password_hash === false) {
     error_log("Password hashing failed.");
     http_response_code(500);
     echo json_encode(['success' => false, 'message' => 'Server error during registration.']);
     $conn->close();
     exit();
}

// --- Database Insertion ---
// Prepare SQL statement
$stmt = $conn->prepare("INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)"); // Assuming default role is 'user'

if ($stmt === false) {
    error_log("Prepare failed: (" . $conn->errno . ") " . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement.']);
    $conn->close();
    exit();
}

$defaultRole = 'user'; // Or determine role based on input if needed

// Bind parameters
$bindResult = $stmt->bind_param("sss", $email, $password_hash, $defaultRole);

if ($bindResult === false) {
    error_log("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to bind parameters.']);
    $stmt->close();
    $conn->close();
    exit();
}

// Execute the statement
if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(['success' => true, 'message' => 'Registration successful.']);
} else {
    error_log("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
    // Check for duplicate email error (MySQL error code 1062)
    if ($conn->errno == 1062) {
        http_response_code(409); // Conflict
        echo json_encode(['success' => false, 'message' => 'Email address already registered.']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
    }
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
