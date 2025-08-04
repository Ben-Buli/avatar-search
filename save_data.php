<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// 只允許 POST 請求
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => '只允許 POST 請求']);
    exit;
}

try {
    // 獲取 POST 資料
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('無效的 JSON 資料');
    }
    
    // 驗證資料結構
    if (!is_array($data)) {
        throw new Exception('資料必須是陣列格式');
    }
    
    // 儲存到 JSON 檔案
    $filename = 'image_data.json';
    $result = file_put_contents($filename, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    if ($result === false) {
        throw new Exception('無法寫入檔案');
    }
    
    // 回傳成功訊息
    echo json_encode([
        'success' => true,
        'message' => '資料儲存成功',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
}
?> 