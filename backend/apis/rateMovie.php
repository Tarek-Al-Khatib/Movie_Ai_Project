<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$data = json_decode(file_get_contents("php://input"), true);
$movie_id = $data['movie_id'] ?? null;
$user_id = $data['user_id'] ?? null;
$rating = $data['rating'] ?? null;

if ($movie_id && $user_id && $rating) {
    // Check if this user has already rated the movie
    $checkQuery = $connection->prepare("SELECT * FROM ratings WHERE users_user_id = ? AND movies_movie_id = ?");
    $checkQuery->bind_param("ii", $user_id, $movie_id);
    $checkQuery->execute();
    $checkResult = $checkQuery->get_result();

    if ($checkResult->num_rows > 0) {
        // Update existing rating
        $query = $connection->prepare("UPDATE ratings SET rating = ? WHERE users_user_id = ? AND movies_movie_id = ?");
        $query->bind_param("iii", $rating, $user_id, $movie_id);
    } else {
        // Insert new rating
        $query = $connection->prepare("INSERT INTO ratings (users_user_id, movies_movie_id, rating) VALUES (?, ?, ?)");
        $query->bind_param("iii", $user_id, $movie_id, $rating);
    }

    if ($query->execute()) {
        echo json_encode(["success" => true, "message" => "Rating submitted successfully"]);
    } else {
        echo json_encode(["error" => "Failed to submit rating"]);
    }
} else {
    echo json_encode(["error" => "Required data not provided"]);
}
?>
