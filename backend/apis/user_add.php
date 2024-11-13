<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$username = $_POST['username'];
$password = $_POST['password'];
$profile_image = $_POST['profile_image'] ?? null;

$query = $connection->prepare("INSERT INTO users (username, password, profile_image) VALUES (?, ?, ?)");
$query->bind_param("sss", $username, $password, $profile_image);
$query->execute();

echo json_encode(["status" => "success", "user_id" => $connection->insert_id]);
?>
