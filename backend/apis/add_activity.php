<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');

$input = json_decode(file_get_contents("php://input"), true);
$user_id = $input['user_id'] ?? null;
$movie_id = $input['movie_id'] ?? null;
$increment_time = $input['activity_time'] ?? 1; 

if ($user_id && $movie_id) {
    $query = $connection->prepare("SELECT * FROM activities WHERE users_user_id = ? AND movies_movie_id = ?");
    $query->bind_param("ii", $user_id, $movie_id);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        $updateQuery = $connection->prepare("
            UPDATE activities 
            SET nbOfClicks = nbOfClicks + 1, activity_time = activity_time + ?
            WHERE users_user_id = ? AND movies_movie_id = ?
        ");
        $updateQuery->bind_param("iii",  $increment_time, $user_id, $movie_id);

        if ($updateQuery->execute()) {
            echo json_encode(["status" => "success", "message" => "Activity updated successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update activity"]);
        }
    } else {
        $insertQuery = $connection->prepare("
            INSERT INTO activities (users_user_id, movies_movie_id, nbOfClicks, activity_time) 
            VALUES (?, ?, 1, ?)
        ");
        $insertQuery->bind_param("iii", $user_id, $movie_id, $increment_time);

        if ($insertQuery->execute()) {
            echo json_encode(["status" => "success", "message" => "Activity added successfully"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add activity"]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "User ID and Movie ID are required"]);
}
?>
