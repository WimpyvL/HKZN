<?php
// Start session at the very beginning
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

include 'db_connect.php'; // Include the database connection

header('Content-Type: application/json'); // Ensure response is JSON

// Add explicit check for $conn object after include
if (!isset($conn) || !$conn instanceof mysqli) {
     error_log("login.php: Failed to get valid DB connection from db_connect.php");
     http_response_code(500);
     echo json_encode(['success' => false, 'message' => 'Internal server error: DB connection invalid.']);
     exit();
}
// Check connection error property *after* confirming $conn is an object
if ($conn->connect_error) {
    error_log("login.php - DB Connection Error: " . $conn->connect_error); // Log specific error
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection error.']);
    exit();
}

// Get the posted data
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, TRUE); //convert JSON into array

// --- Input Validation ---
if (empty($input['email']) || empty($input['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
    exit();
}

$email = $conn->real_escape_string($input['email']);
$password = $input['password'];

// --- Fetch User and Verify Password ---
// Prepare SQL statement to fetch user by email
$stmt = $conn->prepare("SELECT id, email, password_hash, role FROM users WHERE email = ?");

if ($stmt === false) {
    error_log("Prepare failed: (" . $conn->errno . ") " . $conn->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement.']);
    $conn->close();
    exit();
}

// Bind parameter
$bindResult = $stmt->bind_param("s", $email);
if ($bindResult === false) {
    error_log("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to bind parameters.']);
    $stmt->close();
    $conn->close();
    exit();
}

// Execute the statement
if (!$stmt->execute()) {
     error_log("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
     http_response_code(500);
     echo json_encode(['success' => false, 'message' => 'Failed to execute statement.']);
     $stmt->close();
     $conn->close();
     exit();
}

// Get the result
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    // User found, fetch data
    $user = $result->fetch_assoc();

    // Verify the password
    if (password_verify($password, $user['password_hash'])) {
        // Password is correct, login successful

        // --- Session Management ---
        // Regenerate session ID for security
        session_regenerate_id(true);

        // Store user data in session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['logged_in'] = true;

        // Return success response with user data (excluding hash)
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Login successful.',
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'role' => $user['role']
                // Add other user fields if needed (e.g., name)
            ]
        ]);

    } else {
        // Invalid password
        http_response_code(401); // Unauthorized
        echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
    }
} else {
    // User not found
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'Invalid email or password.']);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
