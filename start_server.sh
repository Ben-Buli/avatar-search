#!/bin/bash

# 社群頭貼搜尋系統 - 啟動腳本
# 作者：開發團隊
# 版本：1.0.0

echo "🎯 社群頭貼搜尋系統"
echo "=================="
echo ""

# 檢查 Python 是否可用
if command -v python3 &> /dev/null; then
    echo "✅ 檢測到 Python 3"
    echo "🚀 正在啟動 Python HTTP 伺服器..."
    echo "📱 請在瀏覽器中訪問：http://localhost:8000"
    echo "🛑 按 Ctrl+C 停止伺服器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 檢測到 Python"
    echo "🚀 正在啟動 Python HTTP 伺服器..."
    echo "📱 請在瀏覽器中訪問：http://localhost:8000"
    echo "🛑 按 Ctrl+C 停止伺服器"
    echo ""
    python -m http.server 8000
elif command -v php &> /dev/null; then
    echo "✅ 檢測到 PHP"
    echo "🚀 正在啟動 PHP 內建伺服器..."
    echo "📱 請在瀏覽器中訪問：http://localhost:8000"
    echo "🛑 按 Ctrl+C 停止伺服器"
    echo ""
    php -S localhost:8000
else
    echo "❌ 未檢測到 Python 或 PHP"
    echo "請安裝以下任一項："
    echo "  - Python 3: https://www.python.org/downloads/"
    echo "  - PHP: https://www.php.net/downloads.php"
    echo ""
    echo "或者使用其他網頁伺服器（如 Apache、Nginx）"
    exit 1
fi 