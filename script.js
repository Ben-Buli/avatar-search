// 全域變數
let imageData = {};
let allImages = [];
let currentEditingImage = null;
let searchTimeout = null;
let currentQuickFilter = 'all'; // 新增：當前快速篩選狀態

// 分頁相關變數
let currentPage = 1;
let pageSize = 5; // 預設每頁顯示5筆
let filteredImages = []; // 儲存過濾後的圖片列表

// 管理頁面相關變數
let manageFilteredImages = []; // 管理頁面過濾後的圖片
let selectedImages = new Set(); // 選中的圖片

// 圖片編輯相關變數
let imageEditState = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    flipHorizontal: false,
    flipVertical: false,
    rotation: 0,
    cropData: null
};

// 配件相關變數
let accessories = [];
let selectedAccessory = null;
let isDragging = false;
let isResizing = false;
let isRotating = false;

// 通知系統
function showNotification(message, type = 'info', duration = 3000) {
    // 移除現有的通知
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // 創建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // 添加樣式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d1fae5' : type === 'error' ? '#fee2e2' : type === 'warning' ? '#fef3c7' : '#dbeafe'};
        color: ${type === 'success' ? '#065f46' : type === 'error' ? '#991b1b' : type === 'warning' ? '#92400e' : '#1e40af'};
        border: 1px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // 添加動畫樣式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            margin-left: 1rem;
            color: inherit;
        }
        .notification-close:hover {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
    
    // 添加到頁面
    document.body.appendChild(notification);
    
    // 自動移除
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, duration);
    }
}

// DOM 元素
const elements = {
    // 頁面切換
    navTabs: document.querySelectorAll('.nav-tab'),
    pages: document.querySelectorAll('.page'),
    
    // 首頁
    searchInput: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    themeFilter: document.getElementById('themeFilter'),
    resultsCount: document.getElementById('resultsCount'),
    searchResults: document.getElementById('searchResults'),
    sortSelect: document.getElementById('sortSelect'),
    pageSizeSelect: document.getElementById('pageSizeSelect'),
    pagination: document.getElementById('pagination'),
    
    // 管理頁面
    manageThemeFilter: document.getElementById('manageThemeFilter'),
    manageSortSelect: document.getElementById('manageSortSelect'),
    manageSearchInput: document.getElementById('manageSearchInput'),
    clearManageSearch: document.getElementById('clearManageSearch'),
    imageList: document.getElementById('imageList'),
    manageForm: document.getElementById('manageForm'),
    saveAllBtn: document.getElementById('saveAllBtn'),
    selectAllBtn: document.getElementById('selectAllBtn'),
    deselectAllBtn: document.getElementById('deselectAllBtn'),
    localStorageBtn: document.getElementById('localStorageBtn'),
    
    // 模態框
    editModal: document.getElementById('editModal'),
    closeModal: document.getElementById('closeModal'),
    modalImage: document.getElementById('modalImage'),
    hashtagInput: document.getElementById('hashtagInput'),
    hashtagTags: document.getElementById('hashtagTags'),
    hashtagSuggestions: document.getElementById('hashtagSuggestions'),
    modalFilename: document.getElementById('modalFilename'),
    modalTheme: document.getElementById('modalTheme'),
    saveImageBtn: document.getElementById('saveImageBtn'),
    cancelEditBtn: document.getElementById('cancelEditBtn'),
    
    // JSON模態框
    jsonModal: document.getElementById('jsonModal'),
    closeJsonModal: document.getElementById('closeJsonModal'),
    jsonDisplay: document.getElementById('jsonDisplay'),
    copyJsonBtn: document.getElementById('copyJsonBtn'),
    
    // 檔案名稱建議
    filenameSuggestions: document.getElementById('filenameSuggestions'),
    
    // 查看模態框
    viewModal: document.getElementById('viewModal'),
    closeViewModal: document.getElementById('closeViewModal'),
    viewImage: document.getElementById('viewImage'),
    viewImageBackground: document.getElementById('viewImageBackground'),
    viewDisplayName: document.getElementById('viewDisplayName'),
    viewTags: document.getElementById('viewTags'),
    viewTheme: document.getElementById('viewTheme'),
    backgroundColorPicker: document.getElementById('backgroundColorPicker'),
    resetColorBtn: document.getElementById('resetColorBtn'),
    downloadMergedBtn: document.getElementById('downloadMergedBtn'),
    
    // 圖片編輯控制項
    brightnessSlider: document.getElementById('brightnessSlider'),
    contrastSlider: document.getElementById('contrastSlider'),
    saturationSlider: document.getElementById('saturationSlider'),
    brightnessValue: document.getElementById('brightnessValue'),
    contrastValue: document.getElementById('contrastValue'),
    saturationValue: document.getElementById('saturationValue'),
    flipHorizontalBtn: document.getElementById('flipHorizontalBtn'),
    flipVerticalBtn: document.getElementById('flipVerticalBtn'),
    rotate90Btn: document.getElementById('rotate90Btn'),
    cropBtn: document.getElementById('cropBtn'),
    applyCropBtn: document.getElementById('applyCropBtn'),
    cancelCropBtn: document.getElementById('cancelCropBtn'),
    resetAllBtn: document.getElementById('resetAllBtn'),
    
    // 配件控制項
    addAccessoryBtn: document.getElementById('addAccessoryBtn'),
    clearAccessoriesBtn: document.getElementById('clearAccessoriesBtn'),
    accessoriesList: document.getElementById('accessoriesList'),
    accessoriesLibrary: document.getElementById('accessoriesLibrary'),
    closeLibraryBtn: document.getElementById('closeLibraryBtn'),
    accessoriesGrid: document.getElementById('accessoriesGrid'),
    
    // 載入指示器
    loading: document.getElementById('loading'),
    
    // 批量編輯相關元素
    batchEditBtn: document.getElementById('batchEditBtn'),
    batchEditModal: document.getElementById('batchEditModal'),
    closeBatchModal: document.getElementById('closeBatchModal'),
    applyBatchEdit: document.getElementById('applyBatchEdit'),
    cancelBatchEdit: document.getElementById('cancelBatchEdit'),
    selectedCount: document.getElementById('selectedCount'),
    batchHashtagInput: document.getElementById('batchHashtagInput'),
    batchThemeInput: document.getElementById('batchThemeInput'),
    batchHashtagTags: document.getElementById('batchHashtagTags'),
    batchPreviewGrid: document.getElementById('batchPreviewGrid'),
    
    // 底部編輯導航欄
    editBottomNav: document.querySelector('.edit-bottom-nav'),
    editToolPanel: document.querySelector('.edit-tool-panel'),
    resetAdjustBtn: document.getElementById('resetAdjustBtn')
};

// 初始化應用程式
async function initApp() {
    try {
        showLoading();
        
        // 效能監控
        const startTime = performance.now();
        
        // 載入資料
        await loadImageData();
        await loadAllImages();
        
        // 初始化事件監聽器
        initEventListeners();
        
        // 初始化頁面（包含更新主題篩選器）
        initPages();
        
        // 顯示搜尋結果
        performSearch();
        
        // 效能統計
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        console.log(`🚀 系統初始化完成，耗時: ${loadTime.toFixed(2)}ms`);
        
        // 如果載入時間超過 3 秒，顯示提示
        if (loadTime > 3000) {
            showNotification('系統載入較慢，建議檢查網路連線或圖片檔案大小', 'warning', 5000);
        }
        
        // 錯誤追蹤
        window.addEventListener('error', (e) => {
            console.error('系統錯誤:', e.error);
            showNotification('系統發生錯誤，請重新整理頁面', 'error', 5000);
        });
        
        // 未處理的 Promise 錯誤
        window.addEventListener('unhandledrejection', (e) => {
            console.error('未處理的 Promise 錯誤:', e.reason);
            showNotification('系統發生錯誤，請重新整理頁面', 'error', 5000);
        });
        
    } catch (error) {
        console.error('初始化失敗:', error);
        showNotification('初始化失敗，請重新整理頁面', 'error', 5000);
    } finally {
        hideLoading();
    }
}

// 載入圖片資料
async function loadImageData() {
    try {
        // 首先嘗試從 localStorage 載入
        const localStorageData = localStorage.getItem('avatarImageData');
        
        if (localStorageData) {
            // 如果有 localStorage 資料，使用它
            imageData = JSON.parse(localStorageData);
            console.log('從 localStorage 載入圖片資料');
        } else {
            // 如果沒有 localStorage 資料，從檔案載入並設定到 localStorage
            const response = await fetch('image_data.json');
            if (response.ok) {
                imageData = await response.json();
                // 第一次載入時設定到 localStorage
                localStorage.setItem('avatarImageData', JSON.stringify(imageData));
                console.log('從檔案載入圖片資料並設定到 localStorage');
            } else {
                imageData = {};
                localStorage.setItem('avatarImageData', JSON.stringify(imageData));
                console.log('創建新的圖片資料並設定到 localStorage');
            }
        }
    } catch (error) {
        console.log('無法載入圖片資料，將創建新的資料檔案');
        imageData = {};
        localStorage.setItem('avatarImageData', JSON.stringify(imageData));
    }
}

// 載入所有圖片
async function loadAllImages() {
    try {
        const response = await fetch(getBasePath() + '/Avatar/');
        const text = await response.text();
        
        // 解析HTML來獲取圖片列表
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = doc.querySelectorAll('a');
        
        allImages = Array.from(links)
            .map(link => link.href.split('/').pop())
            .filter(filename => filename.match(/\.(png|jpg|jpeg|gif|webp|bmp|tiff|tif|svg|ico|avif|heic|heif)$/i))
            .map(filename => decodeURIComponent(filename))
            .sort(); // 按字母順序排序
            
        console.log(`成功載入 ${allImages.length} 張圖片`);
        
    } catch (error) {
        console.error('載入圖片列表失敗:', error);
        // 如果無法從伺服器獲取，使用預設列表
        allImages = [
            '234234234.png',
            '7a18e69f-d3c8-42ab-8421-f7921a42ce17.png',
            '7ce85efc-767e-4d6a-9108-dbeff7c6d1ee.png',
            '7e02e5ec-81c2-4744-8d68-010a76839265.png',
            '86edb11b-bc15-49f0-863d-268ea39d8bdd.png',
            'bai.png',
            'baqi2.png',
            'buda.png',
            'buda2.png',
            'buda3.png',
            'ca984f06-7e17-4307-b8e0-f42c03d5ffaa.png',
            'chun2.png',
            'chunp.png',
            'd667f703-2a67-4d14-941b-462d5dcfbf83.png',
            'dfb3c5fa-7333-486b-afb8-053d69583b0d.png',
            'f46babe7-da72-4aae-9b26-d34ee60fd24d.png',
            'fang.png',
            'Frame 349.png',
            'Frame 350.png',
            'Frame 351.png',
            'Frame 352.png',
            'Frame 353.png',
            'Frame 354.png',
            'Frame 357.png',
            'Frame 358.png',
            'Frame 359.png',
            'Frame 360.png',
            'Frame 363.png',
            'Frame 364.png',
            'Frame 365.png',
            'Frame 366.png',
            'Frame 367.png',
            'Frame 368.png',
            'Frame 369.png',
            'Frame 370.png',
            'Frame 372.png',
            'Frame 380.png',
            'Frame 386.png',
            'Frame 391.png',
            'Frame 393.png',
            'Frame 394.png',
            'Frame 395.png',
            'Frame 396.png',
            'Frame 397.png',
            'Frame 398.png',
            'Frame 400.png',
            'Frame 404.png',
            'Frame 405.png',
            'Frame 406.png',
            'Frame 407.png',
            'Frame 408.png',
            'Frame 410.png',
            'Frame 412.png',
            'Frame 415.png',
            'image 113.png',
            'image 118.png',
            'image 119.png',
            'image 91 (1).png',
            'imageˋˋˋˋ.png',
            'image22222.png',
            'imageumus.png',
            'imageㄉ2q3.png',
            'imageㄍ.png',
            'kalaaay.png',
            'kalay.png',
            'mjnpei.png',
            'Molly.png',
            'peibudi.png',
            'rayu.png',
            'san1.png',
            'san3.png',
            'yu-1.png',
            'ㄑˇ.png'
        ].sort();
        
        console.log(`使用預設列表載入 ${allImages.length} 張圖片`);
    }
}

