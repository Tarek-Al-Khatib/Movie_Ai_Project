<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$movie_id = $_GET['movie_id'] ?? null;

if ($movie_id) {
    $query = $connection->prepare("SELECT * FROM movies WHERE movie_id = ?");
    $query->bind_param("i", $movie_id);
    $query->execute();
    $result = $query->get_result();
    
    if ($movie = $result->fetch_assoc()) {
        echo json_encode($movie);
    } else {
        echo json_encode(["error" => "Movie not found"]);
    }
} else {
    echo json_encode(["error" => "Movie ID not provided"]);
}
?>
