<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['fotoClienta'])) {
    $uploadDir = 'img/clientas/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $file = $_FILES['fotoClienta'];
    $extension = strtolower(substr(strrchr($file['name'], '.'), 1));
    $fileName = uniqid() . '.' . $extension;
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $imageUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/hadassa/img/clientas/' . $fileName;
        $response = ['success' => true, 'url' => $imageUrl, 'fileName' => $fileName];
    } else {
        $response['error'] = 'Failed to move uploaded file';
    }
} else {
    $response['error'] = 'No file uploaded or invalid request';
}

echo json_encode($response);
?>