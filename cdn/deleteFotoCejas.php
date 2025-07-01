<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['fileName'])) {
    $uploadDir = 'img/cejas/';
    $fileName = basename($_POST['fileName']); // Sanitize filename
    $targetPath = $uploadDir . $fileName;

    // if (file_exists($targetPath) && unlink($targetPath)) {
        $imageUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/hadassa/img/cejas/' . $fileName;
        $response = ['success' => true, 'url' => $imageUrl, 'fileName' => $fileName, 'message' => 'File deleted successfully'];
    // } else {
    //     $response['error'] = 'Failed to delete file or file not found';
    // }
} else {
    $response['error'] = 'No fileName provided or invalid request';
}

echo json_encode($response);
?>