<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$user_id = $_GET['user_id'] ?? null;

if ($user_id) {
    // Updated query to join activities with movies
    $query = $connection->prepare("
        SELECT activities.*, movies.title AS movie_title 
        FROM activities
        JOIN movies ON activities.movies_movie_id = movies.movie_id
        WHERE activities.users_user_id = ?
    ");
    $query->bind_param("i", $user_id);
    $query->execute();
    $result = $query->get_result();
    $activities = [];

    while ($activity = $result->fetch_assoc()) {
        $activities[] = $activity;
    }

    echo json_encode($activities);
} else {
    echo json_encode(["error" => "User ID not provided"]);
}
?>
