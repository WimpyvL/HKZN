<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("save_contact.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("save_contact.php: Including db_connect.php...");
include 'db_connect.php';
error_log("save_contact.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("save_contact.php: DB connection check passed.");

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json_error('Invalid request method. Only POST is allowed.', 405, "Method Not Allowed");
}
error_log("save_contact.php: Request method is POST.");

// Get the posted data
error_log("save_contact.php: Reading php://input...");
$inputJSON = file_get_contents('php://input');
error_log("save_contact.php: Raw input length: " . strlen($inputJSON));

// Decode JSON
error_log("save_contact.php: Decoding JSON input...");
$input = json_decode($inputJSON, TRUE);

// Check if JSON decoding worked
if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
    send_json_error('Invalid JSON input: ' . json_last_error_msg(), 400, "JSON Decode Error");
}
error_log("save_contact.php: JSON decoded successfully.");

// Validate input data (match fields from useContactForm hook)
error_log("save_contact.php: Validating input data...");
if (empty($input['name']) || empty($input['email']) || !filter_var($input['email'], FILTER_VALIDATE_EMAIL) || empty($input['contactNumber']) || empty($input['message'])) {
    send_json_error('Missing or invalid required contact data (name, email, contactNumber, message).', 400, "Validation Error");
}

// Prepare data for insertion
$name = $conn->real_escape_string($input['name']);
$email = $conn->real_escape_string($input['email']);
$phone = $conn->real_escape_string($input['contactNumber']);
$message = $conn->real_escape_string($input['message']);
// Join selected services array into a comma-separated string
$services_interested = isset($input['selectedServices']) && is_array($input['selectedServices'])
                       ? $conn->real_escape_string(implode(', ', $input['selectedServices']))
                       : '';

error_log("save_contact.php: Data prepared. Name: $name, Email: $email, Phone: $phone, Services: $services_interested");

// --- Database Insertion ---
$db_success = false;
$new_submission_id = null;
try {
    // Prepare SQL statement for the new 'contact_submissions' table
    // Adjust table/column names if different
    $sql = "INSERT INTO contact_submissions (name, email, phone, services_interested, message) VALUES (?, ?, ?, ?, ?)";
    error_log("save_contact.php: Preparing SQL: " . $sql);
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        throw new Exception("SQL Prepare failed: (" . $conn->errno . ") " . $conn->error);
    }

    // Bind parameters (all strings: sssss)
    $bindResult = $stmt->bind_param("sssss", $name, $email, $phone, $services_interested, $message);
    if ($bindResult === false) {
        throw new Exception("Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error);
    }

    // Execute the statement
    if ($stmt->execute()) {
        $new_submission_id = $stmt->insert_id;
        error_log("save_contact.php: Submission saved successfully. ID: " . $new_submission_id);
        $db_success = true;
    } else {
        throw new Exception("Failed to save submission: (" . $stmt->errno . ") " . $stmt->error);
    }
    $stmt->close();

} catch (Exception $e) {
     error_log("save_contact.php - Database Error: " . $e->getMessage());
     // Don't exit yet, still try to send email
}

// --- Email Sending ---
$email_success = false;
$to = "info@hostingkzn.com"; // Your target email
$subject = "Contact Form Submission from " . $input['name']; // Use raw name from input
$body = "Name: " . $input['name'] . "\r\n" .
        "Email: " . $input['email'] . "\r\n" .
        "Contact Number: " . $input['contactNumber'] . "\r\n" .
        "Services Interested In: " . (isset($input['selectedServices']) && is_array($input['selectedServices']) ? implode(', ', $input['selectedServices']) : 'None selected') . "\r\n\r\n" .
        "Message:\r\n" . $input['message'];

$headers = "From: " . $email . "\r\n" . // Use sender's email as From (might cause deliverability issues)
           "Reply-To: " . $email . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

error_log("save_contact.php: Attempting to send email to $to");
if (mail($to, $subject, $body, $headers)) {
    error_log("save_contact.php: Email sent successfully.");
    $email_success = true;
} else {
    error_log("save_contact.php: Email sending failed. Check server mail configuration.");
    // Don't send error response if DB save worked, just log the email failure
}

// --- Final Response ---
if ($db_success) {
    http_response_code(201); // Created (in DB)
    $response_message = 'Contact submission saved successfully.';
    if (!$email_success) {
        $response_message .= ' However, the notification email failed to send (check server logs).';
    }
    echo json_encode(['success' => true, 'message' => $response_message, 'submission_id' => $new_submission_id]);
} else {
    // If DB save failed, send error even if email potentially worked (unlikely)
    send_json_error("Failed to save contact submission to database.", 500, "Database Save Error");
}


// Close the connection
error_log("save_contact.php: Closing connection...");
$conn->close();
error_log("save_contact.php: Script finished.");
?>