// 初始化事件監聽器
function initEventListeners() {
    // 頁面切換
    elements.navTabs.forEach(tab => {
        tab.addEventListener('click', () => switchPage(tab.dataset.tab));
    });
    
    // 首頁事件
    if (elements.searchInput) elements.searchInput.addEventListener('input', handleSearchInput);
    if (elements.clearSearch) elements.clearSearch.addEventListener('click', clearSearch);
    if (elements.themeFilter) elements.themeFilter.addEventListener('change', performSearch);
    if (elements.sortSelect) elements.sortSelect.addEventListener('change', performSearch);
    if (elements.pageSizeSelect) elements.pageSizeSelect.addEventListener('change', handlePageSizeChange);
    
    const exportResultsBtn = document.getElementById('exportResultsBtn');
    if (exportResultsBtn) exportResultsBtn.addEventListener('click', exportSearchResults);
    
    // 快速篩選按鈕
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickFilter);
    });
    
    // 管理頁面事件
    if (elements.manageThemeFilter) elements.manageThemeFilter.addEventListener('change', performManageSearch);
    if (elements.manageSortSelect) elements.manageSortSelect.addEventListener('change', performManageSearch);
    if (elements.manageSearchInput) elements.manageSearchInput.addEventListener('input', handleManageSearchInput);
    if (elements.clearManageSearch) elements.clearManageSearch.addEventListener('click', clearManageSearch);
    if (elements.saveAllBtn) elements.saveAllBtn.addEventListener('click', saveAllChanges);
    if (elements.selectAllBtn) elements.selectAllBtn.addEventListener('click', selectAllImages);
    if (elements.deselectAllBtn) elements.deselectAllBtn.addEventListener('click', deselectAllImages);
    
    // 批量編輯事件
    if (elements.batchEditBtn) elements.batchEditBtn.addEventListener('click', openBatchEditModal);
    if (elements.closeBatchModal) elements.closeBatchModal.addEventListener('click', closeBatchEditModal);
    if (elements.applyBatchEdit) elements.applyBatchEdit.addEventListener('click', applyBatchEditChanges);
    if (elements.cancelBatchEdit) elements.cancelBatchEdit.addEventListener('click', closeBatchEditModal);
    
    // 本地儲存事件
    if (elements.localStorageBtn) elements.localStorageBtn.addEventListener('click', showLocalStorageModal);
    
    const closeLocalStorageModalBtn = document.getElementById('closeLocalStorageModal');
    if (closeLocalStorageModalBtn) closeLocalStorageModalBtn.addEventListener('click', closeLocalStorageModal);
    
    const clearLocalStorageBtn = document.getElementById('clearLocalStorageBtn');
    if (clearLocalStorageBtn) clearLocalStorageBtn.addEventListener('click', clearLocalStorage);
    
    const exportLocalStorageBtn = document.getElementById('exportLocalStorageBtn');
    if (exportLocalStorageBtn) exportLocalStorageBtn.addEventListener('click', exportLocalStorage);
    
    const importLocalStorageBtn = document.getElementById('importLocalStorageBtn');
    if (importLocalStorageBtn) importLocalStorageBtn.addEventListener('click', importLocalStorage);
    
    // 模態框事件
    if (elements.closeModal) elements.closeModal.addEventListener('click', closeModal);
    if (elements.cancelEditBtn) elements.cancelEditBtn.addEventListener('click', closeModal);
    if (elements.saveImageBtn) elements.saveImageBtn.addEventListener('click', saveImageData);
    
    if (elements.closeJsonModal) elements.closeJsonModal.addEventListener('click', closeJsonModal);
    if (elements.copyJsonBtn) elements.copyJsonBtn.addEventListener('click', copyJsonToClipboard);
    
    // 標籤輸入事件
    if (elements.hashtagInput) {
        elements.hashtagInput.addEventListener('input', handleHashtagInput);
        elements.hashtagInput.addEventListener('keydown', handleHashtagKeydown);
    }
    
    if (elements.hashtagTags) elements.hashtagTags.addEventListener('input', updateFilenameSuggestions);
    
    // 模態框背景點擊關閉
    if (elements.editModal) {
        elements.editModal.addEventListener('click', (e) => {
            if (e.target === elements.editModal) {
                closeModal();
            }
        });
    }
    
    if (elements.jsonModal) {
        elements.jsonModal.addEventListener('click', (e) => {
            if (e.target === elements.jsonModal) {
                closeJsonModal();
            }
        });
    }
    
    // 查看模態框事件
    if (elements.closeViewModal) elements.closeViewModal.addEventListener('click', closeViewModal);
    if (elements.backgroundColorPicker) elements.backgroundColorPicker.addEventListener('input', updateBackgroundColor);
    if (elements.resetColorBtn) elements.resetColorBtn.addEventListener('click', resetBackgroundColor);
    if (elements.downloadMergedBtn) elements.downloadMergedBtn.addEventListener('click', downloadMergedImage);
    
    // 圖片編輯控制項事件
    if (elements.brightnessSlider) elements.brightnessSlider.addEventListener('input', updateBrightness);
    if (elements.contrastSlider) elements.contrastSlider.addEventListener('input', updateContrast);
    if (elements.saturationSlider) elements.saturationSlider.addEventListener('input', updateSaturation);
    if (elements.flipHorizontalBtn) elements.flipHorizontalBtn.addEventListener('click', flipHorizontal);
    if (elements.flipVerticalBtn) elements.flipVerticalBtn.addEventListener('click', flipVertical);
    if (elements.rotate90Btn) elements.rotate90Btn.addEventListener('click', rotate90);
    if (elements.cropBtn) elements.cropBtn.addEventListener('click', toggleCropMode);
    if (elements.applyCropBtn) elements.applyCropBtn.addEventListener('click', applyCrop);
    if (elements.cancelCropBtn) elements.cancelCropBtn.addEventListener('click', cancelCrop);
    if (elements.resetAllBtn) elements.resetAllBtn.addEventListener('click', resetAllEdits);
    
    // 配件系統事件
    if (elements.addAccessoryBtn) elements.addAccessoryBtn.addEventListener('click', openAccessoriesLibrary);
    if (elements.clearAccessoriesBtn) elements.clearAccessoriesBtn.addEventListener('click', clearAllAccessories);
    if (elements.closeLibraryBtn) elements.closeLibraryBtn.addEventListener('click', closeAccessoriesLibrary);
    
    // 底部編輯導航欄事件
    initEditBottomNav();
    
    if (elements.viewModal) {
        elements.viewModal.addEventListener('click', (e) => {
            if (e.target === elements.viewModal) {
                closeViewModal();
            }
        });
    }
    
    // 鍵盤快捷鍵支援
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// 初始化底部編輯導航欄
function initEditBottomNav() {
    // 底部導航欄項目點擊事件
    document.querySelectorAll('.edit-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tool = item.dataset.tool;
            showEditTool(tool);
        });
    });
    
    // 工具面板關閉按鈕事件
    document.querySelectorAll('.close-tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            hideEditTool();
        });
    });
    
    // 重置調整按鈕事件
    if (elements.resetAdjustBtn) {
        elements.resetAdjustBtn.addEventListener('click', resetAdjustments);
    }
}

