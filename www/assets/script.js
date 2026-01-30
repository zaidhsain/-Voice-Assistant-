// DOM Elements
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messagesContainer = document.getElementById('messages');
const welcomeScreen = document.getElementById('welcomeScreen');
const typingIndicator = document.getElementById('typingIndicator');
const charCount = document.getElementById('charCount');
const themeToggle = document.getElementById('themeToggle');
const voiceBtn = document.getElementById('voiceBtn');
const attachBtn = document.getElementById('attachBtn');

// State
let isTyping = false;
let messageHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupSuggestions();
    autoResizeTextarea();
});

// Event Listeners
function setupEventListeners() {
    sendBtn.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keydown', handleKeyPress);
    messageInput.addEventListener('input', handleInputChange);
    themeToggle.addEventListener('click', toggleTheme);
    voiceBtn.addEventListener('click', handleVoiceInput);
    attachBtn.addEventListener('click', handleAttachment);
    
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', handleNavigation);
    });
}

function setupSuggestions() {
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            const prompt = card.getAttribute('data-prompt');
            messageInput.value = prompt;
            messageInput.focus();
            handleSendMessage();
        });
    });
}

// Message Handling
function handleSendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || isTyping) return;
    
    // Hide welcome screen
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
    }
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    updateCharCount();
    autoResizeTextarea();
    
    // Simulate AI response
    simulateAIResponse(message);
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const time = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            ${sender === 'user' ? 'U' : 'AI'}
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-name">${sender === 'user' ? 'You' : 'ARIA'}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-text">${text}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Store in history
    messageHistory.push({ text, sender, time });
}

function simulateAIResponse(userMessage) {
    isTyping = true;
    typingIndicator.style.display = 'flex';
    scrollToBottom();
    
    // Simulate processing time
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        
        // Generate response based on user message
        const response = generateResponse(userMessage);
        addMessage(response, 'assistant');
        
        isTyping = false;
    }, 1500 + Math.random() * 1000);
}

function generateResponse(message) {
    const responses = {
        'what can you help me with?': `I can assist you with a wide range of tasks including:

• Answering questions and providing information
• Writing and editing content
• Coding and programming help
• Creative brainstorming
• Problem-solving and analysis
• Learning and education support
• And much more!

What would you like help with today?`,
        
        'explain quantum computing': `Quantum computing is a revolutionary approach to computation that leverages quantum mechanical phenomena. Here are the key concepts:

**Quantum Bits (Qubits)**: Unlike classical bits that are either 0 or 1, qubits can exist in multiple states simultaneously through superposition.

**Superposition**: This allows quantum computers to process multiple possibilities at once, exponentially increasing computational power.

**Entanglement**: Qubits can be connected in ways where the state of one instantly affects another, enabling complex calculations.

**Applications**: Quantum computers excel at optimization problems, cryptography, drug discovery, and simulating quantum systems.

Would you like to know more about any specific aspect?`,
        
        'write a creative story': `Once upon a time, in a world where AI and humans lived in harmony, there was a curious young programmer named Alex. One day, while debugging code at 3 AM, Alex discovered something extraordinary...

A hidden algorithm that could predict moments of pure inspiration. But with great power came an interesting question: should such predictions be made, or should creativity remain beautifully unpredictable?

Alex decided to use the algorithm not to predict, but to understand – to learn what conditions fostered creativity, and to help others find their own moments of brilliance.

And so, the greatest code Alex ever wrote wasn't about prediction, but about possibility.

Would you like me to continue this story or write something different?`,
        
        'help me code a website': `I'd be happy to help you code a website! Let me guide you through the process:

**What we need to know:**
1. What type of website? (Portfolio, blog, e-commerce, landing page, etc.)
2. What features do you want?
3. Do you have a design in mind?
4. What's your experience level with web development?

**Basic website structure:**
• HTML for content structure
• CSS for styling and layout
• JavaScript for interactivity
• Optional: React, Vue, or other frameworks for complex apps

Share more details about your project, and I'll provide specific code examples and guidance!`
    };
    
    // Check for keyword matches
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key.toLowerCase())) {
            return response;
        }
    }
    
    // Default responses
    const defaultResponses = [
        `That's an interesting question! Based on your message about "${message}", I'd be happy to help. Could you provide more details so I can give you the most accurate and helpful response?`,
        
        `I understand you're asking about "${message}". Let me help you with that! I can provide information, assistance, or guidance on this topic. What specific aspect would you like to explore?`,
        
        `Great question! Regarding "${message}", I have several thoughts to share. However, to give you the most relevant answer, could you tell me a bit more about what you're trying to accomplish?`,
        
        `I appreciate you reaching out about "${message}". I'm here to help! To provide the best possible assistance, let me know if you're looking for: explanations, examples, code, creative content, or something else entirely.`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Input Handling
function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
}

function handleInputChange() {
    updateCharCount();
    autoResizeTextarea();
}

function updateCharCount() {
    const length = messageInput.value.length;
    charCount.textContent = `${length} / 2000`;
    
    if (length > 2000) {
        charCount.style.color = '#ff4444';
        sendBtn.disabled = true;
    } else {
        charCount.style.color = 'var(--text-secondary)';
        sendBtn.disabled = false;
    }
}

function autoResizeTextarea() {
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    // Update icon
    themeToggle.innerHTML = isLight ? `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
    ` : `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
    `;
}

// Voice Input (Placeholder)
function handleVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = () => {
            voiceBtn.style.background = 'var(--gradient)';
            voiceBtn.style.color = 'white';
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            messageInput.value = transcript;
            updateCharCount();
        };
        
        recognition.onend = () => {
            voiceBtn.style.background = 'transparent';
            voiceBtn.style.color = 'var(--text-secondary)';
        };
        
        recognition.start();
    } else {
        alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
    }
}

// File Attachment (Placeholder)
function handleAttachment() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx,.txt';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            addMessage(`📎 Attached: ${file.name} (${formatFileSize(file.size)})`, 'user');
            setTimeout(() => {
                addMessage(`I've received your file "${file.name}". How would you like me to help you with it?`, 'assistant');
            }, 1000);
        }
    };
    
    input.click();
}

// Navigation
function handleNavigation(e) {
    const view = e.currentTarget.getAttribute('data-view');
    
    // Update active state
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Handle view change
    console.log(`Navigating to: ${view}`);
    // You can implement different views here
}

// Utility Functions
function scrollToBottom() {
    messagesContainer.parentElement.scrollTop = messagesContainer.parentElement.scrollHeight;
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Load theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
});

// Export for potential use
window.chatApp = {
    addMessage,
    messageHistory,
    clearHistory: () => {
        messageHistory = [];
        messagesContainer.innerHTML = '';
        welcomeScreen.style.display = 'flex';
    }
};