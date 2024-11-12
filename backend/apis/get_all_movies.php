<?php
include "../connection.php";
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: *");

$query = $connection->prepare("SELECT * FROM movies");
$query->execute();
$movies = [];
$result = $query->get_result();

while ($movie = $result->fetch_assoc()) {
    $movies[] = $movie;
}

echo json_encode($movies);
?>
