/**
 * Common JavaScript functions for Puja Vidhi project
 */

/**
 * Current display mode: 'kannada', 'english', or 'word-by-word'
 */
let currentDisplayMode = 'kannada';

/**
 * Toggle visibility of English transliteration elements
 */
function toggleVisibility() {
    var elements = document.querySelectorAll('.ENG');
    elements.forEach(function (element) {
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display = 'inline';
        } else {
            element.style.display = 'none';
        }
    });
}

/**
 * Set display mode for text content
 * @param {string} mode - 'kannada', 'english', or 'word-by-word'
 */
function setDisplayMode(mode) {
    currentDisplayMode = mode;
    
    // Update button states
    const buttons = document.querySelectorAll('.mode-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`)?.classList.add('active');
    
    // Update verse content displays
    const verseContents = document.querySelectorAll('.verse-content');
    verseContents.forEach(content => {
        content.className = `verse-content mode-${mode}`;
    });
    
    // Handle legacy toggle button and old content structure
    if (mode === 'english') {
        const elements = document.querySelectorAll('.ENG');
        elements.forEach(element => {
            element.style.display = 'inline';
        });
        
        const toggleBtn = document.querySelector('.toggle-btn');
        if (toggleBtn) {
            toggleBtn.textContent = 'Hide English Transliteration';
        }
    } else {
        const elements = document.querySelectorAll('.ENG');
        elements.forEach(element => {
            element.style.display = 'none';
        });
        
        const toggleBtn = document.querySelector('.toggle-btn');
        if (toggleBtn) {
            toggleBtn.textContent = 'Show English Transliteration';
        }
    }
}

/**
 * Initialize display mode buttons
 */
function initializeDisplayModeButtons() {
    const buttonsContainer = document.querySelector('.display-mode-buttons');
    if (!buttonsContainer) return;
    
    const buttons = buttonsContainer.querySelectorAll('.mode-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.getAttribute('data-mode');
            setDisplayMode(mode);
        });
    });
    
    // Set initial mode
    setDisplayMode('kannada');
}

/**
 * Create word-by-word translation table
 * @param {Array} words - Array of word objects with kannada, transliteration, and meaning
 * @returns {HTMLElement} - Table element
 */
function createWordByWordTable(words) {
    const table = document.createElement('table');
    table.className = 'word-by-word-table';
    
    // Create Kannada row
    const kannadaRow = document.createElement('tr');
    kannadaRow.className = 'kannada-row';
    words.forEach(word => {
        const td = document.createElement('td');
        td.textContent = word.kannada;
        kannadaRow.appendChild(td);
    });
    table.appendChild(kannadaRow);
    
    // Create transliteration row
    const transliterationRow = document.createElement('tr');
    transliterationRow.className = 'translation-row';
    words.forEach(word => {
        const td = document.createElement('td');
        td.textContent = word.transliteration;
        transliterationRow.appendChild(td);
    });
    table.appendChild(transliterationRow);
    
    // Create meaning row
    const meaningRow = document.createElement('tr');
    meaningRow.className = 'meaning-row';
    words.forEach(word => {
        const td = document.createElement('td');
        td.textContent = word.meaning;
        meaningRow.appendChild(td);
    });
    table.appendChild(meaningRow);
    
    return table;
}

/**
 * Load a section from an external HTML file
 * @param {string} sectionId - The ID of the element to load content into
 * @param {string} url - The URL of the HTML file to load
 */
function loadSection(sectionId, url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.innerHTML = data;
            }
        })
        .catch(error => {
            console.error('Error fetching the section:', error);
            const element = document.getElementById(sectionId);
            if (element) {
                element.innerHTML = '<p>Error loading section</p>';
            }
        });
}

/**
 * Load common puja sections automatically
 * This function loads all the standard sections used in puja templates
 */
function loadCommonPujaSections() {
    const sections = [
        'shuddikarana-mantra',
        'ganapati-prarthana', 
        'kuladevata-prarthana',
        'deepaaradhana',
        'achamanam',
        'bhootoochchaatana',
        'pranayama',
        'sankalpam',
        'chaamaram',
        'puja-end-prarthana',
        'swasti'
    ];
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            // Determine the correct path based on current location
            const pathPrefix = window.location.pathname.includes('/puja/') ? '../general/' : './general/';
            loadSection(section, `${pathPrefix}${section}.html`);
        }
    });
}

/**
 * Initialize page - called when DOM is loaded
 */
function initializePage() {
    // Auto-load common sections if they exist
    if (document.querySelector('[id$="-mantra"], [id$="-prarthana"]')) {
        loadCommonPujaSections();
    }
    
    // Initialize display mode buttons
    initializeDisplayModeButtons();
    
    // Ensure English transliteration is hidden by default
    const englishElements = document.querySelectorAll('.ENG');
    englishElements.forEach(element => {
        element.style.display = 'none';
    });
}

/**
 * Enhanced toggle function with better UX
 */
function toggleTransliteration() {
    const button = document.querySelector('.toggle-btn');
    const elements = document.querySelectorAll('.ENG');
    const isHidden = elements[0]?.style.display === 'none' || elements[0]?.style.display === '';
    
    elements.forEach(function (element) {
        element.style.display = isHidden ? 'inline' : 'none';
    });
    
    // Update button text
    if (button) {
        button.textContent = isHidden ? 'Hide English Transliteration' : 'Show English Transliteration';
    }
    
    // Update display mode
    setDisplayMode(isHidden ? 'english' : 'kannada');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Backward compatibility - keep the old function name
window.toggleVisibility = toggleVisibility; 