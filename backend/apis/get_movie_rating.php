<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$movie_id = $_POST['movie_id'] ?? null;

if ($movie_id) {
    $query = $connection->prepare("SELECT AVG(rating) as average_rating FROM ratings WHERE movie_id = ?");
    $query->bind_param("i", $movie_id);
    $query->execute();
    $result = $query->get_result();
    $rating = $result->fetch_assoc();

    if ($rating) {
        echo json_encode($rating);
    } else {
        echo json_encode(["error" => "No ratings found for this movie"]);
    }
} else {
    echo json_encode(["error" => "Movie ID is required"]);
}
?>
