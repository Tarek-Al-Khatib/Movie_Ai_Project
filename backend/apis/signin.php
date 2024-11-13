<?php
include "../connection.php"; // Make sure this points to your actual connection file
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

$username = $_POST['username'] ?? null;
$password = $_POST['password'] ?? null;

if ($username && $password) {
    // Prepare statement to prevent SQL injection
    $query = $connection->prepare("SELECT * FROM users WHERE username = ?");
    $query->bind_param("s", $username);
    $query->execute();
    $result = $query->get_result();

    // Check if user exists and validate password
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Validate the password (assuming passwords are stored hashed in the database)
        if (password_verify($password, $user['password'])) {
            // Password matches, create a session or token as per your auth system
            echo json_encode([
                "status" => "success",
                "message" => "Sign-in successful",
                "user_id" => $user['user_id'],
                "username" => $user['username']
            ]);
        } else {
            // Password does not match
            echo json_encode(["status" => "error", "message" => "Invalid password"]);
        }
    } else {
        // No user found with that username
        echo json_encode(["status" => "error", "message" => "User not found"]);
    }
} else {
    // Missing username or password
    echo json_encode(["status" => "error", "message" => "Username and password required"]);
}
?>
