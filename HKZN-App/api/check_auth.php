<?php
// Start session at the very beginning
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

include 'db_connect.php'; // Optional: Only needed if you want to re-fetch fresh user data

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:8080"); // Allow specific origin (Vite dev server)
header("Access-Control-Allow-Credentials: true"); // Allow cookies to be sent/received
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Allow GET and OPTIONS

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}


// Check if user is logged in based on session variables
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true && isset($_SESSION['user_id'])) {
    // User is logged in

    // Return user data stored in session
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'loggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['user_email'] ?? null, // Use null coalescing
            'role' => $_SESSION['user_role'] ?? null
            // Add other relevant user data stored in session
        ]
    ]);
} else {
    // User is not logged in
    http_response_code(200); // Still a successful check, just indicates not logged in
    echo json_encode([
        'success' => true, // The check itself was successful
        'loggedIn' => false,
        'user' => null
    ]);
}

// Close DB connection if it was opened (only if db_connect.php was included and needed)
if (isset($conn) && $conn instanceof mysqli) {
    $conn->close();
}
?>
