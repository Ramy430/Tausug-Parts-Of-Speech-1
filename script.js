// script.js - Tausug Parts of Speech

document.addEventListener('DOMContentLoaded', function() {
    // Get all buttons and content area
    const buttons = document.querySelectorAll('.speech-btn');
    const contentArea = document.getElementById('content-area');
    
    // Map button data-part to JSON file paths
    const partToFile = {
        'ngan': 'json/ngan.json',
        'ganti': 'json/gantingan.json',
        'piil': 'json/piil.json',
        'papata': 'json/papata.json',
        'kahantang': 'json/kahantang.json',
        'parbutangan': 'json/parbutangan.json',
        'panglangkum': 'json/panglangkum.json',
        'pangtarsanggang': 'json/pangtarsanggang.json',
        'hurop': 'json/hurop.json'
    };
    
    // Part of speech display names and descriptions
    const partInfo = {
        'ngan': {
            name: 'Ngan (Nouns)',
            description: 'Words that name people, places, things, or ideas.',
            icon: 'fa-file-signature'
        },
        'ganti': {
            name: "Ganti'ngan (Pronouns)",
            description: 'Words that take the place of nouns.',
            icon: 'fa-user'
        },
        'piil': {
            name: "Pi'il (Verbs)",
            description: 'Words that express actions, occurrences, or states of being.',
            icon: 'fa-running'
        },
        'papata': {
            name: 'Papata (Adjectives)',
            description: 'Words that describe or modify nouns.',
            icon: 'fa-pen-alt'
        },
        'kahantang': {
            name: 'Kahantang (Adverbs)',
            description: 'Words that modify verbs, adjectives, or other adverbs.',
            icon: 'fa-clock'
        },
        'parbutangan': {
            name: 'Parbutangan (Prepositions)',
            description: 'Words that show relationships between nouns and other words.',
            icon: 'fa-map-marker-alt'
        },
        'panglangkum': {
            name: 'Panglangkum (Conjunctions)',
            description: 'Words that connect words, phrases, or clauses.',
            icon: 'fa-link'
        },
        'pangtarsanggang': {
            name: 'Pangtarsanggang (Interjections)',
            description: 'Words or phrases that express strong emotion or sudden reaction.',
            icon: 'fa-exclamation-circle'
        },
        'hurop': {
            name: 'Hurop (Articles)',
            description: 'Words that define a noun as specific or unspecific (like "the", "a", "an" in English).',
            icon: 'fa-hashtag'
        }
    };
    
    // Add click handlers to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the part of speech
            const part = this.getAttribute('data-part');
            
            // Load and display the JSON data
            loadPartOfSpeech(part);
        });
    });
    
    /**
     * Load JSON file for selected part of speech
     */
    function loadPartOfSpeech(part) {
        const filePath = partToFile[part];
        const info = partInfo[part];
        
        // Show loading indicator
        contentArea.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading ${info.name}...</p>
            </div>
        `;
        
        // Fetch the JSON file
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load ${filePath}`);
                }
                return response.json();
            })
            .then(data => {
                displayPartOfSpeech(data, info);
            })
            .catch(error => {
                console.error('Error:', error);
                contentArea.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>Error Loading ${info.name}</h3>
                        <p>${error.message}</p>
                        <p>Please make sure the file <strong>${filePath}</strong> exists in the <strong>/json/</strong> folder.</p>
                    </div>
                `;
            });
    }
    
    /**
     * Display vocabulary for selected part of speech
     */
    function displayPartOfSpeech(data, info) {
        const vocabulary = data.vocabulary || [];
        
        let html = `
            <div class="part-of-speech-header">
                <h2>
                    <i class="fas ${info.icon}"></i> 
                    ${info.name}
                </h2>
                <p>${info.description}</p>
            </div>
        `;
        
        if (vocabulary.length > 0) {
            html += `<div class="words-container">`;
            
            vocabulary.forEach(item => {
                html += `
                <div class="word-card">
                    <div class="word-header">
                        <h3 class="tausug-word">${item.tausug}</h3>
                        ${item.pronunciation ? `<span class="pronunciation">${item.pronunciation}</span>` : ''}
                    </div>
                    <p class="english-word"><em>${item.english}</em></p>
                    ${item.definition ? `<p class="definition">${item.definition}</p>` : ''}
                    ${item.examples ? generateExamplesHTML(item.examples) : ''}
                    ${item.notes ? `<div class="notes"><strong>Note:</strong> ${item.notes}</div>` : ''}
                    ${item.synonyms ? `<div class="synonyms"><strong>Synonyms:</strong> ${item.synonyms.join(', ')}</div>` : ''}
                    ${item.antonyms ? `<div class="antonyms"><strong>Antonyms:</strong> ${item.antonyms.join(', ')}</div>` : ''}
                    ${item.variants ? `<div class="notes"><strong>Variants:</strong> ${item.variants.join(', ')}</div>` : ''}
                    ${item.response ? `<div class="notes"><strong>Response:</strong> ${item.response}</div>` : ''}
                </div>
                `;
            });
            
            html += `</div>`;
        } else {
            // Show placeholder for empty categories
            html += `
                <div class="placeholder-content">
                    <i class="fas ${info.icon}"></i>
                    <h3>No entries yet</h3>
                    <p>Vocabulary for ${info.name} is being added.</p>
                    ${part === 'hurop' ? `
                        <p style="margin-top: 20px; font-style: italic;">
                            Note: Tausug often uses context and demonstratives (like "ini" - this, "iyan" - that) 
                            instead of separate articles.
                        </p>
                    ` : ''}
                </div>
            `;
        }
        
        contentArea.innerHTML = html;
    }
    
    /**
     * Generate HTML for examples
     */
    function generateExamplesHTML(examples) {
        if (!examples || examples.length === 0) return '';
        
        let html = '<div class="examples"><h4>Examples:</h4><ul>';
        examples.forEach(ex => {
            html += `
                <li>
                    <p class="example-tausug">${ex.tausug}</p>
                    <p class="example-english">${ex.english}</p>
                    ${ex.context ? `<p class="example-context">(${ex.context})</p>` : ''}
                </li>
            `;
        });
        html += '</ul></div>';
        return html;
    }
    
    /**
     * Helper function to format text with proper diacritics
     */
    function formatTausugText(text) {
        // This function can be expanded if needed
        return text;
    }
});
