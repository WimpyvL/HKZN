<?php
// Start session to access session data
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

header('Content-Type: application/json');
// Allow requests from Vite dev server and allow credentials
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow POST for logout action

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Unset all session variables
$_SESSION = array();

// If using session cookies, delete the cookie as well.
// Note: This will destroy the session, and not just the session data!
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finally, destroy the session.
session_destroy();

// Return success response
http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Logout successful.']);
?>
