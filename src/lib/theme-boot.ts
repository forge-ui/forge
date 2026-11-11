export const THEME_STORAGE_KEY = "forge-theme";

// Inlined in layout.tsx before hydration: a saved dark theme never flashes light, and other tabs
// and same-origin preview iframes follow a toggle through the storage event.
export const themeBootScript = `(function(){var k="${THEME_STORAGE_KEY}";function a(v){if(v==="dark")document.documentElement.dataset.theme="dark";else delete document.documentElement.dataset.theme}try{a(localStorage.getItem(k))}catch(e){}addEventListener("storage",function(e){if(e.key===k)a(e.newValue)})})()`;
