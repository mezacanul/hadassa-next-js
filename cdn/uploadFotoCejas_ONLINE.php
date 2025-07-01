<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['fotoCejas'])) {
    $uploadDir = 'img/cejas/';
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $file = $_FILES['fotoCejas'];
    $extension = strtolower(substr(strrchr($file['name'], '.'), 1));
    $fileName = uniqid() . '.' . $extension;
    $targetPath = $uploadDir . $fileName;

    // if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        $imageUrl = 'http://' . $_SERVER['HTTP_HOST'] . '/hadassa/img/cejas/' . $fileName;
        $response = ['success' => true, 'url' => $imageUrl, 'fileName' => $fileName];
    // } else {
    //     $response['error'] = 'Failed to move uploaded file';
    // }
} else {
    $response['error'] = 'No file uploaded or invalid request';
}

echo json_encode($response);
?>

<?php 
    function TestFiles(){
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_FILES)) {
            foreach ($_FILES as $key => $fileArray) {
                $response['files'][$key] = [];
                foreach ($fileArray as $field => $values) {
                    if (is_array($values)) {
                        $response['files'][$key][$field] = $values;
                    } else {
                        $response['files'][$key][$field] = $values;
                    }
                }
            }
            $response['success'] = true;
        }
        echo json_encode($response);
    }
?>