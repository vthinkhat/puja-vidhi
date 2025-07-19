/**
 * Common JavaScript functions for Puja Vidhi project
 */

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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Backward compatibility - keep the old function name
window.toggleVisibility = toggleVisibility; 