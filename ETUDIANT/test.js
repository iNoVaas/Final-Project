document.addEventListener('DOMContentLoaded', function() {

    const STORAGE_KEY = 'student_portal_layout';
    const DEFAULT_LAYOUT = {
        cards: [
            { id: 'my-cursus', title: 'My Cursus', icon: 'fas fa-graduation-cap', color: null, visible: true },
            { id: 'announcements', title: 'Announcements', icon: 'fas fa-bullhorn', color: null, visible: true },
            { id: 'schedule', title: 'Emploi du Temps', icon: 'fas fa-calendar-alt', color: null, visible: true },
            { id: 'virtual-library', title: 'Virtual Library', icon: 'fas fa-book', color: null, visible: true },
            { id: 'grades', title: 'Grades', icon: 'fas fa-chart-bar', color: null, visible: true },
            { id: 'assignments', title: 'Assignments', icon: 'fas fa-tasks', color: null, visible: true },
            { id: 'documents', title: 'Documents', icon: 'fas fa-file-alt', color: null, visible: true },
            { id: 'settings', title: 'Settings', icon: 'fas fa-cog', color: null, visible: true }
        ],
        deletedCards: [],
        lastModified: new Date().toISOString()
    };

    let currentLayout = loadLayout();

    function loadLayout() {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (!savedData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LAYOUT));
            return JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
        }
        
        try {
            const parsed = JSON.parse(savedData);
            
            if (parsed.cards && Array.isArray(parsed.cards)) {
                const savedCardIds = new Set(parsed.cards.map(card => card.id));
                const deletedCardIds = new Set(parsed.deletedCards || []);
                
                // Only add default cards that are not already present AND not in deleted list
                const newDefaultCards = DEFAULT_LAYOUT.cards.filter(
                    defaultCard => !savedCardIds.has(defaultCard.id) && !deletedCardIds.has(defaultCard.id)
                );
                
                const finalCards = [...parsed.cards, ...newDefaultCards];
                
                return {
                    cards: finalCards,
                    deletedCards: parsed.deletedCards || [],
                    lastModified: parsed.lastModified || new Date().toISOString()
                };
            }
            
            return JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
        } catch (error) {
            console.error('Error parsing saved layout:', error);
            return JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
        }
    }

    function saveLayout() {
        currentLayout.lastModified = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentLayout));
        console.log('Layout saved:', currentLayout);
    }

    function renderLayout() {
        const grid = document.querySelector('.quick-access-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        currentLayout.cards.filter(card => card.visible).forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'quick-access-item';
            cardElement.dataset.cardId = card.id;
            
            const bgColor = card.color ? `${card.color}20` : '';
            const iconBgColor = card.color ? `${card.color}40` : '#f0f4ff';
            const iconColor = card.color || '#3b82f6';
            
            cardElement.innerHTML = `
                <a href="#${card.id}" style="${bgColor ? `background-color: ${bgColor};` : ''}">
                    <div class="icon-container" style="background-color: ${iconBgColor};">
                        <i class="${card.icon}" style="color: ${iconColor};"></i>
                    </div>
                    <h3>${card.title}</h3>
                </a>
            `;

            cardElement.addEventListener('mouseenter', () => {
                cardElement.style.transform = 'translateY(-8px)';
                const iconContainer = cardElement.querySelector('.icon-container');
                if (iconContainer) {
                    iconContainer.style.backgroundColor = card.color ? 
                        `${card.color}60` : '#dbeafe';
                }
            });
            
            cardElement.addEventListener('mouseleave', () => {
                cardElement.style.transform = '';
                const iconContainer = cardElement.querySelector('.icon-container');
                if (iconContainer) {
                    iconContainer.style.backgroundColor = iconBgColor;
                }
            });

            grid.appendChild(cardElement);
        });
    }

    function addNewElement(elementName, iconClass = 'fas fa-cube') {
        const id = elementName.toLowerCase().replace(/\s+/g, '-');
        
        if (currentLayout.cards.some(card => card.id === id)) {
            addAiMessage(`${elementName} card already exists.`);
            return false;
        }

        currentLayout.cards.push({
            id,
            title: elementName,
            icon: iconClass,
            color: null,
            visible: true
        });
        
        saveLayout();
        renderLayout();
        addAiMessage(`Added new ${elementName} card successfully!`);
        return true;
    }

    function deleteElement(elementName) {
        const cardIndex = currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === elementName.toLowerCase()
        );
        
        if (cardIndex === -1) {
            addAiMessage(`Couldn't find ${elementName} card to remove.`);
            return false;
        }

        const deletedCard = currentLayout.cards[cardIndex];
        
        // Check if this was a default card and add it to deleted list
        const isDefaultCard = DEFAULT_LAYOUT.cards.some(card => card.id === deletedCard.id);
        if (isDefaultCard) {
            if (!currentLayout.deletedCards) {
                currentLayout.deletedCards = [];
            }
            if (!currentLayout.deletedCards.includes(deletedCard.id)) {
                currentLayout.deletedCards.push(deletedCard.id);
            }
        }

        currentLayout.cards.splice(cardIndex, 1);
        saveLayout();
        renderLayout();
        addAiMessage(`Successfully removed ${elementName} card.`);
        return true;
    }

    function swapElements(element1, element2) {
        const index1 = currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === element1.toLowerCase()
        );
        const index2 = currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === element2.toLowerCase()
        );

        if (index1 === -1 || index2 === -1) {
            addAiMessage(`Couldn't find both ${element1} and ${element2} to swap.`);
            return false;
        }

        [currentLayout.cards[index1], currentLayout.cards[index2]] = 
            [currentLayout.cards[index2], currentLayout.cards[index1]];
        
        saveLayout();
        renderLayout();
        addAiMessage(`Successfully swapped ${element1} and ${element2}!`);
        return true;
    }

    function changeElementColor(elementName, color) {
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
        
        const cardIndex = currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === elementName.toLowerCase()
        );
        
        if (cardIndex === -1) {
            addAiMessage(`Couldn't find ${elementName} to change color.`);
            return false;
        }

        currentLayout.cards[cardIndex].color = hexColor;
        saveLayout();
        renderLayout();
        addAiMessage(`Changed ${elementName} to ${color} color.`);
        return true;
    }

    function moveElement(elementName, positionName) {
        const elementIndex = currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === elementName.toLowerCase()
        );
        const positionIndex = currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === positionName.toLowerCase()
        );

        if (elementIndex === -1 || positionIndex === -1) {
            addAiMessage(`Couldn't find both ${elementName} and ${positionName} to perform move.`);
            return false;
        }

        const [movedCard] = currentLayout.cards.splice(elementIndex, 1);
        currentLayout.cards.splice(positionIndex, 0, movedCard);
        
        saveLayout();
        renderLayout();
        addAiMessage(`Moved ${elementName} to ${positionName}.`);
        return true;
    }

    function toggleVisibility(elementName, visible) {
        const cardIndex = currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === elementName.toLowerCase()
        );
        
        if (cardIndex === -1) {
            addAiMessage(`Couldn't find ${elementName} to ${visible ? 'show' : 'hide'}.`);
            return false;
        }

        currentLayout.cards[cardIndex].visible = visible;
        saveLayout();
        renderLayout();
        addAiMessage(`${visible ? 'Shown' : 'Hidden'} ${elementName}.`);
        return true;
    }


    const aiLaunchButton = document.getElementById('ai-launch-button');
    const aiChatContainer = document.getElementById('ai-chat-container');
    const closeAiChat = document.getElementById('close-ai-chat');
    const aiPromptInput = document.getElementById('ai-prompt-input');
    const aiSubmit = document.getElementById('ai-submit');
    const aiMessages = document.getElementById('ai-messages');

    if (aiChatContainer) {
        aiChatContainer.classList.remove('active');
    }

    if (aiLaunchButton && aiChatContainer) {
        aiLaunchButton.addEventListener('click', function(e) {
            e.stopPropagation();
            aiChatContainer.classList.toggle('active');
            
            if (aiChatContainer.classList.contains('active') && aiPromptInput) {
                setTimeout(() => {
                    aiPromptInput.focus();
                }, 100);
            }
        });
    }
    
    if (closeAiChat && aiChatContainer) {
        closeAiChat.addEventListener('click', function(e) {
            e.stopPropagation();
            aiChatContainer.classList.remove('active');
        });
    }
    
    document.addEventListener('click', function(e) {
        if (aiChatContainer && aiChatContainer.classList.contains('active')) {
            if (!aiChatContainer.contains(e.target) && 
                e.target !== aiLaunchButton && 
                !aiLaunchButton.contains(e.target)) {
                aiChatContainer.classList.remove('active');
            }
        }
    });
    
    if (aiChatContainer) {
        aiChatContainer.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    function addAiMessage(content, isUser = false) {
        if (!aiMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'ai-message-user' : 'ai-message-bot';
        messageDiv.textContent = content;
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    function processAiCommand(prompt) {
        addAiMessage("Processing your request...");
        
        fetch('http://localhost:5000/process-prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                current_html: document.documentElement.outerHTML
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            addAiMessage(data.message);
            
            switch (data.action) {
                case "delete_element":
                    deleteElement(data.element);
                    break;
                case "add_element":
                    addNewElement(data.element, data.icon);
                    break;
                case "swap_elements":
                    swapElements(data.elements[0], data.elements[1]);
                    break;
                case "change_color":
                    changeElementColor(data.element, data.color);
                    break;
                case "move_element":
                    moveElement(data.element, data.position);
                    break;
                case "toggle_visibility":
                    toggleVisibility(data.element, data.visible);
                    break;
                default:
                    break;
            }
        })
        .catch(error => {
            console.error('Error processing AI command:', error);
            addAiMessage("Sorry, there was an error processing your request. Please make sure the server is running.");
        });
    }

    function handleAiPrompt() {
        if (!aiPromptInput || !aiMessages) return;
        
        const prompt = aiPromptInput.value.trim();
        if (prompt) {
            addAiMessage(prompt, true);
            aiPromptInput.value = '';
            processAiCommand(prompt);
        }
    }
    
    if (aiSubmit) {
        aiSubmit.addEventListener('click', handleAiPrompt);
    }
    
    if (aiPromptInput) {
        aiPromptInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleAiPrompt();
            }
        });
    }

    const sidebarToggle = document.getElementById('sidebar-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    if (closeSidebar && sidebar) {
        closeSidebar.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    }
    
    window.addEventListener('resize', function() {
        if (sidebar) {
            if (window.innerWidth >= 1024) {
                sidebar.classList.add('active');
            } else {
                sidebar.classList.remove('active');
            }
        }
    });

    if (sidebar && window.innerWidth >= 1024) {
        sidebar.classList.add('active');
    }

    renderLayout();

    window.addEventListener('storage', (event) => {
        if (event.key === STORAGE_KEY) {
            currentLayout = JSON.parse(event.newValue);
            renderLayout();
        }
    });

    window.resetPortalLayout = function() {
        if (confirm('Reset layout to default? All customizations will be lost.')) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        }
    };

    window.debugLayout = function() {
        console.log('Current Layout:', currentLayout);
        console.log('LocalStorage:', localStorage.getItem(STORAGE_KEY));
    };
});