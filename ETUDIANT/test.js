document.addEventListener('DOMContentLoaded', function() {

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

    function deleteElement(elementName) {
        const grid = document.querySelector('.quick-access-grid');
        if (!grid) {
            addAiMessage("Could not find the grid to modify.");
            return;
        }

        let elementToRemove = null;
        
        grid.querySelectorAll('.quick-access-item').forEach(item => {
            const title = item.querySelector('h3');
            if (title && title.textContent.toLowerCase().includes(elementName.toLowerCase())) {
                elementToRemove = item;
            }
        });

        if (elementToRemove) {
            grid.removeChild(elementToRemove);
            addAiMessage(`Successfully removed ${elementName} card.`);
        } else {
            addAiMessage(`Couldn't find ${elementName} card to remove.`);
        }
    }

    function addNewElement(elementName, iconClass = 'fas fa-cube') {
        const grid = document.querySelector('.quick-access-grid');
        if (!grid) {
            addAiMessage("Could not find the grid to add elements to.");
            return;
        }

        let exists = false;
        grid.querySelectorAll('.quick-access-item h3').forEach(title => {
            if (title.textContent.toLowerCase() === elementName.toLowerCase()) {
                exists = true;
            }
        });

        if (exists) {
            addAiMessage(`${elementName} card already exists.`);
            return;
        }

        const newItem = document.createElement('div');
        newItem.className = 'quick-access-item new-card';
        newItem.innerHTML = `
            <a href="#${elementName.toLowerCase().replace(/\s+/g, '-')}">
                <div class="icon-container">
                    <i class="${iconClass}"></i>
                </div>
                <h3>${elementName}</h3>
            </a>
        `;

        newItem.addEventListener('mouseenter', () => {
            newItem.style.transform = 'translateY(-8px)';
            const iconContainer = newItem.querySelector('.icon-container');
            if (iconContainer) {
                iconContainer.style.backgroundColor = '#dbeafe';
            }
        });
        
        newItem.addEventListener('mouseleave', () => {
            newItem.style.transform = '';
            const iconContainer = newItem.querySelector('.icon-container');
            if (iconContainer) {
                iconContainer.style.backgroundColor = '#f0f4ff';
            }
        });

        grid.appendChild(newItem);
        addAiMessage(`Added new ${elementName} card successfully!`);
    }

    function swapElements(element1, element2) {
        const grid = document.querySelector('.quick-access-grid');
        if (!grid) {
            addAiMessage("Could not find the grid to modify.");
            return;
        }
        
        const items = Array.from(grid.children);
        let index1 = -1, index2 = -1;
        
        items.forEach((item, index) => {
            const title = item.querySelector('h3');
            if (title) {
                const titleText = title.textContent.toLowerCase();
                if (titleText.includes(element1.toLowerCase())) index1 = index;
                if (titleText.includes(element2.toLowerCase())) index2 = index;
            }
        });
        
        if (index1 >= 0 && index2 >= 0) {
            const item1Element = items[index1];
            const item2Element = items[index2];
            
            const placeholder = document.createElement('div');
            
            grid.insertBefore(placeholder, item1Element);
            grid.insertBefore(item2Element, placeholder);
            
            if (index2 < items.length - 1) {
                grid.insertBefore(item1Element, items[index2 + 1]);
            } else {
                grid.appendChild(item1Element);
            }
            
            grid.removeChild(placeholder);
            
            addAiMessage(`Successfully swapped ${element1} and ${element2}!`);
        } else {
            addAiMessage(`Couldn't find both ${element1} and ${element2} to swap.`);
        }
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
        
        const items = document.querySelectorAll('.quick-access-item');
        let changed = false;
        
        items.forEach(item => {
            const title = item.querySelector('h3');
            if (title && title.textContent.toLowerCase().includes(elementName.toLowerCase())) {
                item.style.backgroundColor = `${hexColor}20`;
                const iconContainer = item.querySelector('.icon-container');
                const icon = item.querySelector('i');
                
                if (iconContainer) {
                    iconContainer.style.backgroundColor = `${hexColor}40`;
                }
                if (icon) {
                    icon.style.color = hexColor;
                }
                changed = true;
            }
        });
        
        if (changed) {
            addAiMessage(`Changed ${elementName} to ${color} color.`);
        } else {
            addAiMessage(`Couldn't find ${elementName} to change color.`);
        }
    }

    function moveElement(elementName, positionName) {
        const grid = document.querySelector('.quick-access-grid');
        if (!grid) {
            addAiMessage("Could not find the grid to modify.");
            return;
        }
        
        const items = Array.from(grid.children);
        let elementIndex = -1, positionIndex = -1;
        
        items.forEach((item, index) => {
            const title = item.querySelector('h3');
            if (title) {
                const titleText = title.textContent.toLowerCase();
                if (titleText.includes(elementName.toLowerCase())) elementIndex = index;
                if (titleText.includes(positionName.toLowerCase())) positionIndex = index;
            }
        });
        
        if (elementIndex >= 0 && positionIndex >= 0) {
            const element = items[elementIndex];
            grid.removeChild(element);
            
            const updatedItems = Array.from(grid.children);
            
            let targetIndex = positionIndex;
            if (positionIndex > elementIndex) {
                targetIndex = positionIndex - 1;
            }
            
            if (targetIndex >= updatedItems.length) {
                grid.appendChild(element);
            } else {
                grid.insertBefore(element, updatedItems[targetIndex]);
            }
            
            addAiMessage(`Moved ${elementName} to ${positionName}.`);
        } else {
            addAiMessage(`Couldn't find both ${elementName} and ${positionName} to perform move.`);
        }
    }

    function toggleVisibility(elementName, visible) {
        const items = document.querySelectorAll('.quick-access-item');
        let changed = false;
        
        items.forEach(item => {
            const title = item.querySelector('h3');
            if (title && title.textContent.toLowerCase().includes(elementName.toLowerCase())) {
                item.style.display = visible ? 'flex' : 'none';
                changed = true;
            }
        });
        
        if (changed) {
            addAiMessage(`${visible ? 'Shown' : 'Hidden'} ${elementName}.`);
        } else {
            addAiMessage(`Couldn't find ${elementName} to ${visible ? 'show' : 'hide'}.`);
        }
    }
});