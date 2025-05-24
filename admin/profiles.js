document.addEventListener('DOMContentLoaded', function() {
  const profileCards = document.querySelectorAll('.profile-card, .profile-card-fullscreen');
  const profilesFullscreen = document.getElementById('profilesFullscreen');
  const dashboard = document.getElementById('dashboard');
  const header = document.getElementById('header');
  const chatbotSection = document.getElementById('chatbotSection');
  let currentProfile = null;
  const defaultLayouts = {
    student: [
      {id: 'my-cursus', title: 'My Cursus', icon: 'fas fa-graduation-cap', color: null, visible: true},
      {id: 'announcements', title: 'Announcements', icon: 'fas fa-bullhorn', color: null, visible: true},
      {id: 'schedule', title: 'Emploi du Temps', icon: 'fas fa-calendar-alt', color: null, visible: true},
      {id: 'virtual-library', title: 'Virtual Library', icon: 'fas fa-book', color: null, visible: true},
      {id: 'grades', title: 'Grades', icon: 'fas fa-chart-bar', color: null, visible: true},
      {id: 'assignments', title: 'Assignments', icon: 'fas fa-tasks', color: null, visible: true}
    ],
    teacher: [
      {id: 'my-classes', title: 'My Classes', icon: 'fas fa-chalkboard-teacher', color: null, visible: true},
      {id: 'lesson-plans', title: 'Lesson Plans', icon: 'fas fa-book-open', color: null, visible: true},
      {id: 'gradebook', title: 'Gradebook', icon: 'fas fa-clipboard-list', color: null, visible: true},
      {id: 'student-progress', title: 'Student Progress', icon: 'fas fa-chart-line', color: null, visible: true}
    ],
    ats: [
      {id: 'profile', title: 'Mon Profil', icon: 'fas fa-user-graduate', color: null, visible: true},
      {id: 'wifi', title: 'Compte WiFi', icon: 'fas fa-wifi', color: null, visible: true},
      {id: 'stage', title: 'Stage de Perfectionnement', icon: 'fas fa-briefcase', color: null, visible: true},
      {id: 'prime', title: 'Prime de Rendement', icon: 'fas fa-award', color: null, visible: true}
    ],
    doctoral: [
      {id: 'dashboard', title: 'Dashboard', icon: 'fas fa-tachometer-alt', color: null, visible: true},
      {id: 'research', title: 'Research', icon: 'fas fa-microscope', color: null, visible: true},
      {id: 'stages', title: 'Internships', icon: 'fas fa-briefcase', color: null, visible: true},
      {id: 'library', title: 'Virtual Library', icon: 'fas fa-book', color: null, visible: true},
      {id: 'technique', title: 'Engineering Techniques', icon: 'fas fa-tools', color: null, visible: true},
      {id: 'profile', title: 'My Profile', icon: 'fas fa-user', color: null, visible: true}
    ]
  };
  function getCurrentLayout(profile) {
    const storedLayout = localStorage.getItem(`${profile}_layout`);
    if (storedLayout) {
      try {
        return JSON.parse(storedLayout);
      } catch (e) {
        console.error('Error parsing stored layout:', e);
      }
    }
    return {
      cards: defaultLayouts[profile] || [],
      deletedCards: []
    };
  }
  function saveLayout(profile, layout) {
    localStorage.setItem(`${profile}_layout`, JSON.stringify(layout));
  }
  profileCards.forEach(card => {
    card.addEventListener('click', function() {
      const profileType = this.getAttribute('data-profile');
      console.log('Profile clicked:', profileType);
      currentProfile = profileType;
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
        profilesFullscreen.classList.add('hidden');
        dashboard.classList.add('active');
        header.classList.add('compact');
        chatbotSection.classList.add('active');
        initializeChat(profileType);
      }, 200);
    });
    card.addEventListener('mouseenter', function() {
      this.classList.add('hovered');
    });
    card.addEventListener('mouseleave', function() {
      this.classList.remove('hovered');
    });
  });
  function initializeChat(profileType) {
    chatbotSection.innerHTML = '';
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-header';
    const iconMap = {
      'student': '🎓',
      'teacher': '👨‍🏫',
      'ats': '⚙️',
      'doctoral': '🔬'
    };
    const titleMap = {
      'student': 'Student Dashboard AI',
      'teacher': 'Teacher Dashboard AI',
      'ats': 'Technical Support AI',
      'doctoral': 'Doctoral Research AI'
    };
    chatHeader.innerHTML = `
      <div class="chat-title">
        <div class="chat-title-icon">${iconMap[profileType]}</div>
        <div class="chat-title-text">${titleMap[profileType]}</div>
      </div>
      <div class="chat-buttons">
        <button class="back-btn" id="backBtn">←</button>
        <button class="close-chat" id="closeChat">×</button>
      </div>
    `;
    const chatMessages = document.createElement('div');
    chatMessages.className = 'chat-messages';
    chatMessages.innerHTML = `
      <div class="message bot">
        <div class="message-avatar">${iconMap[profileType]}</div>
        <div class="message-content">
          Hello! I'm your ${titleMap[profileType]} assistant. How can I help you customize your dashboard? Say "show layout" to see your current dashboard cards.
        </div>
      </div>
    `;
    const chatInput = document.createElement('div');
    chatInput.className = 'chat-input';
    chatInput.innerHTML = `
      <input type="text" class="input-field" id="messageInput" placeholder="Type your message..." autocomplete="off">
      <button class="send-btn" id="sendMessage">→</button>
    `;
    chatbotSection.appendChild(chatHeader);
    chatbotSection.appendChild(chatMessages);
    chatbotSection.appendChild(chatInput);
    document.getElementById('backBtn').addEventListener('click', function() {
      profilesFullscreen.classList.remove('hidden');
      dashboard.classList.remove('active');
      header.classList.remove('compact');
      chatbotSection.classList.remove('active');
    });
    document.getElementById('closeChat').addEventListener('click', function() {
      profilesFullscreen.classList.remove('hidden');
      dashboard.classList.remove('active');
      header.classList.remove('compact');
      chatbotSection.classList.remove('active');
    });
    document.getElementById('sendMessage').addEventListener('click', sendMessage);
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    if (!message) return;
    const chatMessages = document.querySelector('.chat-messages');
    const iconMap = {
      'student': '🎓',
      'teacher': '👨‍🏫',
      'ats': '⚙️',
      'doctoral': '🔬'
    };
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'message user';
    userMessageDiv.innerHTML = `
      <div class="message-avatar">👤</div>
      <div class="message-content">${message}</div>
    `;
    chatMessages.appendChild(userMessageDiv);
    messageInput.value = '';
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot';
    loadingDiv.innerHTML = `
      <div class="message-avatar">${iconMap[currentProfile]}</div>
      <div class="message-content">
        <div class="loading">
          Thinking<span class="loading-dots"></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (message.toLowerCase() === 'show layout') {
      processLocalCommand(message, loadingDiv, chatMessages, iconMap);
      return;
    }
    const currentLayout = getCurrentLayout(currentProfile);
    fetch('http://localhost:5000/admin-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        profile: currentProfile,
        current_layout: currentLayout
      })
    })
    .then(response => response.json())
    .then(data => {
      chatMessages.removeChild(loadingDiv);
      processResponse(data, chatMessages, iconMap);
    })
    .catch(error => {
      console.error('Error:', error);
      processLocalCommand(message, loadingDiv, chatMessages, iconMap);
    });
  }
  function processLocalCommand(message, loadingDiv, chatMessages, iconMap) {
    const currentLayout = getCurrentLayout(currentProfile);
    const msgLower = message.toLowerCase();
    let responseText = '';
    chatMessages.removeChild(loadingDiv);

    if (msgLower === 'show layout') {
      if (currentLayout.cards.length === 0) {
        responseText = `Your ${currentProfile} dashboard is currently empty. You can add cards using commands like 'Add new [card name]'.`;
      } else {
        let cardList = currentLayout.cards
          .filter(card => card.visible)
          .map((card, i) => {
            const colorInfo = card.color ? ` (Color: ${card.color})` : '';
            const iconInfo = ` [${card.icon}]`;
            return `${i + 1}. ${card.title}${colorInfo}${iconInfo}`;
          })
          .join('\n');
        responseText = `Current ${currentProfile} Dashboard Layout:\n\n${cardList}\n\nTotal: ${currentLayout.cards.filter(card => card.visible).length} cards`;
      }
    } else if (msgLower.startsWith('add ')) {
      const cardName = message.substring(4).trim();
      const newCard = {
        id: cardName.toLowerCase().replace(/\s+/g, '-'),
        title: cardName,
        icon: detectIconType(cardName),
        color: null,
        visible: true
      };
      currentLayout.cards.push(newCard);
      saveLayout(currentProfile, currentLayout);
      updateDashboardHTML(currentProfile, currentLayout);
      responseText = `Adding '${cardName}' card to your ${currentProfile} dashboard.`;
    } else if (msgLower.match(/^(delete|remove)\s+/)) {
      const cardName = message.replace(/^(delete|remove)\s+/, '').trim();
      const cardIndex = currentLayout.cards.findIndex(
        card => card.title.toLowerCase() === cardName.toLowerCase()
      );
      if (cardIndex >= 0) {
        const removedCard = currentLayout.cards.splice(cardIndex, 1)[0];
        currentLayout.deletedCards.push(removedCard);
        saveLayout(currentProfile, currentLayout);
        updateDashboardHTML(currentProfile, currentLayout);
        responseText = `Removing '${cardName}' from your ${currentProfile} dashboard.`;
      } else {
        responseText = `I couldn't find '${cardName}' in your ${currentProfile} dashboard. Use 'show layout' to see available cards.`;
      }
    } else if (msgLower.match(/^swap\s+.+\s+and\s+.+$/)) {
      const [, item1, item2] = msgLower.match(/^swap\s+(.+?)\s+and\s+(.+)$/);
      const index1 = currentLayout.cards.findIndex(
        card => card.title.toLowerCase() === item1.trim()
      );
      const index2 = currentLayout.cards.findIndex(
        card => card.title.toLowerCase() === item2.trim()
      );
      if (index1 >= 0 && index2 >= 0) {
        [currentLayout.cards[index1], currentLayout.cards[index2]] = 
          [currentLayout.cards[index2], currentLayout.cards[index1]];
        saveLayout(currentProfile, currentLayout);
        updateDashboardHTML(currentProfile, currentLayout);
        responseText = `Swapping positions of '${item1.trim()}' and '${item2.trim()}' in your ${currentProfile} dashboard.`;
      } else {
        const missing = [];
        if (index1 < 0) missing.push(item1.trim());
        if (index2 < 0) missing.push(item2.trim());
        responseText = `I couldn't find ${missing.join(' and ')} in your ${currentProfile} dashboard. Use 'show layout' to see available cards.`;
      }
    } else {
      responseText = `I'm sorry, but I don't understand that command. Try "show layout", "add [card name]", "remove [card name]", or "swap [card1] and [card2]".`;
    }

    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'message bot';
    botMessageDiv.innerHTML = `
      <div class="message-avatar">${iconMap[currentProfile]}</div>
      <div class="message-content">${responseText}</div>
    `;
    chatMessages.appendChild(botMessageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function detectIconType(cardName) {
    const iconMap = {
      'dashboard': 'fas fa-tachometer-alt',
      'research': 'fas fa-microscope',
      'internship': 'fas fa-briefcase',
      'stages': 'fas fa-briefcase',
      'library': 'fas fa-book',
      'technique': 'fas fa-tools',
      'engineering': 'fas fa-tools',
      'profile': 'fas fa-user',
      'default': 'fas fa-cube'
    };

    const nameLower = cardName.toLowerCase();
    for (const [key, value] of Object.entries(iconMap)) {
      if (nameLower.includes(key)) {
        return value;
      }
    }
    return iconMap.default;
  }
  function processResponse(data, chatMessages, iconMap) {
    const botMessageDiv = document.createElement('div');
    botMessageDiv.className = 'message bot';
    botMessageDiv.innerHTML = `
      <div class="message-avatar">${iconMap[currentProfile]}</div>
      <div class="message-content">${data.message}</div>
    `;
    chatMessages.appendChild(botMessageDiv);
    
    if (data.action) {
      const currentLayout = getCurrentLayout(currentProfile);
      
      switch (data.action) {
        case 'add_element':
          currentLayout.cards.push(data.element);
          saveLayout(currentProfile, currentLayout);
          if (data.trigger_update) {
            localStorage.setItem('dashboard_update_trigger', JSON.stringify({
              action: 'add_element',
              element: data.element,
              profile: currentProfile
            }));
          }
          break;
          
        case 'delete_element':
          const cardIndex = currentLayout.cards.findIndex(
            card => card.title.toLowerCase() === data.element.toLowerCase()
          );
          if (cardIndex >= 0) {
            const removedCard = currentLayout.cards.splice(cardIndex, 1)[0];
            currentLayout.deletedCards.push(removedCard);
            saveLayout(currentProfile, currentLayout);
            if (data.trigger_update) {
              localStorage.setItem('dashboard_update_trigger', JSON.stringify({
                action: 'delete_element',
                element: data.element,
                profile: currentProfile
              }));
            }
          }
          break;
          
        case 'show_layout':
          break;
          
        case 'reset_layout':
          currentLayout.cards = defaultLayouts[currentProfile] || [];
          currentLayout.deletedCards = [];
          saveLayout(currentProfile, currentLayout);
          if (data.trigger_update) {
            localStorage.setItem('dashboard_update_trigger', JSON.stringify({
              action: 'reset_layout',
              layout: currentLayout,
              profile: currentProfile
            }));
          }
          break;
      }
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  function updateDashboardHTML(profile, layout) {
    localStorage.setItem('dashboard_update_trigger', JSON.stringify({
      profile: profile,
      timestamp: new Date().getTime(),
      layout: layout
    }));
  }
  function initializeLayouts() {
    Object.keys(defaultLayouts).forEach(profile => {
      localStorage.removeItem(`${profile}_layout`);
      saveLayout(profile, {
        cards: defaultLayouts[profile],
        deletedCards: []
      });
    });
  }
  initializeLayouts();
  console.log('Profile navigation and dashboard management initialized!');
});