// 顯示編輯工具
function showEditTool(toolName) {
    // 移除所有活動狀態
    document.querySelectorAll('.edit-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 隱藏所有工具面板
    document.querySelectorAll('.tool-content').forEach(content => {
        content.style.display = 'none';
    });
    
    // 激活選中的導航項目
    const activeNavItem = document.querySelector(`[data-tool="${toolName}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // 顯示對應的工具面板
    const toolContent = document.getElementById(`${toolName}Tool`);
    if (toolContent && elements.editToolPanel) {
        toolContent.style.display = 'block';
        elements.editToolPanel.classList.add('show');
    }
}

// 隱藏編輯工具
function hideEditTool() {
    // 移除所有活動狀態
    document.querySelectorAll('.edit-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 隱藏工具面板
    if (elements.editToolPanel) {
        elements.editToolPanel.classList.remove('show');
    }
    
    // 隱藏所有工具內容
    document.querySelectorAll('.tool-content').forEach(content => {
        content.style.display = 'none';
    });
}

// 重置調整
function resetAdjustments() {
    // 重置滑桿值
    if (elements.brightnessSlider) elements.brightnessSlider.value = 100;
    if (elements.contrastSlider) elements.contrastSlider.value = 100;
    if (elements.saturationSlider) elements.saturationSlider.value = 100;
    
    // 更新顯示值
    if (elements.brightnessValue) elements.brightnessValue.textContent = '100%';
    if (elements.contrastValue) elements.contrastValue.textContent = '100%';
    if (elements.saturationValue) elements.saturationValue.textContent = '100%';
    
    // 重置圖片編輯狀態
    imageEditState.brightness = 100;
    imageEditState.contrast = 100;
    imageEditState.saturation = 100;
    
    // 重新套用濾鏡
    applyImageFilters();
    
    showNotification('已重置所有調整', 'success');
}

// 鍵盤快捷鍵處理
function handleKeyboardShortcuts(e) {
    // 只在非輸入框中處理快捷鍵
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // Ctrl/Cmd + S: 儲存所有變更
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (elements.saveAllBtn) {
            elements.saveAllBtn.click();
        }
    }
    
    // Ctrl/Cmd + F: 聚焦搜尋框
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const activePage = document.querySelector('.page.active');
        if (activePage.id === 'searchPage') {
            elements.searchInput.focus();
        } else if (activePage.id === 'managePage') {
            elements.manageSearchInput.focus();
        }
    }
    
    // Ctrl/Cmd + A: 全選（在管理頁面）
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const activePage = document.querySelector('.page.active');
        if (activePage.id === 'managePage' && elements.selectAllBtn) {
            elements.selectAllBtn.click();
        }
    }
    
    // Escape: 關閉模態框
    if (e.key === 'Escape') {
        if (elements.editModal && elements.editModal.classList.contains('active')) {
            closeModal();
        } else if (elements.jsonModal && elements.jsonModal.classList.contains('active')) {
            closeJsonModal();
        } else if (elements.viewModal && elements.viewModal.classList.contains('active')) {
            closeViewModal();
        }
    }
    
    // 數字鍵 1-3: 快速切換頁面
    if (e.key >= '1' && e.key <= '3') {
        const pages = ['searchPage', 'managePage', 'testPage'];
        const pageIndex = parseInt(e.key) - 1;
        if (pages[pageIndex]) {
            switchPage(pages[pageIndex]);
        }
    }
}

// 頁面切換
function switchPage(pageId) {
    // 更新導航標籤
    elements.navTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === pageId);
    });
    
    // 更新頁面顯示
    elements.pages.forEach(page => {
        page.classList.toggle('active', page.id === pageId);
    });
    
    // 根據頁面執行相應操作
    if (pageId === 'home') {
        performSearch();
    } else if (pageId === 'manage') {
        performManageSearch();
    }
}

// 初始化頁面
function initPages() {
    // 初始化主題篩選器
    updateThemeFilters();
    
    // 渲染管理頁面
    performManageSearch();
}

// 更新主題篩選器
function updateThemeFilters() {
    // 確保 imageData 和 elements 已初始化
    if (!imageData || !elements.themeFilter || !elements.manageThemeFilter) {
        return;
    }
    
    const themes = new Set();
    
    Object.values(imageData).forEach(data => {
        if (data.theme) {
            themes.add(data.theme);
        }
    });
    
    const themeOptions = Array.from(themes).sort();
    
    // 更新搜尋頁面的主題篩選器
    elements.themeFilter.innerHTML = '<option value="">全部主題</option>';
    themeOptions.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        elements.themeFilter.appendChild(option);
    });
    
    // 更新管理頁面的主題篩選器
    elements.manageThemeFilter.innerHTML = '<option value="">全部主題</option>';
    themeOptions.forEach(theme => {
        const option = document.createElement('option');
        option.value = theme;
        option.textContent = theme;
        elements.manageThemeFilter.appendChild(option);
    });
}

// 搜尋輸入處理
function handleSearchInput() {
    // 清除之前的延遲
    if (searchTimeout) {
        clearTimeout(searchTimeout);
    }
    
    // 設置新的延遲搜尋
    searchTimeout = setTimeout(() => {
        performSearch();
    }, 300);
}

// 執行搜尋
function performSearch() {
    // 確保必要元素已初始化
    if (!elements.searchInput || !elements.themeFilter || !elements.sortSelect) {
        return;
    }
    
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const selectedTheme = elements.themeFilter.value;
    const sortOption = elements.sortSelect.value; // 獲取排序選項
    
    // 重置分頁
    currentPage = 1;
    
    let filteredImages = allImages;
    
    // 根據搜尋詞篩選
    if (searchTerm) {
        filteredImages = allImages.filter(filename => {
            const data = imageData[filename] || {};
            const hashtags = data.hashtags || [];
            const theme = data.theme || '';
            const displayName = data.displayName || filename;
            
            // 1. 精確匹配
            const exactMatch = filename.toLowerCase().includes(searchTerm) ||
                   displayName.toLowerCase().includes(searchTerm) ||
                   hashtags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                   theme.toLowerCase().includes(searchTerm);
            
            if (exactMatch) return true;
            
            // 2. 模糊搜尋（容錯搜尋）
            const cleanSearchTerm = searchTerm.replace(/[^a-zA-Z0-9\u4e00-\u9fff]/g, '');
            const fuzzyMatch = filename.toLowerCase().includes(cleanSearchTerm) ||
                   displayName.toLowerCase().includes(cleanSearchTerm) ||
                   hashtags.some(tag => tag.toLowerCase().includes(cleanSearchTerm));
            
            if (fuzzyMatch) return true;
            
            // 3. 拼音搜尋（支援中文拼音）
            const pinyinMatch = checkPinyinMatch(searchTerm, displayName, hashtags);
            if (pinyinMatch) return true;
            
            // 4. 部分詞匹配
            const words = searchTerm.split(/\s+/);
            const partialMatch = words.some(word => 
                filename.toLowerCase().includes(word) ||
                displayName.toLowerCase().includes(word) ||
                hashtags.some(tag => tag.toLowerCase().includes(word)) ||
                theme.toLowerCase().includes(word)
            );
            
            return partialMatch;
        });
    }
    
    // 根據主題篩選
    if (selectedTheme) {
        filteredImages = filteredImages.filter(filename => {
            const data = imageData[filename] || {};
            return data.theme === selectedTheme;
        });
    }
    
    // 根據快速篩選篩選
    if (currentQuickFilter === 'hashtags') {
        filteredImages = filteredImages.filter(filename => {
            const data = imageData[filename] || {};
            return (data.hashtags && data.hashtags.length > 0);
        });
    } else if (currentQuickFilter === 'theme') {
        filteredImages = filteredImages.filter(filename => {
            const data = imageData[filename] || {};
            return (data.theme && data.theme.trim() !== '');
        });
    }

    // 根據排序選項排序
    if (sortOption === 'name') {
        filteredImages.sort((a, b) => {
            const dataA = imageData[a] || {};
            const dataB = imageData[b] || {};
            const displayNameA = dataA.displayName || a;
            const displayNameB = dataB.displayName || b;
            return displayNameA.localeCompare(displayNameB);
        });
    } else if (sortOption === 'hashtags') {
        filteredImages.sort((a, b) => {
            const dataA = imageData[a] || {};
            const dataB = imageData[b] || {};
            const hashtagsA = dataA.hashtags || [];
            const hashtagsB = dataB.hashtags || [];
            return hashtagsB.length - hashtagsA.length; // 降序排列
        });
    } else if (sortOption === 'theme') {
        filteredImages.sort((a, b) => {
            const dataA = imageData[a] || {};
            const dataB = imageData[b] || {};
            const themeA = dataA.theme || '';
            const themeB = dataB.theme || '';
            return themeA.localeCompare(themeB); // 升序排列
        });
    }
    
    // 儲存過濾後的圖片列表
    window.filteredImages = filteredImages;
    
    // 更新結果計數
    elements.resultsCount.textContent = `找到 ${filteredImages.length} 個結果`;
    
    // 添加統計資訊
    const stats = getSearchStats(filteredImages);
    if (stats.total > 0) {
        elements.resultsCount.innerHTML = `
            <span>找到 ${filteredImages.length} 個結果</span>
            <div class="search-stats">
                <span class="stat-item">有標籤: ${stats.withHashtags}</span>
                <span class="stat-item">有主題: ${stats.withTheme}</span>
            </div>
        `;
        // 顯示匯出按鈕
        document.getElementById('exportResultsBtn').style.display = 'flex';
    } else {
        // 隱藏匯出按鈕
        document.getElementById('exportResultsBtn').style.display = 'none';
    }
    
    // 渲染搜尋結果（包含分頁）
    renderSearchResultsWithPagination(filteredImages);
}

// 新增：拼音搜尋輔助函數
function checkPinyinMatch(searchTerm, displayName, hashtags) {
    // 簡單的拼音匹配邏輯
    const pinyinMap = {
        'a': '啊阿',
        'b': '不白百',
        'c': '從此',
        'd': '的得地',
        'e': '額',
        'f': '發方',
        'g': '個給',
        'h': '好很',
        'i': '一',
        'j': '就進',
        'k': '可看',
        'l': '來裡',
        'm': '嗎麼',
        'n': '你年',
        'o': '哦',
        'p': '平',
        'q': '去前',
        'r': '人日',
        's': '是說',
        't': '他她',
        'u': '有',
        'v': '為',
        'w': '我為',
        'x': '小下',
        'y': '有要',
        'z': '在子'
    };
    
    // 檢查搜尋詞是否為拼音
    if (/^[a-z]+$/.test(searchTerm)) {
        const possibleChars = pinyinMap[searchTerm[0]] || '';
        return possibleChars.split('').some(char => 
            displayName.includes(char) ||
            hashtags.some(tag => tag.includes(char))
        );
    }
    
    return false;
}

// 批量編輯相關函數
function updateBatchEditButton() {
    if (elements.batchEditBtn) {
        if (selectedImages.size > 0) {
            elements.batchEditBtn.style.display = 'inline-flex';
            elements.batchEditBtn.innerHTML = `<i class="fas fa-edit"></i> 批量編輯 (${selectedImages.size})`;
        } else {
            elements.batchEditBtn.style.display = 'none';
        }
    }
}

function openBatchEditModal() {
    if (selectedImages.size === 0) {
        showNotification('請先選擇要編輯的圖片', 'warning');
        return;
    }
    
    // 更新選中數量
    if (elements.selectedCount) {
        elements.selectedCount.textContent = selectedImages.size;
    }
    
    // 清空預覽
    if (elements.batchPreviewGrid) {
        elements.batchPreviewGrid.innerHTML = '';
        
        // 添加預覽圖片
        Array.from(selectedImages).forEach(filename => {
            const previewItem = document.createElement('div');
            previewItem.className = 'batch-preview-item selected';
            previewItem.innerHTML = `<img src="${getAvatarPath(filename)}" alt="${filename}">`;
            elements.batchPreviewGrid.appendChild(previewItem);
        });
    }
    
    // 顯示模態框
    if (elements.batchEditModal) {
        elements.batchEditModal.classList.add('active');
    }
}

function closeBatchEditModal() {
    if (elements.batchEditModal) {
        elements.batchEditModal.classList.remove('active');
    }
    
    // 清空輸入
    if (elements.batchHashtagInput) elements.batchHashtagInput.value = '';
    if (elements.batchThemeInput) elements.batchThemeInput.value = '';
    if (elements.batchHashtagTags) elements.batchHashtagTags.innerHTML = '';
}

function applyBatchEditChanges() {
    const hashtagInput = elements.batchHashtagInput;
    const themeInput = elements.batchThemeInput;
    const batchMode = document.querySelector('input[name="batchMode"]:checked');
    
    if (!hashtagInput || !themeInput || !batchMode) {
        showNotification('批量編輯功能初始化失敗', 'error');
        return;
    }
    
    const newHashtags = hashtagInput.value.trim().split(/\s+/).filter(tag => tag.length > 0);
    const newTheme = themeInput.value.trim();
    
    if (newHashtags.length === 0 && !newTheme) {
        showNotification('請輸入要添加的標籤或主題', 'warning');
        return;
    }
    
    // 應用批量編輯
    Array.from(selectedImages).forEach(filename => {
        if (!imageData[filename]) {
            imageData[filename] = {};
        }
        
        // 處理標籤
        if (newHashtags.length > 0) {
            if (batchMode.value === 'add') {
                // 添加模式：保留現有標籤，添加新標籤
                const existingHashtags = imageData[filename].hashtags || [];
                const uniqueNewHashtags = newHashtags.filter(tag => !existingHashtags.includes(tag));
                imageData[filename].hashtags = [...existingHashtags, ...uniqueNewHashtags];
            } else {
                // 替換模式：覆蓋現有標籤
                imageData[filename].hashtags = [...newHashtags];
            }
        }
        
        // 處理主題
        if (newTheme) {
            if (batchMode.value === 'add' && imageData[filename].theme) {
                // 添加模式：如果已有主題，則不覆蓋
                // 這裡可以根據需求調整邏輯
            } else {
                // 替換模式或沒有現有主題
                imageData[filename].theme = newTheme;
            }
        }
    });
    
    // 關閉模態框
    closeBatchEditModal();
    
    // 重新渲染管理頁面
    renderManageForm(manageFilteredImages);
    
    // 顯示成功訊息
            showNotification(`成功批量編輯 ${selectedImages.size} 張圖片`, 'success');
}

// localStorage 相關函數
function showLocalStorageModal() {
    const modal = document.getElementById('localStorageModal');
    const status = document.getElementById('localStorageStatus');
    const size = document.getElementById('localStorageSize');
    const lastUpdate = document.getElementById('localStorageLastUpdate');
    const imageCount = document.getElementById('localStorageImageCount');
    const preview = document.getElementById('localStoragePreview');
    
    // 檢查 localStorage 狀態
    const localStorageData = localStorage.getItem('avatarImageData');
    
    if (localStorageData) {
        const data = JSON.parse(localStorageData);
        const dataSize = new Blob([localStorageData]).size;
        
        status.textContent = '✅ 已儲存';
        status.style.color = '#10b981';
        size.textContent = `${(dataSize / 1024).toFixed(2)} KB`;
        lastUpdate.textContent = new Date().toLocaleString();
        imageCount.textContent = Object.keys(data).length;
        
        // 顯示資料預覽
        const previewData = JSON.stringify(data, null, 2);
        preview.textContent = previewData.length > 500 ? 
            previewData.substring(0, 500) + '...' : previewData;
    } else {
        status.textContent = '❌ 未儲存';
        status.style.color = '#ef4444';
        size.textContent = '0 KB';
        lastUpdate.textContent = '無';
        imageCount.textContent = '0';
        preview.textContent = '無資料';
    }
    
    modal.classList.add('active');
}

function closeLocalStorageModal() {
    const modal = document.getElementById('localStorageModal');
    modal.classList.remove('active');
}

function clearLocalStorage() {
    if (confirm('確定要清除本地儲存的所有資料嗎？此操作無法復原。')) {
        localStorage.removeItem('avatarImageData');
        imageData = {};
        alert('本地儲存已清除');
        closeLocalStorageModal();
        // 重新載入頁面以反映變更
        location.reload();
    }
}

function exportLocalStorage() {
    const localStorageData = localStorage.getItem('avatarImageData');
    if (!localStorageData) {
        alert('沒有可匯出的資料');
        return;
    }
    
    const blob = new Blob([localStorageData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `avatar_image_data_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('資料已匯出');
}

function importLocalStorage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                localStorage.setItem('avatarImageData', JSON.stringify(data));
                imageData = data;
                alert('資料已成功匯入');
                closeLocalStorageModal();
                // 重新載入頁面以反映變更
                location.reload();
            } catch (error) {
                alert('匯入失敗：檔案格式不正確');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

// 處理頁面大小變更
function handlePageSizeChange() {
    const newPageSize = elements.pageSizeSelect.value;
    pageSize = newPageSize === 'all' ? Infinity : parseInt(newPageSize);
    currentPage = 1; // 重置到第一頁
    
    if (window.filteredImages) {
        renderSearchResultsWithPagination(window.filteredImages);
    }
}

// 渲染搜尋結果（包含分頁）
function renderSearchResultsWithPagination(images) {
    const totalImages = images.length;
    const totalPages = pageSize === Infinity ? 1 : Math.ceil(totalImages / pageSize);
    
    // 計算當前頁的圖片
    let currentPageImages;
    if (pageSize === Infinity) {
        currentPageImages = images;
    } else {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        currentPageImages = images.slice(startIndex, endIndex);
    }
    
    // 渲染當前頁的圖片
    renderSearchResults(currentPageImages);
    
    // 渲染分頁控制項
    renderPagination(totalPages, totalImages);
}

// 渲染分頁控制項
function renderPagination(totalPages, totalImages) {
    if (pageSize === Infinity || totalPages <= 1) {
        elements.pagination.style.display = 'none';
        return;
    }
    
    elements.pagination.style.display = 'flex';
    
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalImages);
    
    let paginationHTML = `
        <button class="pagination-btn" onclick="goToPage(1)" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-angle-double-left"></i>
        </button>
        <button class="pagination-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-angle-left"></i>
        </button>
        <span class="pagination-info">第 ${startItem}-${endItem} 筆，共 ${totalImages} 筆</span>
    `;
    
    // 顯示頁碼按鈕
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    paginationHTML += `
        <button class="pagination-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-angle-right"></i>
        </button>
        <button class="pagination-btn" onclick="goToPage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-angle-double-right"></i>
        </button>
    `;
    
    elements.pagination.innerHTML = paginationHTML;
}

// 跳轉到指定頁面
function goToPage(page) {
    if (window.filteredImages) {
        currentPage = page;
        renderSearchResultsWithPagination(window.filteredImages);
    }
}

// 渲染搜尋結果
function renderSearchResults(images) {
    elements.searchResults.innerHTML = '';
    
    if (images.length === 0) {
        elements.searchResults.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <p>沒有找到符合的圖片</p>
            </div>
        `;
        return;
    }
    
    images.forEach(filename => {
        const data = imageData[filename] || {};
        const hashtags = data.hashtags || [];
        const displayName = data.displayName || filename;
        const hasBackground = data.hasBackground || false;
        
        const card = document.createElement('div');
        card.className = 'image-card';
        card.innerHTML = `
                            <img src="${getAvatarPath(filename)}" alt="${filename}" loading="lazy">
            <button class="download-btn" onclick="downloadImage('${filename}')">
                <i class="fas fa-download"></i>
            </button>
            <div class="image-info">
                <div class="image-name">${displayName}</div>
                <div class="image-tags">
                    ${hashtags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                    ${hasBackground ? `<span class="tag" style="background: rgba(34, 197, 94, 0.1); color: #16a34a; border: 1px solid rgba(34, 197, 94, 0.2);">有背景</span>` : ''}
                </div>
            </div>
        `;
        
        // 添加點擊事件
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.download-btn')) {
                // 跳轉到編輯頁面
                window.location.href = `edit.html?image=${encodeURIComponent(filename)}`;
            }
        });
        
        elements.searchResults.appendChild(card);
    });
}

// 清除搜尋
function clearSearch() {
    elements.searchInput.value = '';
    elements.themeFilter.value = '';
    currentQuickFilter = 'all';
    currentPage = 1; // 重置分頁
    updateQuickFilterButtons();
    performSearch();
}

// 處理快速篩選
function handleQuickFilter(e) {
    const filterType = e.currentTarget.dataset.filter;
    currentQuickFilter = filterType;
    currentPage = 1; // 重置分頁
    
    // 更新按鈕狀態
    updateQuickFilterButtons();
    
    // 執行搜尋
    performSearch();
}

// 更新快速篩選按鈕狀態
function updateQuickFilterButtons() {
    document.querySelectorAll('.quick-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === currentQuickFilter);
    });
}

// 獲取搜尋統計資訊
function getSearchStats(images) {
    let withHashtags = 0;
    let withTheme = 0;
    
    images.forEach(filename => {
        const data = imageData[filename] || {};
        if (data.hashtags && data.hashtags.length > 0) {
            withHashtags++;
        }
        if (data.theme && data.theme.trim() !== '') {
            withTheme++;
        }
    });
    
    return {
        total: images.length,
        withHashtags,
        withTheme
    };
}

// 處理管理頁面搜尋輸入
function handleManageSearchInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performManageSearch();
    }, 300);
}

// 執行管理頁面搜尋
function performManageSearch() {
    // 確保必要元素已初始化
    if (!elements.manageSearchInput || !elements.manageThemeFilter || !elements.manageSortSelect) {
        return;
    }
    
    const searchTerm = elements.manageSearchInput.value.toLowerCase().trim();
    const selectedTheme = elements.manageThemeFilter.value;
    const sortOption = elements.manageSortSelect.value;
    
    let filteredImages = allImages;
    
    // 根據搜尋詞篩選
    if (searchTerm) {
        filteredImages = allImages.filter(filename => {
            const data = imageData[filename] || {};
            const hashtags = data.hashtags || [];
            const theme = data.theme || '';
            const displayName = data.displayName || filename;
            
            return filename.toLowerCase().includes(searchTerm) ||
                   displayName.toLowerCase().includes(searchTerm) ||
                   hashtags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                   theme.toLowerCase().includes(searchTerm);
        });
    }
    
    // 根據主題篩選
    if (selectedTheme) {
        filteredImages = filteredImages.filter(filename => {
            const data = imageData[filename] || {};
            return data.theme === selectedTheme;
        });
    }
    
    // 根據排序選項排序
    if (sortOption === 'name') {
        filteredImages.sort((a, b) => {
            const dataA = imageData[a] || {};
            const dataB = imageData[b] || {};
            const displayNameA = dataA.displayName || a;
            const displayNameB = dataB.displayName || b;
            return displayNameA.localeCompare(displayNameB);
        });
    } else if (sortOption === 'hashtags') {
        filteredImages.sort((a, b) => {
            const dataA = imageData[a] || {};
            const dataB = imageData[b] || {};
            const hashtagsA = dataA.hashtags || [];
            const hashtagsB = dataB.hashtags || [];
            return hashtagsB.length - hashtagsA.length;
        });
    } else if (sortOption === 'theme') {
        filteredImages.sort((a, b) => {
            const dataA = imageData[a] || {};
            const dataB = imageData[b] || {};
            const themeA = dataA.theme || '';
            const themeB = dataB.theme || '';
            return themeA.localeCompare(themeB);
        });
    }
    
    // 儲存過濾後的圖片列表
    manageFilteredImages = filteredImages;
    
    // 渲染管理表單
    renderManageForm(filteredImages);
}

// 清除管理頁面搜尋
function clearManageSearch() {
    elements.manageSearchInput.value = '';
    elements.manageThemeFilter.value = '';
    elements.manageSortSelect.value = 'name';
    performManageSearch();
}

// 全選圖片
function selectAllImages() {
    manageFilteredImages.forEach(filename => {
        selectedImages.add(filename);
    });
    renderManageForm(manageFilteredImages);
    updateBatchEditButton();
}

// 取消全選圖片
function deselectAllImages() {
    selectedImages.clear();
    renderManageForm(manageFilteredImages);
    updateBatchEditButton();
}

// 渲染管理頁面表單
function renderManageForm(images) {
    elements.imageList.innerHTML = '';
    
    images.forEach(filename => {
        const data = imageData[filename] || {};
        const hashtags = data.hashtags || [];
        const theme = data.theme || '';
        const displayName = data.displayName || filename;
        const hasBackground = data.hasBackground || false;
        const isSelected = selectedImages.has(filename);
        
        const card = document.createElement('div');
        card.className = `manage-image-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            <div class="manage-image-header">
                <div class="manage-image-checkbox-wrapper">
                    <input type="checkbox" class="manage-image-checkbox" 
                           data-filename="${filename}" 
                           ${isSelected ? 'checked' : ''}>
                    <span class="manage-image-name">${displayName}</span>
                </div>
                <button class="manage-edit-btn" data-filename="${filename}" title="編輯詳細資訊">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
            
            <div class="manage-image-preview-container">
                <img src="${getAvatarPath(filename)}" alt="${filename}" 
                     class="manage-image-preview" loading="lazy">
                <div class="manage-image-overlay">
                    <div class="manage-image-info">
                        <div class="manage-image-tags">
                            ${hashtags.length > 0 ? hashtags.slice(0, 3).map(tag => 
                                `<span class="manage-tag">${tag}</span>`
                            ).join('') : '<span class="manage-no-tags">無標籤</span>'}
                            ${hashtags.length > 3 ? `<span class="manage-more-tags">+${hashtags.length - 3}</span>` : ''}
                        </div>
                        <div class="manage-image-theme">
                            ${theme ? `<span class="manage-theme">${theme}</span>` : '<span class="manage-no-theme">無主題</span>'}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="manage-form-compact">
                <div class="manage-form-group">
                    <label for="displayName_${filename}">顯示名稱:</label>
                    <input type="text" id="displayName_${filename}" 
                           class="manage-form-input compact" 
                           value="${displayName}" 
                           data-filename="${filename}" 
                           data-field="displayName"
                           placeholder="輸入顯示名稱">
                </div>
                
                <div class="manage-form-group">
                    <label for="hashtags_${filename}">標籤:</label>
                    <input type="text" id="hashtags_${filename}" 
                           class="manage-form-input compact" 
                           value="${hashtags.join(', ')}" 
                           data-filename="${filename}" 
                           data-field="hashtags" 
                           placeholder="標籤1, 標籤2, 標籤3">
                </div>
                
                <div class="manage-form-group">
                    <label for="theme_${filename}">主題:</label>
                    <input type="text" id="theme_${filename}" 
                           class="manage-form-input compact" 
                           value="${theme}" 
                           data-filename="${filename}" 
                           data-field="theme" 
                           placeholder="輸入主題">
                </div>
                
                <div class="manage-form-checkbox">
                    <input type="checkbox" id="hasBackground_${filename}" 
                           data-filename="${filename}" 
                           data-field="hasBackground" 
                           ${hasBackground ? 'checked' : ''}>
                    <label for="hasBackground_${filename}">已有背景</label>
                </div>
            </div>
        `;
        
        elements.imageList.appendChild(card);
    });
    
    // 添加事件監聽器
    addManageFormEventListeners();
}

// 添加管理表單事件監聽器
function addManageFormEventListeners() {
    // 選中/取消選中圖片
    document.querySelectorAll('.manage-image-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const filename = e.target.dataset.filename;
            if (e.target.checked) {
                selectedImages.add(filename);
            } else {
                selectedImages.delete(filename);
            }
            
            // 更新批量編輯按鈕
            updateBatchEditButton();
            
            // 更新卡片樣式
            const card = e.target.closest('.manage-image-card');
            card.classList.toggle('selected', e.target.checked);
        });
    });
    
    // 輸入欄位變更
    document.querySelectorAll('.manage-form-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const filename = e.target.dataset.filename;
            const field = e.target.dataset.field;
            let value = e.target.value;
            
            // 處理標籤欄位
            if (field === 'hashtags') {
                value = value.split(',').map(tag => tag.trim()).filter(tag => tag);
            }
            
            // 更新 imageData
            if (!imageData[filename]) {
                imageData[filename] = {};
            }
            imageData[filename][field] = value;
        });
    });
    
    // 背景選項變更
    document.querySelectorAll('input[data-field="hasBackground"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const filename = e.target.dataset.filename;
            const field = e.target.dataset.field;
            
            if (!imageData[filename]) {
                imageData[filename] = {};
            }
            imageData[filename][field] = e.target.checked;
        });
    });
    
    // 編輯按鈕點擊事件
    document.querySelectorAll('.manage-edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const filename = btn.dataset.filename;
            openEditModal(filename);
        });
    });
}

// 篩選管理頁面圖片
function filterManageImages() {
    const selectedTheme = elements.manageThemeFilter.value;
    const cards = elements.imageList.querySelectorAll('.manage-image-card');
    
    cards.forEach(card => {
        const filename = card.querySelector('.manage-image-name').textContent;
        const data = imageData[filename] || {};
        const theme = data.theme || '';
        
        if (!selectedTheme || theme === selectedTheme) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 開啟編輯模態框
function openEditModal(filename) {
    currentEditingImage = filename;
    const data = imageData[filename] || {};
    const hashtags = data.hashtags || [];
    const theme = data.theme || '';
    const displayName = data.displayName || filename;
    const hasBackground = data.hasBackground || false;
    
    // 設置模態框內容
            elements.modalImage.src = getAvatarPath(filename);
    elements.modalFilename.value = displayName;
    elements.modalTheme.value = theme;
    document.getElementById('modalHasBackground').checked = hasBackground;
    
    // 渲染 hashtag 標籤
    renderHashtagTags(hashtags);
    
    // 更新檔案名稱建議
    updateFilenameSuggestions();
    
    // 顯示模態框
    elements.editModal.classList.add('active');
    
    // 聚焦到 hashtag 輸入框
    setTimeout(() => {
        elements.hashtagInput.focus();
    }, 100);
}

// 關閉模態框
function closeModal() {
    elements.editModal.classList.remove('active');
    currentEditingImage = null;
    elements.hashtagInput.value = '';
    elements.hashtagSuggestions.style.display = 'none';
}

// 渲染 hashtag 標籤
function renderHashtagTags(hashtags) {
    elements.hashtagTags.innerHTML = '';
    
    hashtags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'hashtag-tag';
        tagElement.innerHTML = `
            ${tag}
            <button class="remove-tag" onclick="removeHashtag('${tag}')">×</button>
        `;
        elements.hashtagTags.appendChild(tagElement);
    });
}

// 移除 hashtag
function removeHashtag(tagToRemove) {
    const currentTags = Array.from(elements.hashtagTags.children).map(el => 
        el.textContent.replace('×', '').trim()
    );
    
    const newTags = currentTags.filter(tag => tag !== tagToRemove);
    renderHashtagTags(newTags);
    
    // 更新檔案名稱建議
    updateFilenameSuggestions();
}

// 處理 hashtag 輸入
function handleHashtagInput() {
    const input = elements.hashtagInput.value.trim();
    
    if (input.length === 0) {
        elements.hashtagSuggestions.style.display = 'none';
        return;
    }
    
    // 獲取所有現有的 hashtags
    const allHashtags = new Set();
    Object.values(imageData).forEach(data => {
        (data.hashtags || []).forEach(tag => allHashtags.add(tag));
    });
    
    // 篩選建議
    const suggestions = Array.from(allHashtags)
        .filter(tag => tag.toLowerCase().includes(input.toLowerCase()))
        .slice(0, 5);
    
    if (suggestions.length > 0) {
        elements.hashtagSuggestions.innerHTML = suggestions.map(tag => 
            `<div class="suggestion-item" onclick="selectSuggestion('${tag}')">${tag}</div>`
        ).join('');
        elements.hashtagSuggestions.style.display = 'block';
    } else {
        elements.hashtagSuggestions.style.display = 'none';
    }
}

// 處理 hashtag 鍵盤事件
function handleHashtagKeydown(e) {
    if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addHashtag();
    } else if (e.key === 'Escape') {
        elements.hashtagSuggestions.style.display = 'none';
    }
}

// 選擇建議
function selectSuggestion(tag) {
    addHashtag(tag);
    elements.hashtagSuggestions.style.display = 'none';
}

// 新增 hashtag
function addHashtag(specificTag = null) {
    const input = specificTag || elements.hashtagInput.value.trim();
    
    if (!input) return;
    
    // 清理輸入（移除 # 符號和多餘空格）
    const cleanTag = input.replace(/^#+/, '').trim();
    
    if (!cleanTag) return;
    
    // 檢查是否已存在
    const currentTags = Array.from(elements.hashtagTags.children).map(el => 
        el.textContent.replace('×', '').trim()
    );
    
    if (currentTags.includes(cleanTag)) {
        elements.hashtagInput.value = '';
        return;
    }
    
    // 新增標籤
    const tagElement = document.createElement('div');
    tagElement.className = 'hashtag-tag';
    tagElement.innerHTML = `
        ${cleanTag}
        <button class="remove-tag" onclick="removeHashtag('${cleanTag}')">×</button>
    `;
    elements.hashtagTags.appendChild(tagElement);
    
    // 清空輸入框
    elements.hashtagInput.value = '';
    elements.hashtagSuggestions.style.display = 'none';
    
    // 更新檔案名稱建議
    updateFilenameSuggestions();
}

// 儲存圖片資料
function saveImageData() {
    if (!currentEditingImage) return;
    
    const hashtags = Array.from(elements.hashtagTags.children).map(el => 
        el.textContent.replace('×', '').trim()
    );
    const theme = elements.modalTheme.value.trim();
    const displayName = elements.modalFilename.value.trim();
    const hasBackground = document.getElementById('modalHasBackground').checked;
    
    // 更新資料
    imageData[currentEditingImage] = {
        hashtags: hashtags,
        theme: theme,
        displayName: displayName,
        originalFilename: currentEditingImage,
        hasBackground: hasBackground
    };
    
    // 更新主題篩選器
    updateThemeFilters();
    
    // 關閉模態框
    closeModal();
    
    // 重新渲染頁面
    if (document.getElementById('home').classList.contains('active')) {
        performSearch();
    }
    if (document.getElementById('manage').classList.contains('active')) {
        performManageSearch();
    }
}

// 儲存所有變更
async function saveAllChanges() {
    showLoading();
    
    try {
        // 首先更新 localStorage
        localStorage.setItem('avatarImageData', JSON.stringify(imageData));
        console.log('已更新 localStorage');
        
        // 然後嘗試儲存到伺服器
        const response = await fetch('save_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(imageData)
        });
        
        if (response.ok) {
            console.log('已成功儲存到伺服器');
            // 顯示JSON模態框
            showJsonModal();
        } else {
            throw new Error('伺服器儲存失敗');
        }
    } catch (error) {
        console.error('伺服器儲存失敗:', error);
        
        // 即使伺服器儲存失敗，localStorage 已經更新
        // 顯示JSON模態框讓用戶複製
        showJsonModal();
        
        // 顯示更友好的錯誤訊息
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <div style="background: #fef3c7; color: #92400e; padding: 1rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #fde68a;">
                <strong>⚠️ 伺服器儲存失敗，但本地資料已更新</strong><br>
                您的變更已儲存在瀏覽器的 localStorage 中，請複製下方的JSON資料並手動儲存到 <code>image_data.json</code> 檔案中
            </div>
        `;
        elements.jsonDisplay.parentNode.insertBefore(errorMessage, elements.jsonDisplay);
    } finally {
        hideLoading();
    }
}

// 顯示載入指示器
function showLoading() {
    // 移除現有的載入動畫
    const existingLoading = document.querySelector('.loading-overlay');
    if (existingLoading) {
        existingLoading.remove();
    }
    
    // 創建載入動畫
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>處理中...</p>
        </div>
    `;
    
    // 添加樣式
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        backdrop-filter: blur(4px);
    `;
    
    const spinnerStyle = document.createElement('style');
    spinnerStyle.textContent = `
        .loading-spinner {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #8b5cf6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-spinner p {
            margin: 0;
            color: #6b7280;
            font-weight: 500;
        }
    `;
    document.head.appendChild(spinnerStyle);
    
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.transform = 'scale(0.9)';
        loadingOverlay.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            if (loadingOverlay.parentElement) {
                loadingOverlay.remove();
            }
        }, 300);
    }
}

