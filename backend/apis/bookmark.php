<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$user_id = $_POST['user_id'] ?? null;
$movie_id = $_POST['movie_id'] ?? null;

if ($user_id && $movie_id) {
    $query = $connection->prepare("INSERT INTO bookmark (users_user_id, movies_movie_id) VALUES (?, ?)");
    $query->bind_param("ii", $user_id, $movie_id);

    if ($query->execute()) {
        echo json_encode(["success" => "Movie bookmarked successfully"]);
    } else {
        echo json_encode(["error" => "Failed to bookmark movie"]);
    }
} else {
    echo json_encode(["error" => "User ID and Movie ID are required"]);
}
?>
