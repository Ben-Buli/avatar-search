# GitHub Pages 部署指南

## 部署步驟

### 1. 準備專案
- 確保所有檔案都在專案根目錄
- 主要檔案：
  - `index.html` (主頁面)
  - `edit.html` (編輯頁面)
  - `styles.css` (樣式)
  - `script.js` (JavaScript)
  - `image_data.json` (圖片資料)
  - `Avatar/` 資料夾 (頭貼圖片)
  - `Accessories/` 資料夾 (配件圖片)

### 2. 上傳到 GitHub
```bash
# 初始化 Git 倉庫
git init
git add .
git commit -m "Initial commit for GitHub Pages deployment"

# 推送到 GitHub
git remote add origin https://github.com/Ben-Buli/avatar-search.git
git push -u origin main
```

### 3. GitHub Pages 設定

1. **前往 GitHub 倉庫設定**
   - 前往您的 GitHub 倉庫頁面
   - 點擊 "Settings" 標籤

2. **啟用 GitHub Pages**
   - 在左側選單中找到 "Pages"
   - 在 "Source" 部分選擇 "Deploy from a branch"
   - 選擇 "main" 分支
   - 選擇 "/ (root)" 資料夾
   - 點擊 "Save"

3. **等待部署**
   - GitHub Pages 會自動開始部署
   - 部署完成後會顯示您的網站 URL

### 4. 自定義域名設定（可選）

1. **在 GitHub Pages 設定中**
   - 在 "Custom domain" 欄位輸入您的域名
   - 點擊 "Save"

2. **DNS 設定**
   - 在您的域名提供商處設定 DNS 記錄
   - 添加 CNAME 記錄指向 `yourusername.github.io`

## 檔案結構

```
avatar-search/
├── index.html          # 主頁面
├── edit.html           # 編輯頁面
├── styles.css          # 樣式檔案
├── script.js           # JavaScript 檔案
├── image_data.json     # 圖片資料
├── Avatar/             # 頭貼圖片資料夾
│   ├── avatar-1.png
│   ├── avatar-2.png
│   └── ...
└── Accessories/        # 配件圖片資料夾
    ├── Frame 427 2.png
    ├── Frame 462.png
    └── ...
```

## 圖片讀取邏輯

### 問題說明
GitHub Pages 是靜態託管服務，不提供目錄列表功能。因此：
- `fetch('/Avatar/')` 會失敗
- 無法動態獲取圖片列表

### 解決方案
1. **預設圖片列表**：在 `script.js` 中維護實際存在的圖片檔案列表
2. **圖片驗證**：部署後自動驗證圖片是否可訪問
3. **路徑處理**：根據部署環境自動調整路徑

### 路徑處理邏輯
```javascript
function getBasePath() {
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    // 本地開發環境
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return '';
    }
    
    // GitHub Pages 用戶頁面
    if (hostname.includes('github.io')) {
        const pathParts = pathname.split('/').filter(part => part);
        if (pathParts.length >= 2) {
            const username = pathParts[0];
            const repoName = pathParts[1];
            return `/${username}/${repoName}`;
        }
    }
    
    return '';
}
```

## 注意事項

1. **圖片檔案大小**
   - GitHub Pages 有檔案大小限制
   - 建議單個檔案小於 100MB
   - 總倉庫大小建議小於 1GB

2. **快取設定**
   - GitHub Pages 會自動快取靜態檔案
   - 更新後可能需要清除瀏覽器快取

3. **安全性**
   - GitHub Pages 只提供靜態檔案服務
   - 不支援伺服器端程式碼

4. **效能優化**
   - 圖片檔案會自動壓縮
   - 使用 CDN 加速

## 故障排除

### 常見問題

1. **404 錯誤**
   - 檢查檔案路徑是否正確
   - 確認檔案已推送到 GitHub

2. **圖片無法載入**
   - 檢查圖片檔案是否存在
   - 查看瀏覽器開發者工具錯誤
   - 確認路徑處理邏輯正確

3. **樣式或 JavaScript 無法載入**
   - 檢查檔案路徑
   - 查看瀏覽器開發者工具錯誤

### 調試步驟

1. **檢查部署狀態**
   - 前往 GitHub 倉庫的 "Actions" 標籤
   - 查看部署是否成功

2. **檢查檔案路徑**
   - 在瀏覽器中直接訪問圖片 URL
   - 確認圖片檔案可正常載入

3. **查看控制台錯誤**
   - 開啟瀏覽器開發者工具
   - 查看 Console 和 Network 標籤的錯誤

### 支援

如果遇到問題，可以：
1. 檢查 GitHub Pages 的部署日誌
2. 查看瀏覽器開發者工具
3. 確認所有檔案都已正確上傳
4. 檢查 `script.js` 中的路徑處理邏輯

## 驗證部署

部署完成後，您可以通過以下 URL 訪問：
- GitHub Pages URL: `https://ben-buli.github.io/avatar-search/`
- 自定義域名（如果設定）: `https://yourdomain.com`

### 測試清單
- [ ] 主頁面正常載入
- [ ] 圖片列表正確顯示
- [ ] 搜尋功能正常
- [ ] 編輯功能正常
- [ ] 圖片下載功能正常
- [ ] 響應式設計正常 