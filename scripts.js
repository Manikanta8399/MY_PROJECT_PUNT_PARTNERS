const fontFamilySelector = document.getElementById('font-family-selector');
const fontVariantSelector = document.getElementById('font-variant-selector');
const editor = document.getElementById('editor');
const resetButton = document.getElementById('reset-button');
const saveButton = document.getElementById('save-button');

let fontsData = {};

// Load fonts data
fetch('fonts.json')
    .then(response => response.json())
    .then(data => {
        fontsData = data.items;
        populateFontFamilySelector();
        loadSavedSettings();
    })
    .catch(error => console.error('Error loading fonts data:', error));

// Populate font family selector
function populateFontFamilySelector() {
    fontsData.forEach(font => {
        const option = document.createElement('option');
        option.value = font.family;
        option.textContent = font.family;
        fontFamilySelector.appendChild(option);
    });

    // Trigger initial population of font variant selector
    populateFontVariantSelector();
}

// Populate font variant selector
function populateFontVariantSelector() {
    fontVariantSelector.innerHTML = '';
    const selectedFont = fontFamilySelector.value;
    const font = fontsData.find(f => f.family === selectedFont);

    font.variants.forEach(variant => {
        const option = document.createElement('option');
        option.value = variant;
        option.textContent = variant;
        fontVariantSelector.appendChild(option);
    });

    applyStyles();
}

// Apply styles to editor
function applyStyles() {
    const selectedFont = fontFamilySelector.value;
    const selectedVariant = fontVariantSelector.value;

    let fontWeight = selectedVariant.replace('italic', '');
    if (fontWeight === '') fontWeight = '400';
    const fontStyle = selectedVariant.includes('italic') ? 'italic' : 'normal';

    editor.style.fontFamily = selectedFont;
    editor.style.fontWeight = fontWeight;
    editor.style.fontStyle = fontStyle;

    saveSettings();
}

// Save settings to localStorage
function saveSettings() {
    const settings = {
        text: editor.value,
        fontFamily: fontFamilySelector.value,
        fontVariant: fontVariantSelector.value
    };
    localStorage.setItem('editorSettings', JSON.stringify(settings));
}

// Load saved settings from localStorage
function loadSavedSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('editorSettings'));
    if (savedSettings) {
        editor.value = savedSettings.text;
        fontFamilySelector.value = savedSettings.fontFamily;
        populateFontVariantSelector();
        fontVariantSelector.value = savedSettings.fontVariant;
        applyStyles();
    }
}

// Reset settings
function resetSettings() {
    editor.value = '';
    fontFamilySelector.selectedIndex = 0;
    populateFontVariantSelector();
    fontVariantSelector.selectedIndex = 0;
    applyStyles();
}

// Event listeners
fontFamilySelector.addEventListener('change', populateFontVariantSelector);
fontVariantSelector.addEventListener('change', applyStyles);
resetButton.addEventListener('click', resetSettings);
saveButton.addEventListener('click', saveSettings);
editor.addEventListener('input', saveSettings);