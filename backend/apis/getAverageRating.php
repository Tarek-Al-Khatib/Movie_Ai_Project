<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$movie_id = $_GET['movie_id'] ?? null;

if ($movie_id) {
    $query = $connection->prepare("SELECT AVG(rating) as average_rating FROM ratings WHERE movies_movie_id = ?");
    $query->bind_param("i", $movie_id);
    $query->execute();
    $result = $query->get_result();

    if ($row = $result->fetch_assoc()) {
        $average_rating = $row['average_rating'] ? round($row['average_rating'], 2) : 0;
        echo json_encode(["average_rating" => $average_rating]);
    } else {
        echo json_encode(["error" => "No ratings found for this movie"]);
    }
} else {
    echo json_encode(["error" => "Movie ID not provided"]);
}
?>
