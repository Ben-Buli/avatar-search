# Cloudflare Pages 部署指南

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
git commit -m "Initial commit for Cloudflare Pages deployment"

# 推送到 GitHub
git remote add origin https://github.com/yourusername/avatar-search.git
git push -u origin main
```

### 3. Cloudflare Pages 部署

1. **登入 Cloudflare Dashboard**
   - 前往 https://dash.cloudflare.com
   - 登入您的帳戶

2. **創建 Pages 專案**
   - 點擊 "Pages" → "Create a project"
   - 選擇 "Connect to Git"
   - 選擇您的 GitHub 倉庫

3. **配置部署設定**
   - **Project name**: `avatar-search` (或您喜歡的名稱)
   - **Production branch**: `main`
   - **Framework preset**: `None` (靜態網站)
   - **Build command**: 留空
   - **Build output directory**: `/` (根目錄)
   - **Root directory**: `/` (根目錄)

4. **環境變數** (可選)
   - 目前不需要額外的環境變數

5. **部署**
   - 點擊 "Save and Deploy"
   - 等待部署完成

### 4. 自定義域名設定

1. **在 Cloudflare Pages 中設定**
   - 前往專案設定 → "Custom domains"
   - 點擊 "Set up a custom domain"
   - 輸入 `www.kebalan.org`

2. **DNS 設定**
   - 在 Cloudflare DNS 中確保有以下記錄：
   ```
   Type: CNAME
   Name: www
   Target: your-project-name.pages.dev
   Proxy status: Proxied (橙色雲朵)
   ```

3. **SSL/TLS 設定**
   - 在 Cloudflare SSL/TLS 設定中選擇 "Full" 或 "Full (strict)"

### 5. 驗證部署

部署完成後，您可以通過以下 URL 訪問：
- 預設 URL: `https://your-project-name.pages.dev`
- 自定義域名: `https://www.kebalan.org`

## 檔案結構

```
avatar_search/
├── index.html          # 主頁面
├── edit.html           # 編輯頁面
├── styles.css          # 樣式檔案
├── script.js           # JavaScript 檔案
├── image_data.json     # 圖片資料
├── _headers            # Cloudflare headers 配置
├── _redirects          # Cloudflare 重定向配置
├── Avatar/             # 頭貼圖片資料夾
│   ├── avatar-1.png
│   ├── avatar-2.png
│   └── ...
└── Accessories/        # 配件圖片資料夾
    ├── Frame 427 2.png
    ├── Frame 462.png
    └── ...
```

## 注意事項

1. **圖片檔案大小**
   - Cloudflare Pages 有檔案大小限制
   - 建議圖片檔案小於 25MB
   - 如果圖片太大，考慮壓縮

2. **快取設定**
   - 已配置適當的快取標頭
   - 圖片檔案會快取 1 年
   - HTML 檔案不會快取

3. **安全性**
   - 已設定安全標頭
   - 防止點擊劫持和 XSS 攻擊

4. **效能優化**
   - 靜態檔案會自動壓縮
   - 使用 Cloudflare CDN 加速

## 故障排除

### 常見問題

1. **404 錯誤**
   - 檢查 `_redirects` 檔案配置
   - 確保所有路徑正確

2. **圖片無法載入**
   - 檢查圖片路徑
   - 確保圖片檔案存在

3. **樣式或 JavaScript 無法載入**
   - 檢查檔案路徑
   - 查看瀏覽器開發者工具錯誤

### 支援

如果遇到問題，可以：
1. 檢查 Cloudflare Pages 的部署日誌
2. 查看瀏覽器開發者工具
3. 確認所有檔案都已正確上傳 