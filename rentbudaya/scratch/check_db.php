<?php
require_once 'api/config.php';

$email = 'mas@gmail.com';
$stmtUser = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmtUser->bind_param('s', $email);
$stmtUser->execute();
$user = $stmtUser->get_result()->fetch_assoc();
$stmtUser->close();

echo "USER:\n";
print_r($user);

if ($user) {
    $userId = $user['id'];
    $stmtOrders = $conn->prepare("SELECT * FROM pesanan WHERE user_id = ?");
    $stmtOrders->bind_param('i', $userId);
    $stmtOrders->execute();
    $orders = $stmtOrders->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmtOrders->close();
    
    echo "\nORDERS:\n";
    print_r($orders);
}

$conn->close();
