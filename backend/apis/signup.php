<?php
include "../connection.php"; // Ensure this points to your connection file
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;
$profile_image = $_POST['profile_image'] ?? null; // Optional

if ($username && $password) {
    // Check if the username is already taken
    $checkUserQuery = $connection->prepare("SELECT * FROM users WHERE username = ?");
    $checkUserQuery->bind_param("s", $username);
    $checkUserQuery->execute();
    $result = $checkUserQuery->get_result();

    if ($result->num_rows > 0) {
        // Username already exists
        echo json_encode(["status" => "error", "message" => "Username already taken"]);
    } else {
        // Username is available, proceed with signup
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT); // Hash the password

        $query = $connection->prepare("INSERT INTO users (username, password, profile_image) VALUES (?, ?, ?)");
        $query->bind_param("sss", $username, $hashedPassword, $profile_image);
        
        if ($query->execute()) {
            // Registration successful
            echo json_encode(["status" => "success", "message" => "User registered successfully"]);
        } else {
            // Error during insertion
            echo json_encode(["status" => "error", "message" => "Failed to register user"]);
        }
    }
} else {
    // Missing username or password
    echo json_encode(["status" => "error", "message" => "Username and password required"]);
}
?>
