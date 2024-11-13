<?php
include "../connection.php"; 

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);

$username = $input['username'] ?? null;
$password = $input['password'] ?? null;

if ($username && $password) {
    $query = $connection->prepare("SELECT * FROM users WHERE username = ?");
    if ($query) {
        $query->bind_param("s", $username);
        $query->execute();
        $result = $query->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

                echo json_encode([
                    "status" => "success",
                    "message" => "Sign-in successful",
                    "user_id" => $user['user_id'],
                    "username" => $user['username']
                ]);

        } else {
            echo json_encode(["status" => "error", "message" => "User not found"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Database error"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Username and password required"]);
}
?>
