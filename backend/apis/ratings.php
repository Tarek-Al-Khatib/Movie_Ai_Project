<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$user_id = $_POST['user_id'] ?? null;
$movie_id = $_POST['movie_id'] ?? null;
$rating = $_POST['rating'] ?? null;

if ($user_id && $movie_id && $rating && ($rating >= 1 && $rating <= 5)) {
    $query = $connection->prepare("INSERT INTO ratings (users_user_id, movies_movie_id, rating) VALUES (?, ?, ?)");
    $query->bind_param("iiii", $user_id, $movie_id, $rating, $rating);

    if ($query->execute()) {
        echo json_encode(["success" => "Rating submitted successfully"]);
    } else {
        echo json_encode(["error" => "Failed to submit rating"]);
    }
} else {
    echo json_encode(["error" => "User ID, Movie ID, and a valid rating between 1 and 5 are required"]);
}
?>