// 下載圖片
function downloadImage(filename) {
    const link = document.createElement('a');
            link.href = getAvatarPath(filename);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 關閉JSON模態框
function closeJsonModal() {
    elements.jsonModal.classList.remove('active');
}

// 複製JSON到剪貼簿
async function copyJsonToClipboard() {
    try {
        const jsonString = JSON.stringify(imageData, null, 2);
        await navigator.clipboard.writeText(jsonString);
        
        // 顯示成功訊息
        const originalText = elements.copyJsonBtn.innerHTML;
        elements.copyJsonBtn.innerHTML = '<i class="fas fa-check"></i> 已複製！';
        elements.copyJsonBtn.style.background = 'rgba(6, 182, 212, 1)';
        
        setTimeout(() => {
            elements.copyJsonBtn.innerHTML = originalText;
            elements.copyJsonBtn.style.background = '';
        }, 2000);
    } catch (error) {
        console.error('複製失敗:', error);
        alert('複製失敗，請手動複製');
    }
}

// 生成隨機三位數
function generateRandomCode() {
    return Math.floor(Math.random() * 900) + 100; // 100-999
}

// 更新檔案名稱建議
function updateFilenameSuggestions() {
    const currentTags = Array.from(elements.hashtagTags.children).map(el => 
        el.textContent.replace('×', '').trim()
    );
    
    if (currentTags.length === 0) {
        elements.filenameSuggestions.style.display = 'none';
        return;
    }
    
    // 生成建議
    const suggestions = currentTags.map(tag => {
        const randomCode = generateRandomCode();
        return `${tag}_${randomCode}`;
    });
    
    // 渲染建議
    elements.filenameSuggestions.innerHTML = suggestions.map(suggestion => `
        <div class="filename-suggestion-item" onclick="selectFilenameSuggestion('${suggestion}')">
            <div class="filename-suggestion-label">建議檔案名稱:</div>
            <div class="filename-suggestion-text">${suggestion}</div>
        </div>
    `).join('');
    
    elements.filenameSuggestions.style.display = 'block';
}

// 選擇檔案名稱建議
function selectFilenameSuggestion(suggestion) {
    elements.modalFilename.value = suggestion;
    elements.filenameSuggestions.style.display = 'none';
}

// 開啟查看模態框
function openViewModal(filename) {
    const data = imageData[filename] || {};
    const hashtags = data.hashtags || [];
    const displayName = data.displayName || filename;
    const theme = data.theme || '';
    const hasBackground = data.hasBackground || false;
    
    // 設置模態框內容
            elements.viewImage.src = getAvatarPath(filename);
    elements.viewDisplayName.textContent = displayName;
    elements.viewTheme.textContent = theme || '無';
    
    // 渲染標籤
    elements.viewTags.innerHTML = hashtags.map(tag => 
        `<span class="tag">#${tag}</span>`
    ).join('');
    
    // 根據是否有背景來控制背景工具
    const backgroundNavItem = document.querySelector('[data-tool="background"]');
    if (backgroundNavItem) {
        if (hasBackground) {
            // 有背景的圖片隱藏背景工具
            backgroundNavItem.style.display = 'none';
        } else {
            // 沒有背景的圖片顯示背景工具
            backgroundNavItem.style.display = 'flex';
            // 重置背景顏色
            elements.backgroundColorPicker.value = '#ffffff';
            elements.viewImageBackground.style.backgroundColor = '#ffffff';
        }
    }
    
    // 重置圖片編輯狀態
    resetImageEditState();
    
    // 重置配件狀態
    accessories = [];
    selectedAccessory = null;
    renderAccessoriesList();
    
    // 隱藏工具面板
    hideEditTool();
    
    // 顯示模態框
    elements.viewModal.classList.add('active');
}

// 關閉查看模態框
function closeViewModal() {
    elements.viewModal.classList.remove('active');
    
    // 隱藏工具面板
    hideEditTool();
}

// 更新背景顏色
function updateBackgroundColor() {
    const color = elements.backgroundColorPicker.value;
    elements.viewImageBackground.style.backgroundColor = color;
}

// 重置背景顏色
function resetBackgroundColor() {
    elements.backgroundColorPicker.value = '#ffffff';
    elements.viewImageBackground.style.backgroundColor = '#ffffff';
}

// 下載合併圖片
async function downloadMergedImage() {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 獲取圖片元素
        const img = elements.viewImage;
        const backgroundColor = elements.backgroundColorPicker.value;
        
        // 獲取當前圖片的資料
        const currentFilename = img.src.split('/').pop();
        const data = imageData[decodeURIComponent(currentFilename)] || {};
        const hasBackground = data.hasBackground || false;
        
        // 等待圖片載入
        if (!img.complete) {
            await new Promise((resolve) => {
                img.onload = resolve;
            });
        }
        
        // 計算最終尺寸（考慮旋轉）
        let finalWidth = img.naturalWidth;
        let finalHeight = img.naturalHeight;
        
        if (imageEditState.rotation === 90 || imageEditState.rotation === 270) {
            [finalWidth, finalHeight] = [finalHeight, finalWidth];
        }
        
        // 設置畫布尺寸
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        // 根據是否有背景來決定是否繪製背景
        if (!hasBackground) {
            // 沒有背景的圖片繪製背景顏色
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // 保存當前狀態
        ctx.save();
        
        // 移動到畫布中心
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // 應用旋轉
        if (imageEditState.rotation !== 0) {
            ctx.rotate((imageEditState.rotation * Math.PI) / 180);
        }
        
        // 應用翻轉
        let scaleX = imageEditState.flipHorizontal ? -1 : 1;
        let scaleY = imageEditState.flipVertical ? -1 : 1;
        ctx.scale(scaleX, scaleY);
        
        // 繪製圖片
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        
        // 恢復狀態
        ctx.restore();
        
        // 應用濾鏡效果（亮度、對比度、飽和度）
        if (imageEditState.brightness !== 100 || imageEditState.contrast !== 100 || imageEditState.saturation !== 100) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                // 亮度調整
                if (imageEditState.brightness !== 100) {
                    const factor = imageEditState.brightness / 100;
                    data[i] = Math.min(255, Math.max(0, data[i] * factor));     // R
                    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor)); // G
                    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor)); // B
                }
                
                // 對比度調整
                if (imageEditState.contrast !== 100) {
                    const factor = (imageEditState.contrast + 100) / 100;
                    const offset = 128 * (1 - factor);
                    data[i] = Math.min(255, Math.max(0, data[i] * factor + offset));     // R
                    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] * factor + offset)); // G
                    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] * factor + offset)); // B
                }
                
                // 飽和度調整（簡化版本）
                if (imageEditState.saturation !== 100) {
                    const factor = imageEditState.saturation / 100;
                    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    data[i] = Math.min(255, Math.max(0, gray + factor * (data[i] - gray)));     // R
                    data[i + 1] = Math.min(255, Math.max(0, gray + factor * (data[i + 1] - gray))); // G
                    data[i + 2] = Math.min(255, Math.max(0, gray + factor * (data[i + 2] - gray))); // B
                }
            }
            
            ctx.putImageData(imageData, 0, 0);
        }
        
        // 應用裁剪（如果有的話）
        if (imageEditState.cropData) {
            const cropX = imageEditState.cropData.x * canvas.width;
            const cropY = imageEditState.cropData.y * canvas.height;
            const cropWidth = imageEditState.cropData.width * canvas.width;
            const cropHeight = imageEditState.cropData.height * canvas.height;
            
            const croppedCanvas = document.createElement('canvas');
            const croppedCtx = croppedCanvas.getContext('2d');
            croppedCanvas.width = cropWidth;
            croppedCanvas.height = cropHeight;
            
            croppedCtx.drawImage(canvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
            
            // 繪製配件到裁剪後的畫布
            await drawAccessoriesOnCanvas(croppedCtx, croppedCanvas.width, croppedCanvas.height, cropX, cropY);
            
            // 創建下載連結
            const link = document.createElement('a');
            link.download = `edited_${Date.now()}.png`;
            link.href = croppedCanvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // 繪製配件到原始畫布
            await drawAccessoriesOnCanvas(ctx, canvas.width, canvas.height, 0, 0);
            
            // 創建下載連結
            const link = document.createElement('a');
            link.download = `edited_${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        
    } catch (error) {
        console.error('下載失敗:', error);
        alert('下載失敗，請重試');
    }
}

// 重置圖片編輯狀態
function resetImageEditState() {
    imageEditState = {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        flipHorizontal: false,
        flipVertical: false,
        rotation: 0,
        cropData: null
    };
    
    // 重置滑桿
    elements.brightnessSlider.value = 100;
    elements.contrastSlider.value = 100;
    elements.saturationSlider.value = 100;
    elements.brightnessValue.textContent = '100%';
    elements.contrastValue.textContent = '100%';
    elements.saturationValue.textContent = '100%';
    
    // 重置圖片樣式
    applyImageFilters();
}

// 更新亮度
function updateBrightness() {
    imageEditState.brightness = parseInt(elements.brightnessSlider.value);
    elements.brightnessValue.textContent = `${imageEditState.brightness}%`;
    applyImageFilters();
}

// 更新對比度
function updateContrast() {
    imageEditState.contrast = parseInt(elements.contrastSlider.value);
    elements.contrastValue.textContent = `${imageEditState.contrast}%`;
    applyImageFilters();
}

// 更新飽和度
function updateSaturation() {
    imageEditState.saturation = parseInt(elements.saturationSlider.value);
    elements.saturationValue.textContent = `${imageEditState.saturation}%`;
    applyImageFilters();
}

// 應用圖片濾鏡
function applyImageFilters() {
    const img = elements.viewImage;
    if (!img) return; // 防止 null 錯誤
    
    const filters = [];
    
    // 亮度
    if (imageEditState.brightness !== 100) {
        filters.push(`brightness(${imageEditState.brightness}%)`);
    }
    
    // 對比度
    if (imageEditState.contrast !== 100) {
        filters.push(`contrast(${imageEditState.contrast}%)`);
    }
    
    // 飽和度
    if (imageEditState.saturation !== 100) {
        filters.push(`saturate(${imageEditState.saturation}%)`);
    }
    
    // 翻轉
    if (imageEditState.flipHorizontal) {
        filters.push('scaleX(-1)');
    }
    if (imageEditState.flipVertical) {
        filters.push('scaleY(-1)');
    }
    
    // 旋轉
    if (imageEditState.rotation !== 0) {
        filters.push(`rotate(${imageEditState.rotation}deg)`);
    }
    
    img.style.filter = filters.join(' ');
}

// 水平翻轉
function flipHorizontal() {
    imageEditState.flipHorizontal = !imageEditState.flipHorizontal;
    elements.flipHorizontalBtn.classList.toggle('active', imageEditState.flipHorizontal);
    applyImageFilters();
}

// 垂直翻轉
function flipVertical() {
    imageEditState.flipVertical = !imageEditState.flipVertical;
    elements.flipVerticalBtn.classList.toggle('active', imageEditState.flipVertical);
    applyImageFilters();
}

// 90度旋轉
function rotate90() {
    imageEditState.rotation = (imageEditState.rotation + 90) % 360;
    applyImageFilters();
}

// 切換裁剪模式
function toggleCropMode() {
    const isCropMode = elements.cropBtn.classList.contains('active');
    
    if (isCropMode) {
        // 退出裁剪模式
        elements.cropBtn.classList.remove('active');
        elements.applyCropBtn.style.display = 'none';
        elements.cancelCropBtn.style.display = 'none';
        document.querySelector('.view-image-wrapper').classList.remove('crop-mode');
    } else {
        // 進入裁剪模式
        elements.cropBtn.classList.add('active');
        elements.applyCropBtn.style.display = 'flex';
        elements.cancelCropBtn.style.display = 'flex';
        document.querySelector('.view-image-wrapper').classList.add('crop-mode');
        initCropSelection();
    }
}

// 初始化裁剪選擇
function initCropSelection() {
    const wrapper = document.querySelector('.view-image-wrapper');
    const img = elements.viewImage;
    
    // 創建裁剪覆蓋層
    let overlay = wrapper.querySelector('.crop-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'crop-overlay';
        wrapper.appendChild(overlay);
    }
    
    // 創建裁剪選擇框
    let selection = wrapper.querySelector('.crop-selection');
    if (!selection) {
        selection = document.createElement('div');
        selection.className = 'crop-selection';
        wrapper.appendChild(selection);
    }
    
    overlay.style.display = 'block';
    selection.style.display = 'block';
    
    // 設置初始裁剪區域（圖片中心的一半大小）
    const rect = img.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const size = Math.min(rect.width, rect.height) / 2;
    
    selection.style.left = `${centerX - size/2}px`;
    selection.style.top = `${centerY - size/2}px`;
    selection.style.width = `${size}px`;
    selection.style.height = `${size}px`;
    
    // 添加裁剪手柄
    addCropHandles(selection);
    
    // 添加拖拽功能
    makeDraggable(selection);
}

// 添加裁剪手柄
function addCropHandles(selection) {
    const handles = ['nw', 'ne', 'sw', 'se'];
    handles.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `crop-handle ${pos}`;
        handle.dataset.position = pos;
        selection.appendChild(handle);
        
        // 添加調整大小功能
        handle.addEventListener('mousedown', startResize);
    });
}

// 使元素可拖拽
function makeDraggable(element) {
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    element.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('crop-handle')) return;
        
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = parseInt(element.style.left) || 0;
        startTop = parseInt(element.style.top) || 0;
        
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        element.style.left = `${startLeft + deltaX}px`;
        element.style.top = `${startTop + deltaY}px`;
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

// 開始調整大小
function startResize(e) {
    e.stopPropagation();
    const handle = e.target;
    const selection = handle.parentElement;
    const position = handle.dataset.position;
    
    let isResizing = true;
    let startX = e.clientX;
    let startY = e.clientY;
    let startLeft = parseInt(selection.style.left) || 0;
    let startTop = parseInt(selection.style.top) || 0;
    let startWidth = parseInt(selection.style.width) || 0;
    let startHeight = parseInt(selection.style.height) || 0;
    
    function onMouseMove(e) {
        if (!isResizing) return;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newLeft = startLeft;
        let newTop = startTop;
        let newWidth = startWidth;
        let newHeight = startHeight;
        
        switch (position) {
            case 'nw':
                newLeft = startLeft + deltaX;
                newTop = startTop + deltaY;
                newWidth = startWidth - deltaX;
                newHeight = startHeight - deltaY;
                break;
            case 'ne':
                newTop = startTop + deltaY;
                newWidth = startWidth + deltaX;
                newHeight = startHeight - deltaY;
                break;
            case 'sw':
                newLeft = startLeft + deltaX;
                newWidth = startWidth - deltaX;
                newHeight = startHeight + deltaY;
                break;
            case 'se':
                newWidth = startWidth + deltaX;
                newHeight = startHeight + deltaY;
                break;
        }
        
        // 限制最小尺寸
        if (newWidth > 20 && newHeight > 20) {
            selection.style.left = `${newLeft}px`;
            selection.style.top = `${newTop}px`;
            selection.style.width = `${newWidth}px`;
            selection.style.height = `${newHeight}px`;
        }
    }
    
    function onMouseUp() {
        isResizing = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

// 套用裁剪
function applyCrop() {
    const selection = document.querySelector('.crop-selection');
    if (!selection) return;
    
    const rect = selection.getBoundingClientRect();
    const imgRect = elements.viewImage.getBoundingClientRect();
    
    // 計算裁剪區域（相對於圖片）
    const cropX = (rect.left - imgRect.left) / imgRect.width;
    const cropY = (rect.top - imgRect.top) / imgRect.height;
    const cropWidth = rect.width / imgRect.width;
    const cropHeight = rect.height / imgRect.height;
    
    imageEditState.cropData = {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight
    };
    
    // 退出裁剪模式
    toggleCropMode();
    
    // 應用裁剪效果（這裡只是視覺效果，實際裁剪在下載時進行）
    alert('裁剪已套用！實際裁剪效果將在下載時生效。');
}

// 取消裁剪
function cancelCrop() {
    imageEditState.cropData = null;
    toggleCropMode();
}

// 重置所有編輯
function resetAllEdits() {
    resetImageEditState();
    
    // 重置按鈕狀態
    elements.flipHorizontalBtn.classList.remove('active');
    elements.flipVerticalBtn.classList.remove('active');
    elements.cropBtn.classList.remove('active');
    elements.applyCropBtn.style.display = 'none';
    elements.cancelCropBtn.style.display = 'none';
    document.querySelector('.view-image-wrapper').classList.remove('crop-mode');
    
    // 清除裁剪相關元素
    const overlay = document.querySelector('.crop-overlay');
    const selection = document.querySelector('.crop-selection');
    if (overlay) overlay.remove();
    if (selection) selection.remove();
    
    // 清除所有配件
    clearAllAccessories();
}

// 配件功能
function openAccessoriesLibrary() {
    // 從 Accessories 資料夾載入真實配件圖片
    const accessoryFiles = [
        'Frame 427 2.png',
        'Frame 462.png',
        'image (1) 1.png',
        'image (2) 1.png',
        'image 106.png',
        'Vector 31 (3).png',
        'Vector 7 (1) 1.png',
        '瑪瑙耳環 (1).png',
        '瑪瑙耳環.png',
        '紅色情人袋 (1).png',
        '藍色情人袋.png'
    ];
    
    // 渲染配件選項
    elements.accessoriesGrid.innerHTML = accessoryFiles.map((filename, index) => {
        const id = `accessory_${index}`;
        const name = filename.replace(/\.[^/.]+$/, ''); // 移除副檔名
        const src = `Accessories/${encodeURIComponent(filename)}`;
        
        return `
            <div class="accessory-option" onclick="addAccessory('${id}', '${name}', '${src}')">
                <img src="${src}" alt="${name}" onerror="this.style.display='none'">
                <div class="name">${name}</div>
            </div>
        `;
    }).join('');
    
    // 顯示配件庫
    elements.accessoriesLibrary.style.display = 'flex';
}

function closeAccessoriesLibrary() {
    elements.accessoriesLibrary.style.display = 'none';
}

function addAccessory(id, name, src) {
    const accessory = {
        id: id,
        name: name,
        src: src,
        x: 50,
        y: 50,
        width: 60,
        height: 60,
        rotation: 0,
        zIndex: accessories.length + 1
    };
    
    accessories.push(accessory);
    renderAccessoriesList();
    renderAccessoriesOnImage();
    closeAccessoriesLibrary();
}

function removeAccessory(id) {
    accessories = accessories.filter(acc => acc.id !== id);
    renderAccessoriesList();
    renderAccessoriesOnImage();
}

function clearAllAccessories() {
    accessories = [];
    renderAccessoriesList();
    renderAccessoriesOnImage();
}

function renderAccessoriesList() {
    elements.accessoriesList.innerHTML = accessories.map(accessory => `
        <div class="accessory-item">
            <img src="${accessory.src}" alt="${accessory.name}" class="accessory-preview">
            <div class="accessory-info">
                <div class="accessory-name">${accessory.name}</div>
                <div class="accessory-controls">
                    <button onclick="selectAccessory('${accessory.id}')" class="select-btn">選擇</button>
                    <button onclick="removeAccessory('${accessory.id}')" class="delete-btn">刪除</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAccessoriesOnImage() {
    const wrapper = document.querySelector('.view-image-wrapper');
    let layer = wrapper.querySelector('.accessory-layer');
    
    if (!layer) {
        layer = document.createElement('div');
        layer.className = 'accessory-layer';
        wrapper.appendChild(layer);
    }
    
    layer.innerHTML = accessories.map(accessory => `
        <div class="accessory-element ${selectedAccessory === accessory.id ? 'selected' : ''}" 
             data-id="${accessory.id}"
             style="left: ${accessory.x}%; top: ${accessory.y}%; width: ${accessory.width}px; height: ${accessory.height}px; transform: rotate(${accessory.rotation}deg); z-index: ${accessory.zIndex};">
            <img src="${accessory.src}" alt="${accessory.name}">
            <div class="accessory-resize-handle nw"></div>
            <div class="accessory-resize-handle ne"></div>
            <div class="accessory-resize-handle sw"></div>
            <div class="accessory-resize-handle se"></div>
            <div class="accessory-rotate-handle"></div>
        </div>
    `).join('');
    
    // 添加事件監聽器
    addAccessoryEventListeners();
}

function selectAccessory(id) {
    selectedAccessory = id;
    renderAccessoriesOnImage();
}

function addAccessoryEventListeners() {
    const accessoryElements = document.querySelectorAll('.accessory-element');
    
    accessoryElements.forEach(element => {
        const id = element.dataset.id;
        const accessory = accessories.find(acc => acc.id === id);
        
        if (!accessory) return;
        
        // 點擊選擇
        element.addEventListener('click', (e) => {
            if (e.target.classList.contains('accessory-resize-handle') || 
                e.target.classList.contains('accessory-rotate-handle')) {
                return;
            }
            selectAccessory(id);
        });
        
        // 拖拽移動
        element.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('accessory-resize-handle') || 
                e.target.classList.contains('accessory-rotate-handle')) {
                return;
            }
            
            isDragging = true;
            const rect = element.parentElement.getBoundingClientRect();
            const startX = e.clientX - rect.left;
            const startY = e.clientY - rect.top;
            
            function onMouseMove(e) {
                if (!isDragging) return;
                
                const rect = element.parentElement.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                
                accessory.x = Math.max(0, Math.min(100, x));
                accessory.y = Math.max(0, Math.min(100, y));
                
                element.style.left = `${accessory.x}%`;
                element.style.top = `${accessory.y}%`;
            }
            
            function onMouseUp() {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
        
        // 調整大小
        const resizeHandles = element.querySelectorAll('.accessory-resize-handle');
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isResizing = true;
                const position = handle.className.split(' ')[1];
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = accessory.width;
                const startHeight = accessory.height;
                const startX2 = accessory.x;
                const startY2 = accessory.y;
                
                function onMouseMove(e) {
                    if (!isResizing) return;
                    
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    
                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newX = startX2;
                    let newY = startY2;
                    
                    switch (position) {
                        case 'nw':
                            newWidth = Math.max(20, startWidth - deltaX);
                            newHeight = Math.max(20, startHeight - deltaY);
                            newX = startX2 + (startWidth - newWidth);
                            newY = startY2 + (startHeight - newHeight);
                            break;
                        case 'ne':
                            newWidth = Math.max(20, startWidth + deltaX);
                            newHeight = Math.max(20, startHeight - deltaY);
                            newY = startY2 + (startHeight - newHeight);
                            break;
                        case 'sw':
                            newWidth = Math.max(20, startWidth - deltaX);
                            newHeight = Math.max(20, startHeight + deltaY);
                            newX = startX2 + (startWidth - newWidth);
                            break;
                        case 'se':
                            newWidth = Math.max(20, startWidth + deltaX);
                            newHeight = Math.max(20, startHeight + deltaY);
                            break;
                    }
                    
                    accessory.width = newWidth;
                    accessory.height = newHeight;
                    accessory.x = newX;
                    accessory.y = newY;
                    
                    element.style.width = `${newWidth}px`;
                    element.style.height = `${newHeight}px`;
                    element.style.left = `${newX}%`;
                    element.style.top = `${newY}%`;
                }
                
                function onMouseUp() {
                    isResizing = false;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        });
        
        // 旋轉
        const rotateHandle = element.querySelector('.accessory-rotate-handle');
        if (rotateHandle) {
            rotateHandle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isRotating = true;
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                
                function onMouseMove(e) {
                    if (!isRotating) return;
                    
                    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
                    const rotation = ((angle - startAngle) * 180 / Math.PI) + accessory.rotation;
                    
                    accessory.rotation = rotation;
                    element.style.transform = `rotate(${rotation}deg)`;
                }
                
                function onMouseUp() {
                    isRotating = false;
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            });
        }
    });
}

