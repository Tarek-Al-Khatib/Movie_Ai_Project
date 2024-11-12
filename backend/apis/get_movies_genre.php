<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");
$genre = $_POST['genre'] ?? null;

if ($genre) {
    $query = $connection->prepare("SELECT * FROM movies WHERE genre = ?");
    $query->bind_param("s", $genre);
    $query->execute();
    $movies = [];
    $result = $query->get_result();

    while ($movie = $result->fetch_assoc()) {
        $movies[] = $movie;
    }

    echo json_encode($movies);
} else {
    echo json_encode(["error" => "Genre not specified"]);
}
?>
