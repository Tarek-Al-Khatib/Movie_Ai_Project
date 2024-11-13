<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$movie_id = $_GET['movie_id'] ?? null;

if ($movie_id) {
    $query = $connection->prepare("
        SELECT users.username, ratings.rating 
        FROM ratings
        JOIN users ON ratings.users_user_id = users.user_id
        WHERE ratings.movies_movie_id = ?
        ORDER BY ratings.rating DESC
        LIMIT 5
    ");
    $query->bind_param("i", $movie_id);
    $query->execute();
    $result = $query->get_result();
    
    $ratings = [];
    while ($rating = $result->fetch_assoc()) {
        $ratings[] = $rating;
    }

    echo json_encode($ratings);
} else {
    echo json_encode(["error" => "Movie ID not provided"]);
}
?>