// 繪製配件到畫布
async function drawAccessoriesOnCanvas(ctx, canvasWidth, canvasHeight, offsetX, offsetY) {
    const wrapper = document.querySelector('.view-image-wrapper');
    const img = elements.viewImage;

    // 獲取圖片元素的實際尺寸
    const imgRect = img.getBoundingClientRect();
    const imgWidth = imgRect.width;
    const imgHeight = imgRect.height;

    // 等待所有配件圖片載入完成
    const accessoryPromises = accessories.map(accessory => {
        return new Promise((resolve) => {
            const relativeX = accessory.x;
            const relativeY = accessory.y;
            const relativeWidth = accessory.width;
            const relativeHeight = accessory.height;

            // 將相對位置轉換為絕對像素位置
            const absoluteX = (relativeX / 100) * imgWidth + offsetX;
            const absoluteY = (relativeY / 100) * imgHeight + offsetY;

            // 繪製配件
            ctx.save();
            ctx.translate(absoluteX, absoluteY);
            ctx.rotate(accessory.rotation * Math.PI / 180); // 應用旋轉

            // 繪製配件圖片
            const accessoryImg = new Image();
            accessoryImg.crossOrigin = 'anonymous'; // 處理跨域問題
            accessoryImg.onload = () => {
                // 計算配件在畫布上的實際大小
                const scaleX = relativeWidth / accessoryImg.naturalWidth;
                const scaleY = relativeHeight / accessoryImg.naturalHeight;
                const scale = Math.min(scaleX, scaleY);
                
                const drawWidth = accessoryImg.naturalWidth * scale;
                const drawHeight = accessoryImg.naturalHeight * scale;
                
                ctx.drawImage(accessoryImg, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
                ctx.restore();
                resolve();
            };
            accessoryImg.onerror = () => {
                ctx.restore();
                resolve(); // 即使載入失敗也要resolve
            };
            accessoryImg.src = accessory.src;
        });
    });

    // 等待所有配件繪製完成
    await Promise.all(accessoryPromises);
}

// 顯示JSON模態框
function showJsonModal() {
    const jsonString = JSON.stringify(imageData, null, 2);
    elements.jsonDisplay.textContent = jsonString;
    elements.jsonModal.classList.add('active');
}

// 匯出搜尋結果
function exportSearchResults() {
    const searchTerm = elements.searchInput.value.toLowerCase().trim();
    const selectedTheme = elements.themeFilter.value;
    const sortOption = document.getElementById('sortSelect').value;
    const currentQuickFilter = document.querySelector('.quick-filter-btn.active').dataset.filter;

    let filteredImages = allImages;

    if (searchTerm) {
        filteredImages = allImages.filter(filename => {
            const data = imageData[filename] || {};
            const hashtags = data.hashtags || [];
            const theme = data.theme || '';
            const displayName = data.displayName || filename;
            
            return filename.toLowerCase().includes(searchTerm) ||
                   displayName.toLowerCase().includes(searchTerm) ||
                   hashtags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
                   theme.toLowerCase().includes(searchTerm);
        });
    }

    if (selectedTheme) {
        filteredImages = filteredImages.filter(filename => {
            const data = imageData[filename] || {};
            return data.theme === selectedTheme;
        });
    }

    if (currentQuickFilter === 'hashtags') {
        filteredImages = filteredImages.filter(filename => {
            const data = imageData[filename] || {};
            return (data.hashtags && data.hashtags.length > 0);
        });
    } else if (currentQuickFilter === 'theme') {
        filteredImages = filteredImages.filter(filename => {
            const data = imageData[filename] || {};
            return (data.theme && data.theme.trim() !== '');
        });
    }

    if (sortOption === 'name') {
        filteredImages.sort((a, b) => {
            const dataA = imageData[a] || {};
            const dataB = imageData[b] || {};
            const displayNameA = dataA.displayName || a;
            const displayNameB = dataB.displayName || b;
            return displayNameA.localeCompare(displayNameB);
        });
    } else if (sortOption === 'hashtags') {
        filteredImages.sort((a, b) => {
            const dataA = imageData[a] || {};
            const dataB = imageData[b] || {};
            const hashtagsA = dataA.hashtags || [];
            const hashtagsB = dataB.hashtags || [];
            return hashtagsB.length - hashtagsA.length;
        });
    } else if (sortOption === 'theme') {
        filteredImages.sort((a, b) => {
            const dataA = imageData[a] || {};
            const dataB = imageData[b] || {};
            const themeA = dataA.theme || '';
            const themeB = dataB.theme || '';
            return themeA.localeCompare(themeB);
        });
    }

    const csvContent = [
        ['檔案名稱', '顯示名稱', '主題', '標籤', '圖片URL']
    ];

    filteredImages.forEach(filename => {
        const data = imageData[filename] || {};
        csvContent.push([
            filename,
            data.displayName || filename,
            data.theme || '',
            (data.hashtags || []).join(', '),
            getAvatarPath(filename)
        ]);
    });

    const csvString = csvContent.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `search_results_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 全域函數（供 HTML 調用）
window.openEditModal = openEditModal;
window.removeHashtag = removeHashtag;
window.selectSuggestion = selectSuggestion;
window.downloadImage = downloadImage;
window.selectFilenameSuggestion = selectFilenameSuggestion;
window.openViewModal = openViewModal;
window.addAccessory = addAccessory;
window.removeAccessory = removeAccessory;
window.selectAccessory = selectAccessory;
window.goToPage = goToPage;

// 動態路徑檢測函數 - 確保在本地和部署環境都能正確工作
function getBasePath() {
    // 檢測當前環境
    const hostname = window.location.hostname;
    const pathname = window.location.pathname;
    
    // 本地開發環境
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return '';
    }
    
    // 檢查是否在 GitHub Pages 或 Cloudflare Pages 的子路徑中
    if (pathname.includes('/avatar-search/')) {
        return '/avatar-search';
    }
    
    // 其他情況（直接域名部署）
    return '';
}

// 獲取圖片路徑的通用函數
function getImagePath(folder, filename) {
    const basePath = getBasePath();
    return `${basePath}/${folder}/${encodeURIComponent(filename)}`;
}

// 獲取頭貼圖片路徑
function getAvatarPath(filename) {
    return getImagePath('Avatar', filename);
}

// 獲取配件圖片路徑
function getAccessoryPath(filename) {
    return getImagePath('Accessories', filename);
}

// 當 DOM 載入完成後初始化應用程式
document.addEventListener('DOMContentLoaded', initApp); 