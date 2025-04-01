<?php
// Enable error reporting for debugging, but log errors instead of displaying them
error_reporting(E_ALL);
ini_set('display_errors', 0); // Do NOT display errors in output
ini_set('log_errors', 1);    // Log errors to the PHP error log

// --- CORS Headers ---
// Allow requests from the frontend (port 8080), backend dashboard (port 5173), and deployed domain
$allowed_origins = ["http://localhost:8080", "http://localhost:5173", "https://www.hostingkzn.com"];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: " . $origin);
} else {
    // Optionally log or handle disallowed origins
    error_log("CORS Error: Origin " . $origin . " not allowed.");
    // You might choose to exit here or let the request proceed without the header
}

header("Access-Control-Allow-Credentials: true"); // Allow cookies/session
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow GET, POST, and OPTIONS

// --- Handle preflight OPTIONS request ---
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content
    exit(0);
}

// --- Database Connection ---
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "hosting_kzn_db";

$conn = null; // Initialize $conn to null
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT); // Throw mysqli_sql_exception on error

try {
    error_log("db_connect.php: Attempting MySQLi connection...");
    $conn = new mysqli($servername, $username, $password, $dbname);
    error_log("db_connect.php: MySQLi connection successful.");

    // Set character set
    if (!$conn->set_charset("utf8mb4")) {
         error_log("db_connect.php: Error loading character set utf8mb4: " . $conn->error);
         // Don't exit here, but log the warning
    } else {
         error_log("db_connect.php: Character set utf8mb4 set successfully.");
    }

} catch (mysqli_sql_exception $e) {
    error_log("db_connect.php: MySQLi Connection Error: " . $e->getMessage() . " (Code: " . $e->getCode() . ")");
    // Output a JSON error response if connection fails
    header('Content-Type: application/json'); // Ensure header is set even on error
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection error. Check server logs.']);
    exit(); // Exit after sending error
}

// Note: $conn variable will be available to files that include this script.
?>
