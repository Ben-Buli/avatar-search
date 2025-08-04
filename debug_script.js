// 調試腳本：檢查所有可能為 null 的元素
console.log('🔍 開始調試元素檢查...');

// 定義所有需要檢查的元素 ID
const elementIds = [
    // 頁面切換
    'navTabs', // 這是一個 class 選擇器
    
    // 搜尋頁面
    'searchInput',
    'clearSearch',
    'themeFilter',
    'resultsCount',
    'searchResults',
    'sortSelect',
    'pageSizeSelect',
    'pagination',
    
    // 管理頁面
    'manageThemeFilter',
    'manageSortSelect',
    'manageSearchInput',
    'clearManageSearch',
    'imageList',
    'manageForm',
    'saveAllBtn',
    'selectAllBtn',
    'deselectAllBtn',
    'localStorageBtn',
    
    // 模態框
    'editModal',
    'closeModal',
    'modalImage',
    'hashtagInput',
    'hashtagTags',
    'hashtagSuggestions',
    'modalFilename',
    'modalTheme',
    'saveImageBtn',
    'cancelEditBtn',
    
    // JSON模態框
    'jsonModal',
    'closeJsonModal',
    'jsonDisplay',
    'copyJsonBtn',
    
    // 檔案名稱建議
    'filenameSuggestions',
    
    // 查看模態框
    'viewModal',
    'closeViewModal',
    'viewImage',
    'viewImageBackground',
    'viewDisplayName',
    'viewTags',
    'viewTheme',
    'backgroundColorPicker',
    'resetColorBtn',
    'downloadMergedBtn',
    
    // 圖片編輯控制項
    'brightnessSlider',
    'contrastSlider',
    'saturationSlider',
    'brightnessValue',
    'contrastValue',
    'saturationValue',
    'flipHorizontalBtn',
    'flipVerticalBtn',
    'rotate90Btn',
    'cropBtn',
    'applyCropBtn',
    'cancelCropBtn',
    'resetAllBtn',
    
    // 配件控制項
    'addAccessoryBtn',
    'clearAccessoriesBtn',
    'accessoriesList',
    'accessoriesLibrary',
    'closeLibraryBtn',
    'accessoriesGrid',
    
    // 載入指示器
    'loading',
    
    // 批量編輯相關元素
    'batchEditBtn',
    'batchEditModal',
    'closeBatchModal',
    'applyBatchEdit',
    'cancelBatchEdit',
    'selectedCount',
    'batchHashtagInput',
    'batchThemeInput',
    'batchHashtagTags',
    'batchPreviewGrid',
    
    // 底部編輯導航欄
    'resetAdjustBtn'
];

// 檢查所有元素
const missingElements = [];
const foundElements = [];

elementIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        foundElements.push(id);
    } else {
        missingElements.push(id);
    }
});

// 檢查 class 選擇器
const navTabs = document.querySelectorAll('.nav-tab');
const editNavItems = document.querySelectorAll('.edit-nav-item');
const closeToolBtns = document.querySelectorAll('.close-tool-btn');
const toolContents = document.querySelectorAll('.tool-content');
const editBottomNav = document.querySelector('.edit-bottom-nav');
const editToolPanel = document.querySelector('.edit-tool-panel');

console.log('📊 元素檢查結果：');
console.log(`✅ 找到的元素 (${foundElements.length}):`, foundElements);
console.log(`❌ 缺少的元素 (${missingElements.length}):`, missingElements);

console.log('🔍 Class 選擇器檢查：');
console.log(`✅ nav-tab 元素: ${navTabs.length} 個`);
console.log(`✅ edit-nav-item 元素: ${editNavItems.length} 個`);
console.log(`✅ close-tool-btn 元素: ${closeToolBtns.length} 個`);
console.log(`✅ tool-content 元素: ${toolContents.length} 個`);
console.log(`✅ edit-bottom-nav 元素: ${editBottomNav ? '找到' : '未找到'}`);
console.log(`✅ edit-tool-panel 元素: ${editToolPanel ? '找到' : '未找到'}`);

// 檢查 elements 對象
if (typeof elements !== 'undefined') {
    console.log('🔍 elements 對象檢查：');
    const nullElements = [];
    const validElements = [];
    
    Object.keys(elements).forEach(key => {
        if (elements[key] === null) {
            nullElements.push(key);
        } else {
            validElements.push(key);
        }
    });
    
    console.log(`✅ 有效的 elements (${validElements.length}):`, validElements);
    console.log(`❌ 為 null 的 elements (${nullElements.length}):`, nullElements);
} else {
    console.log('❌ elements 對象未定義！');
}

// 檢查全域變數
console.log('🔍 全域變數檢查：');
console.log(`✅ imageData: ${typeof imageData !== 'undefined' ? '已定義' : '未定義'}`);
console.log(`✅ allImages: ${typeof allImages !== 'undefined' ? '已定義' : '未定義'}`);
console.log(`✅ imageEditState: ${typeof imageEditState !== 'undefined' ? '已定義' : '未定義'}`);

// 檢查核心函數
const coreFunctions = [
    'initApp',
    'initEventListeners',
    'performSearch',
    'performManageSearch',
    'showNotification',
    'updateThemeFilters',
    'openEditModal',
    'closeModal',
    'saveImageData',
    'openViewModal',
    'closeViewModal',
    'updateBrightness',
    'updateContrast',
    'updateSaturation',
    'applyImageFilters',
    'flipHorizontal',
    'flipVertical',
    'rotate90',
    'toggleCropMode',
    'applyCrop',
    'cancelCrop',
    'resetAllEdits',
    'openAccessoriesLibrary',
    'closeAccessoriesLibrary',
    'addAccessory',
    'clearAllAccessories',
    'showEditTool',
    'hideEditTool',
    'resetAdjustments'
];

console.log('🔍 核心函數檢查：');
const missingFunctions = [];
const foundFunctions = [];

coreFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        foundFunctions.push(funcName);
    } else {
        missingFunctions.push(funcName);
    }
});

console.log(`✅ 找到的函數 (${foundFunctions.length}):`, foundFunctions);
console.log(`❌ 缺少的函數 (${missingFunctions.length}):`, missingFunctions);

console.log('🔍 調試檢查完成！'); 