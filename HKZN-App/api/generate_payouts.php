<?php
// Enable error reporting for debugging (log errors, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');

// Function to send JSON error response and exit
function send_json_error($message, $code = 500, $log_prefix = "Error") {
    error_log("generate_payouts.php - " . $log_prefix . ": " . $message);
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
    exit();
}

// Include DB connection (handles CORS and connection itself)
error_log("generate_payouts.php: Including db_connect.php...");
include 'db_connect.php';
error_log("generate_payouts.php: db_connect.php included.");

// Check if connection object exists and is valid
if (!isset($conn) || !$conn instanceof mysqli) {
     send_json_error("Failed to get valid DB connection object from db_connect.php", 500, "Connection Object Invalid");
}
if ($conn->connect_error) {
    send_json_error("DB Connection Error: " . $conn->connect_error, 500, "Connection Failed");
}
error_log("generate_payouts.php: DB connection check passed.");

// --- Payout Generation Logic ---

// 1. Determine the period (e.g., previous month)
$today = new DateTime();
$today->modify('first day of last month'); // Go to the first day of the previous month
$period_start_date = $today->format('Y-m-01');
$period_end_date = $today->format('Y-m-t'); // 't' gives the last day of the month
$payout_period_name = $today->format('F Y'); // e.g., "March 2024"

error_log("generate_payouts.php: Generating payouts for period: $payout_period_name ($period_start_date to $period_end_date)");

// 2. Check if payouts for this period already exist (basic check)
$check_sql = "SELECT id FROM commission_payouts WHERE period = ? LIMIT 1";
$check_stmt = $conn->prepare($check_sql);
if ($check_stmt === false) {
     send_json_error("SQL Prepare failed (check existing): (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
}
$check_stmt->bind_param("s", $payout_period_name);
$check_stmt->execute();
$check_result = $check_stmt->get_result();
if ($check_result->num_rows > 0) {
    $check_stmt->close();
    send_json_error("Payouts for period '$payout_period_name' seem to already exist.", 409, "Conflict"); // 409 Conflict
}
$check_stmt->close();
error_log("generate_payouts.php: No existing payouts found for $payout_period_name.");


// 3. Calculate total commission per agent for completed transactions in the period
// IMPORTANT: Assumes 'transactions' table has 'transaction_date', 'agent_id', 'commission_amount', 'status'
$calc_sql = "SELECT agent_id, SUM(commission_amount) as total_commission
             FROM transactions
             WHERE status = 'completed'
             AND transaction_date BETWEEN ? AND ?
             GROUP BY agent_id
             HAVING SUM(commission_amount) > 0"; // Only include agents with commission > 0

error_log("generate_payouts.php: Preparing calculation SQL: " . $calc_sql);
$calc_stmt = $conn->prepare($calc_sql);
if ($calc_stmt === false) {
    send_json_error("SQL Prepare failed (calculate commission): (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
}
$calc_stmt->bind_param("ss", $period_start_date, $period_end_date);

error_log("generate_payouts.php: Executing calculation statement...");
if (!$calc_stmt->execute()) {
     $error_msg = $calc_stmt->error;
     $calc_stmt->close();
     send_json_error("SQL Execute failed (calculate commission): " . $error_msg, 500, "SQL Execute Error");
}

$result = $calc_stmt->get_result();
$commissions_to_pay = $result->fetch_all(MYSQLI_ASSOC);
$calc_stmt->close();
error_log("generate_payouts.php: Found " . count($commissions_to_pay) . " agents with commissions for the period.");


// 4. Insert new payout records
$payouts_generated = 0;
if (!empty($commissions_to_pay)) {
    $insert_sql = "INSERT INTO commission_payouts (agent_id, amount, period, status) VALUES (?, ?, ?, 'pending')";
    error_log("generate_payouts.php: Preparing insert SQL: " . $insert_sql);
    $insert_stmt = $conn->prepare($insert_sql);
    if ($insert_stmt === false) {
        send_json_error("SQL Prepare failed (insert payout): (" . $conn->errno . ") " . $conn->error, 500, "SQL Prepare Error");
    }

    foreach ($commissions_to_pay as $commission_data) {
        $agent_id = $commission_data['agent_id'];
        $amount = $commission_data['total_commission'];

        error_log("generate_payouts.php: Inserting payout for Agent ID: $agent_id, Amount: $amount, Period: $payout_period_name");
        $bindResult = $insert_stmt->bind_param("ids", $agent_id, $amount, $payout_period_name);
         if ($bindResult === false) {
             error_log("generate_payouts.php - SQL Bind Error (insert payout): (" . $insert_stmt->errno . ") " . $insert_stmt->error);
             // Continue to next agent instead of exiting? Or maybe rollback transaction if implemented.
             continue;
         }

        if ($insert_stmt->execute()) {
            $payouts_generated++;
            error_log("generate_payouts.php: Successfully inserted payout for Agent ID: $agent_id");
        } else {
            error_log("generate_payouts.php - SQL Execute Error (insert payout): (" . $insert_stmt->errno . ") " . $insert_stmt->error . " for Agent ID: $agent_id");
            // Decide how to handle partial failure - rollback? Log and continue?
        }
    }
    $insert_stmt->close();
}

// 5. Send success response
http_response_code(200); // OK, even if 0 payouts were generated
echo json_encode(['success' => true, 'message' => "$payouts_generated commission payouts generated for period '$payout_period_name'.", 'payouts_generated' => $payouts_generated]);

// Close the connection
error_log("generate_payouts.php: Closing connection...");
$conn->close();
error_log("generate_payouts.php: Script finished.");
?>
