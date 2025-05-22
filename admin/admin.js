class AdminDashboard {
    constructor() {
        this.selectedProfile = null;
        this.messages = [];
        this.isLoading = false;
        this.isFullscreen = true;
        this.currentLayout = {
            cards: [],
            deletedCards: [],
            lastModified: new Date().toISOString()
        };
        this.initializeEventListeners();
        this.loadDefaultLayouts();
    }

    loadDefaultLayouts() {
        this.defaultLayouts = {
            student: [
                { id: 'my-cursus', title: 'My Cursus', icon: 'fas fa-graduation-cap', color: null, visible: true },
                { id: 'announcements', title: 'Announcements', icon: 'fas fa-bullhorn', color: null, visible: true },
                { id: 'schedule', title: 'Emploi du Temps', icon: 'fas fa-calendar-alt', color: null, visible: true },
                { id: 'virtual-library', title: 'Virtual Library', icon: 'fas fa-book', color: null, visible: true },
                { id: 'grades', title: 'Grades', icon: 'fas fa-chart-bar', color: null, visible: true },
                { id: 'assignments', title: 'Assignments', icon: 'fas fa-tasks', color: null, visible: true },
                { id: 'documents', title: 'Documents', icon: 'fas fa-file-alt', color: null, visible: true },
                { id: 'settings', title: 'Settings', icon: 'fas fa-cog', color: null, visible: true }
            ],
            teacher: [
                { id: 'my-classes', title: 'My Classes', icon: 'fas fa-chalkboard-teacher', color: null, visible: true },
                { id: 'lesson-plans', title: 'Lesson Plans', icon: 'fas fa-book-open', color: null, visible: true },
                { id: 'gradebook', title: 'Gradebook', icon: 'fas fa-clipboard-list', color: null, visible: true },
                { id: 'student-progress', title: 'Student Progress', icon: 'fas fa-chart-line', color: null, visible: true },
                { id: 'resources', title: 'Teaching Resources', icon: 'fas fa-folder-open', color: null, visible: true },
                { id: 'calendar', title: 'Academic Calendar', icon: 'fas fa-calendar', color: null, visible: true },
                { id: 'communications', title: 'Communications', icon: 'fas fa-envelope', color: null, visible: true },
                { id: 'reports', title: 'Reports', icon: 'fas fa-file-chart', color: null, visible: true }
            ],
            ats: [
                { id: 'dashboard', title: 'System Dashboard', icon: 'fas fa-tachometer-alt', color: null, visible: true },
                { id: 'user-management', title: 'User Management', icon: 'fas fa-users', color: null, visible: true },
                { id: 'server-status', title: 'Server Status', icon: 'fas fa-server', color: null, visible: true },
                { id: 'backup-restore', title: 'Backup & Restore', icon: 'fas fa-database', color: null, visible: true },
                { id: 'security-logs', title: 'Security Logs', icon: 'fas fa-shield-alt', color: null, visible: true },
                { id: 'system-updates', title: 'System Updates', icon: 'fas fa-download', color: null, visible: true },
                { id: 'maintenance', title: 'Maintenance', icon: 'fas fa-tools', color: null, visible: true },
                { id: 'analytics', title: 'Analytics', icon: 'fas fa-chart-pie', color: null, visible: true }
            ],
            doctoral: [
                { id: 'research-project', title: 'Research Project', icon: 'fas fa-microscope', color: null, visible: true },
                { id: 'literature-review', title: 'Literature Review', icon: 'fas fa-book-reader', color: null, visible: true },
                { id: 'data-analysis', title: 'Data Analysis', icon: 'fas fa-chart-area', color: null, visible: true },
                { id: 'thesis-writing', title: 'Thesis Writing', icon: 'fas fa-pen-fancy', color: null, visible: true },
                { id: 'publications', title: 'Publications', icon: 'fas fa-newspaper', color: null, visible: true },
                { id: 'conferences', title: 'Conferences', icon: 'fas fa-users', color: null, visible: true },
                { id: 'supervisor-meetings', title: 'Supervisor Meetings', icon: 'fas fa-handshake', color: null, visible: true },
                { id: 'resources', title: 'Research Resources', icon: 'fas fa-archive', color: null, visible: true }
            ]
        };
    }

    initializeEventListeners() {
        // Full screen profile selection
        document.querySelectorAll('.profile-card-fullscreen').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectProfileFullscreen(e.currentTarget.dataset.profile);
            });
        });

        // Sidebar profile selection (for switching)
        document.querySelectorAll('.profile-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.switchProfile(e.currentTarget.dataset.profile);
            });
        });
    }

    initializeChatEventListeners() {
        // Send button
        const sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
        }

        // Input field - Enter key
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            // Auto-resize input and enable/disable send button
            messageInput.addEventListener('input', () => {
                const sendBtn = document.getElementById('sendBtn');
                if (sendBtn) {
                    sendBtn.disabled = !messageInput.value.trim();
                }
            });
        }

        // Close chat button
        const closeChatBtn = document.getElementById('closeChatBtn');
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', () => this.closeChat());
        }

        // Back button
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToFullscreen());
        }
    }

    selectProfileFullscreen(profile) {
        const selectedCard = document.querySelector(`.profile-card-fullscreen[data-profile="${profile}"]`);
        
        // Add selecting animation
        selectedCard.classList.add('selecting');
        
        // Start transition after a short delay
        setTimeout(() => {
            this.transitionToChat(profile);
        }, 300);
    }

    transitionToChat(profile) {
        const fullscreenSection = document.getElementById('profilesFullscreen');
        const dashboard = document.getElementById('dashboard');
        const header = document.getElementById('header');
        
        this.selectedProfile = profile;
        this.currentLayout.cards = JSON.parse(JSON.stringify(this.defaultLayouts[profile]));

        // Hide fullscreen and show dashboard
        fullscreenSection.classList.add('hidden');
        header.classList.add('compact');
        
        // Show dashboard after fullscreen animation
        setTimeout(() => {
            dashboard.classList.add('active');
            this.setupChat(profile);
            this.updateProfileSelection(profile);
            this.isFullscreen = false;
        }, 500);
    }

    updateProfileSelection(profile) {
        // Remove previous selection
        document.querySelectorAll('.profile-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Add selection to current profile
        const selectedCard = document.querySelector(`.profile-card[data-profile="${profile}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
    }

    switchProfile(profile) {
        if (this.selectedProfile === profile) return;

        this.selectedProfile = profile;
        this.currentLayout.cards = JSON.parse(JSON.stringify(this.defaultLayouts[profile]));
        this.updateProfileSelection(profile);
        this.setupChat(profile);
    }

    setupChat(profile) {
        const chatSection = document.getElementById('chatbotSection');
        const profileName = this.getProfileName(profile);
        const profileIcon = this.getProfileIcon(profile);

        // Set up chat interface
        chatSection.innerHTML = `
            <div class="chat-header">
                <div class="chat-title">
                    <div class="chat-title-icon" id="chatIcon">${profileIcon}</div>
                    <div class="chat-title-text">Chat with <span id="selectedProfileName">${profileName}</span></div>
                </div>
                <div class="chat-buttons">
                    <button class="back-btn" id="backBtn" title="Back to profile selection">←</button>
                    <button class="close-chat" id="closeChatBtn" title="Close chat">×</button>
                </div>
            </div>
            
            <div class="chat-messages" id="chatMessages">
                <div class="placeholder-message">
                    Starting conversation with ${profileName}...
                </div>
            </div>
            
            <div class="chat-input">
                <input type="text" class="input-field" id="messageInput" placeholder="Type your message here..." disabled>
                <button class="send-btn" id="sendBtn" disabled>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                </button>
            </div>
        `;

        // Initialize chat event listeners
        this.initializeChatEventListeners();

        // Show chat section with animation
        setTimeout(() => {
            chatSection.classList.add('active');
        }, 100);

        // Clear messages and add welcome message
        this.messages = [];
        setTimeout(() => {
            this.displayWelcomeMessage(profileName);
            // Enable input after welcome message
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.disabled = false;
                messageInput.focus();
            }
        }, 300);
    }

    backToFullscreen() {
        const fullscreenSection = document.getElementById('profilesFullscreen');
        const dashboard = document.getElementById('dashboard');
        const header = document.getElementById('header');
        const chatSection = document.getElementById('chatbotSection');

        // Hide dashboard
        dashboard.classList.remove('active');
        chatSection.classList.remove('active');
        header.classList.remove('compact');

        // Reset state
        this.selectedProfile = null;
        this.messages = [];
        this.isLoading = false;
        this.isFullscreen = true;
        this.currentLayout = { cards: [], deletedCards: [], lastModified: new Date().toISOString() };

        // Show fullscreen after animation
        setTimeout(() => {
            fullscreenSection.classList.remove('hidden');
            
            // Remove selecting state from all cards
            document.querySelectorAll('.profile-card-fullscreen').forEach(card => {
                card.classList.remove('selecting');
            });
            
            // Remove profile selection
            document.querySelectorAll('.profile-card').forEach(card => {
                card.classList.remove('selected');
            });
        }, 500);
    }

    closeChat() {
        const chatSection = document.getElementById('chatbotSection');
        
        // Remove active state
        chatSection.classList.remove('active');
        
        // Remove profile selection
        document.querySelectorAll('.profile-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Reset state
        this.selectedProfile = null;
        this.messages = [];
        this.isLoading = false;
        this.currentLayout = { cards: [], deletedCards: [], lastModified: new Date().toISOString() };
        
        // After animation, restore empty state
        setTimeout(() => {
            chatSection.innerHTML = `
                <div class="placeholder-message" style="margin-top: 200px; font-size: 1.2rem;">
                    Select a profile from the left to start a conversation
                </div>
            `;
        }, 300);
    }

    getProfileName(profile) {
        const names = {
            student: 'Student',
            teacher: 'Teacher',
            ats: 'ATS',
            doctoral: 'Doctoral'
        };
        return names[profile] || profile;
    }

    getProfileIcon(profile) {
        const icons = {
            student: '🎓',
            teacher: '👨‍🏫',
            ats: '⚙️',
            doctoral: '🔬'
        };
        return icons[profile] || '🤖';
    }

    displayWelcomeMessage(profileName) {
        const welcomeMessages = {
            student: `Hello! I'm your AI assistant for students. I can help you manage your academic layout. Try commands like:
• "Add new Exams card"
• "Remove Library card"
• "Change Grades color to blue"
• "Swap My Cursus and Announcements"
• "Show me current layout"

What would you like to modify?`,
            teacher: `Hello! I'm your AI assistant for educators. I can help you customize your teaching dashboard. Try commands like:
• "Add Attendance card"
• "Remove Reports section"
• "Change Gradebook color to green"
• "Move Lesson Plans after My Classes"
• "Show current layout"

How can I help you organize your teaching tools?`,
            ats: `Hello! I'm your administrative and technical support assistant. I can help you manage your system dashboard. Try commands like:
• "Add Monitoring card"
• "Delete Maintenance section"
• "Change Server Status color to red"
• "Swap User Management and Security Logs"
• "Display current layout"

What system modifications do you need?`,
            doctoral: `Hello! I'm your research assistant for doctoral studies. I can help you organize your research dashboard. Try commands like:
• "Add Bibliography card"
• "Remove Conferences section"
• "Change Data Analysis color to purple"
• "Move Thesis Writing before Publications"
• "Show layout status"

What research tools would you like to adjust?`
        };

        const message = welcomeMessages[this.selectedProfile] || `Hello! I'm your AI assistant configured for the ${profileName} profile. I can help you modify your dashboard layout. What would you like to change?`;
        this.addMessage('bot', message);
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        const message = input.value.trim();

        if (!message || this.isLoading) return;

        // Disable send button and input
        if (sendBtn) sendBtn.disabled = true;
        if (input) input.disabled = true;

        // Add user message
        this.addMessage('user', message);
        input.value = '';

        // Show loading
        this.isLoading = true;
        this.showLoading();

        try {
            // Call your Python admin API
            const response = await this.callAdminAPI(message, this.selectedProfile);
            this.hideLoading();
            
            // Process the response
            if (response.action) {
                this.processLayoutAction(response);
            }
            
            this.addMessage('bot', response.message);
        } catch (error) {
            this.hideLoading();
            this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
            console.error('Admin API error:', error);
        } finally {
            this.isLoading = false;
            
            // Re-enable send button and input
            if (input) {
                input.disabled = false;
                input.focus();
            }
            if (sendBtn) sendBtn.disabled = false;
        }
    }

    async callAdminAPI(message, profile) {
        // Replace this URL with your actual Python admin API endpoint
        const apiUrl = 'http://localhost:5000/admin-chat';
        
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    profile: profile,
                    current_layout: this.currentLayout,
                    conversation_history: this.messages.slice(-10)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API call failed:', error);
            
            // For demo purposes, return a mock response based on simple parsing
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
            return this.getMockResponse(message, profile);
        }
    }

    getMockResponse(message, profile) {
        const messageLower = message.toLowerCase();
        
        // Show current layout
        if (messageLower.includes('show') && (messageLower.includes('layout') || messageLower.includes('current'))) {
            const visibleCards = this.currentLayout.cards.filter(card => card.visible);
            const cardList = visibleCards.map(card => `• ${card.title}`).join('\n');
            return {
                action: 'show_layout',
                message: `Current ${this.getProfileName(profile)} layout:\n\n${cardList}\n\nTotal: ${visibleCards.length} cards visible`
            };
        }
        
        // Add new card
        const addMatch = message.match(/add\s+(?:new\s+)?(.+?)(?:\s+card)?$/i);
        if (addMatch) {
            const cardName = addMatch[1].trim();
            return {
                action: 'add_element',
                element: cardName,
                icon: 'fas fa-cube',
                message: `Adding new ${cardName} card to your ${this.getProfileName(profile)} dashboard.`
            };
        }
        
        // Remove/delete card
        const removeMatch = message.match(/(?:remove|delete)\s+(?:the\s+)?(.+?)(?:\s+card)?$/i);
        if (removeMatch) {
            const cardName = removeMatch[1].trim();
            return {
                action: 'delete_element',
                element: cardName,
                message: `Removing ${cardName} card from your dashboard.`
            };
        }
        
        // Change color
        const colorMatch = message.match(/change\s+(.+?)\s+(?:color\s+)?to\s+(red|blue|green|yellow|purple|orange|pink)/i);
        if (colorMatch) {
            const [, cardName, color] = colorMatch;
            return {
                action: 'change_color',
                element: cardName.trim(),
                color: color.trim(),
                message: `Changing ${cardName} color to ${color}.`
            };
        }
        
        // Swap cards
        const swapMatch = message.match(/swap\s+(.+?)\s+(?:and|with)\s+(.+)/i);
        if (swapMatch) {
            const [, card1, card2] = swapMatch;
            return {
                action: 'swap_elements',
                elements: [card1.trim(), card2.trim()],
                message: `Swapping ${card1.trim()} and ${card2.trim()} positions.`
            };
        }
        
        return {
            message: `I understand you want to modify your ${this.getProfileName(profile)} dashboard. Try commands like:
• "Add new [card name]"
• "Remove [card name]"
• "Change [card name] color to [color]"
• "Swap [card1] and [card2]"
• "Show current layout"`
        };
    }

    processLayoutAction(response) {
        switch (response.action) {
            case 'add_element':
                this.addNewElement(response.element, response.icon);
                break;
            case 'delete_element':
                this.deleteElement(response.element);
                break;
            case 'change_color':
                this.changeElementColor(response.element, response.color);
                break;
            case 'swap_elements':
                this.swapElements(response.elements[0], response.elements[1]);
                break;
            case 'show_layout':
                // Already handled in message
                break;
        }
    }

    addNewElement(elementName, iconClass = 'fas fa-cube') {
        const id = elementName.toLowerCase().replace(/\s+/g, '-');
        
        if (this.currentLayout.cards.some(card => card.id === id)) {
            return false;
        }

        this.currentLayout.cards.push({
            id,
            title: elementName,
            icon: iconClass,
            color: null,
            visible: true
        });
        
        return true;
    }

    deleteElement(elementName) {
        const cardIndex = this.currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === elementName.toLowerCase()
        );
        
        if (cardIndex === -1) {
            return false;
        }

        this.currentLayout.cards.splice(cardIndex, 1);
        return true;
    }

    swapElements(element1, element2) {
        const index1 = this.currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === element1.toLowerCase()
        );
        const index2 = this.currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === element2.toLowerCase()
        );

        if (index1 === -1 || index2 === -1) {
            return false;
        }

        [this.currentLayout.cards[index1], this.currentLayout.cards[index2]] = 
            [this.currentLayout.cards[index2], this.currentLayout.cards[index1]];
        
        return true;
    }

    changeElementColor(elementName, color) {
        const colorMap = {
            'red': '#ef4444',
            'blue': '#3b82f6',
            'green': '#10b981',
            'yellow': '#f59e0b',
            'purple': '#8b5cf6',
            'orange': '#f97316',
            'pink': '#ec4899'
        };
        
        const hexColor = colorMap[color.toLowerCase()] || '#3b82f6';
        
        const cardIndex = this.currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === elementName.toLowerCase()
        );
        
        if (cardIndex === -1) {
            return false;
        }

        this.currentLayout.cards[cardIndex].color = hexColor;
        return true;
    }

    addMessage(sender, content) {
        const messagesContainer = document.getElementById('chatMessages');
        
        if (!messagesContainer) return;
        
        // Remove placeholder if it exists
        const placeholder = messagesContainer.querySelector('.placeholder-message');
        if (placeholder) {
            placeholder.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '🤖' : '👤';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.style.whiteSpace = 'pre-line'; // Allow line breaks
        messageContent.textContent = content;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom smoothly
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);

        // Store message
        this.messages.push({ sender, content, timestamp: new Date() });
    }

    showLoading() {
        const messagesContainer = document.getElementById('chatMessages');
        if (!messagesContainer) return;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message bot loading-message';
        loadingDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content loading">
                Thinking<span class="loading-dots"></span>
            </div>
        `;
        messagesContainer.appendChild(loadingDiv);
        
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    hideLoading() {
        const loadingMessage = document.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    // Utility methods
    clearConversation() {
        this.messages = [];
        const messagesContainer = document.getElementById('chatMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="placeholder-message">
                    Conversation cleared. How can I help you?
                </div>
            `;
        }
    }

    exportConversation() {
        if (this.messages.length === 0) {
            alert('No conversation to export');
            return;
        }

        const conversation = this.messages.map(msg => 
            `${msg.sender.toUpperCase()}: ${msg.content}`
        ).join('\n\n');

        const blob = new Blob([conversation], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `admin_conversation_${this.selectedProfile}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportCurrentLayout() {
        if (!this.selectedProfile || this.currentLayout.cards.length === 0) {
            alert('No layout to export');
            return;
        }

        const layoutData = {
            profile: this.selectedProfile,
            layout: this.currentLayout,
            exported: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(layoutData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.selectedProfile}_layout_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const dashboard = new AdminDashboard();
    
    // Make dashboard globally accessible for debugging
    window.adminDashboard = dashboard;
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key to close chat or go back
        if (e.key === 'Escape') {
            if (!dashboard.isFullscreen) {
                dashboard.backToFullscreen();
            }
        }
        
        // Ctrl+Enter to send message (alternative to Enter)
        if (e.ctrlKey && e.key === 'Enter') {
            dashboard.sendMessage();
        }
        
        // Ctrl+E to export conversation
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            dashboard.exportConversation();
        }
        
        // Ctrl+L to export layout
        if (e.ctrlKey && e.key === 'l') {
            e.preventDefault();
            dashboard.exportCurrentLayout();
        }
    });
});