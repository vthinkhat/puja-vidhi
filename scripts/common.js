/**
 * Common JavaScript functions for Puja Vidhi project
 */

/**
 * Current display mode: 'kannada', 'english', or 'word-by-word'
 */
let currentDisplayMode = 'kannada';

/**
 * Render content dynamically based on display mode
 * @param {string} mode - 'kannada', 'english', or 'word-by-word'
 */
function renderContent(mode) {
    const container = document.getElementById('dynamic-content');
    if (!container || typeof stotramData === 'undefined') {
        console.warn('Dynamic content container or stotramData not found');
        return;
    }

    container.innerHTML = '';

    stotramData.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'section';

        // Add section title
        const titleElement = document.createElement('h2');
        titleElement.innerHTML = `${section.title.kannada} <span class="ENG">(${section.title.english})</span>`;
        sectionDiv.appendChild(titleElement);

        // Add verses
        section.verses.forEach(verse => {
            const verseDiv = document.createElement('div');
            verseDiv.className = 'verse-content';

            if (mode === 'kannada') {
                verseDiv.appendChild(renderKannadaOnly(verse));
            } else if (mode === 'english') {
                verseDiv.appendChild(renderKannadaWithEnglish(verse));
            } else if (mode === 'word-by-word') {
                verseDiv.appendChild(renderWordByWord(verse));
            }

            sectionDiv.appendChild(verseDiv);
        });

        container.appendChild(sectionDiv);
    });

    // Apply ENG visibility based on mode
    updateEngDisplayVisibility(mode);
}

/**
 * Render Kannada-only content
 */
function renderKannadaOnly(verse) {
    const div = document.createElement('div');
    div.className = 'kannada-only';
    
    const p = document.createElement('p');
    verse.lines.forEach((line, index) => {
        p.innerHTML += line.kannada;
        if (index < verse.lines.length - 1) {
            p.innerHTML += ' <br>';
        }
    });
    div.appendChild(p);
    
    return div;
}

/**
 * Render Kannada with English transliteration
 */
function renderKannadaWithEnglish(verse) {
    const div = document.createElement('div');
    div.className = 'kannada-with-english';
    
    const p = document.createElement('p');
    verse.lines.forEach((line, index) => {
        p.innerHTML += line.kannada + ' <br>';
        p.innerHTML += `<span class="ENG">${line.transliteration}</span>`;
        if (index < verse.lines.length - 1) {
            p.innerHTML += ' <br>';
        }
    });
    div.appendChild(p);
    
    return div;
}

/**
 * Render word-by-word breakdown
 */
function renderWordByWord(verse) {
    const div = document.createElement('div');
    div.className = 'word-by-word';
    
    // Group words into tables for each line
    verse.lines.forEach(line => {
        if (line.words && line.words.length > 0) {
            const table = createWordByWordTable(line.words);
            div.appendChild(table);
        }
    });
    
    // Add complete meaning if available
    if (verse.completeMeaning) {
        const meaningPara = document.createElement('p');
        meaningPara.style.marginTop = '15px';
        meaningPara.style.fontStyle = 'italic';
        meaningPara.style.color = '#666';
        meaningPara.innerHTML = `<strong>Complete meaning:</strong> ${verse.completeMeaning}`;
        div.appendChild(meaningPara);
    }
    
    return div;
}

/**
 * Update ENG element visibility based on mode
 */
function updateEngDisplayVisibility(mode) {
    const elements = document.querySelectorAll('.ENG');
    const shouldShow = mode === 'english';
    
    elements.forEach(element => {
        element.style.display = shouldShow ? 'inline' : 'none';
    });
}

/**
 * Toggle visibility of English transliteration elements
 * This function is called by the Show/Hide English button
 */
function toggleVisibility() {
    const elements = document.querySelectorAll('.ENG');
    
    if (elements.length === 0) {
        console.log('No .ENG elements found');
        return;
    }
    
    // Check current visibility state using class instead of computed style
    const firstElement = elements[0];
    const isCurrentlyVisible = firstElement.classList.contains('show-english');
    
    // Toggle all elements using class
    elements.forEach(element => {
        if (isCurrentlyVisible) {
            element.classList.remove('show-english');
        } else {
            element.classList.add('show-english');
        }
    });
    
    // Update button text
    const button = document.querySelector('.toggle-btn');
    if (button) {
        button.textContent = isCurrentlyVisible ? 'Show English Transliteration' : 'Hide English Transliteration';
    }
    
    console.log('Toggle completed. English is now:', isCurrentlyVisible ? 'hidden' : 'visible');
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
    
    // Render content for the selected mode
    renderContent(mode);
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
    
    // Set initial mode and render content
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
    // General sections from the general/ directory
    const generalSections = [
        'shuddikarana-mantra',
        'ganapati-prarthana', 
        'kuladevata-prarthana',
        'deepaaradhana',
        'achamanam',
        'bhootoochchaatana',
        'pranayama',
        'sankalpam',
        'ghantaa-nadham',
        'chaamaram',
        'puja-end-prarthana',
        'swasti',
        'parisinchana',
        'kalashaaradhana'
    ];
    
    // Stotram sections from the stotram/ directory
    const stotramSections = [
        'lakshmi-ashtottara-satanaama-stotram',
        'lakshmi-ashtakam',
        'kanakadhara-stotram',
        'argala-stotram',
        'dakshinamurthy-stotram',
        'ganpati-sankata-nashana-stotram',
        'garuda-gamana-stotram',
        'lakshmi-chaturvimsati-stotram',
        'lakshmi-chaturvimsati-naamavali',
        'maha-mrityunjaya-mantra',
        'pitru-devata-stotram',
        'ramadootha-anjaneya-stotram',
        'saraswati-kavacham',
        'shiva-panchakshara-stotram',
        'panchakshara-stotram', // Alternative ID for shiva-panchakshara-stotram
        'soundarya-lahari',
        'surya-arghya-mantra',
        'surya-namaskara-mantra',
        'veerabhadra-kavacham',
        'venkateswara-vajra-kavacham',
        'vishnu-sahasranamam',
        'daily-mantras',
        'dattratreya-mantra',
        'vinayaka-ashtottara-satanamavali'
    ];
    
    // Load general sections
    generalSections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            // Determine the correct path based on current location
            const pathPrefix = window.location.pathname.includes('/puja/') ? '../general/' : './general/';
            loadSection(section, `${pathPrefix}${section}.html`);
        }
        

    });
    
    // Load stotram sections
    stotramSections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            // Determine the correct path based on current location
            const pathPrefix = window.location.pathname.includes('/puja/') ? '../stotram/' : './stotram/';
            
            // Handle ID to filename mappings
            let filename = section;
            if (section === 'panchakshara-stotram') {
                filename = 'shiva-panchakshara-stotram';
            }
            
            loadSection(section, `${pathPrefix}${filename}.html`);
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
}



// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePage); 