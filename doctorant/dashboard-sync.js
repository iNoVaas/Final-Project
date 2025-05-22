
document.addEventListener('DOMContentLoaded', function() {
  console.log('Doctoral dashboard sync initialized');
  
  const layout = getCurrentLayout('doctoral');
  
  applyLayoutToDashboard(layout);
  
  window.addEventListener('storage', function(e) {
    if (e.key === 'dashboard_update_trigger') {
      try {
        const data = JSON.parse(e.newValue);
        
        if (data.profile === 'doctoral') {
          console.log('Received doctoral dashboard update:', data);
          applyLayoutToDashboard(data.layout);
        }
      } catch (error) {
        console.error('Error processing dashboard update:', error);
      }
    }
  });
  
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
      cards: [
        {id: 'research-project', title: 'Research Project', icon: 'fas fa-microscope', color: null, visible: true},
        {id: 'literature-review', title: 'Literature Review', icon: 'fas fa-book-reader', color: null, visible: true},
        {id: 'publications', title: 'Publications', icon: 'fas fa-newspaper', color: null, visible: true},
        {id: 'supervisor-meetings', title: 'Supervisor Meetings', icon: 'fas fa-handshake', color: null, visible: true}
      ], 
      deletedCards: [] 
    };
  }
  
  function applyLayoutToDashboard(layout) {
    if (!layout || !layout.cards) return;
    
    const container = document.querySelector('.dashboard-content') || 
                      document.querySelector('.main-container') || 
                      document.querySelector('.research-grid');
    
    if (!container) {
      console.warn('Could not find content container in the doctoral dashboard');
      return;
    }

    let dashboardGrid = container.querySelector('.research-items-grid');
    if (!dashboardGrid) {
      dashboardGrid = document.createElement('div');
      dashboardGrid.className = 'research-items-grid';
      dashboardGrid.style.display = 'grid';
      dashboardGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))';
      dashboardGrid.style.gap = '20px';
      dashboardGrid.style.padding = '20px 0';
      
      container.insertBefore(dashboardGrid, container.firstChild);
    }
    
    const existingCards = Array.from(dashboardGrid.children);
    
    dashboardGrid.innerHTML = '';
    
    layout.cards.forEach(card => {
      if (!card.visible) return;
      
      const existingCard = existingCards.find(el => {
        return el.getAttribute('data-card-id') === card.id || 
               el.querySelector('.item-title, h3')?.textContent.trim() === card.title;
      });
      
      if (existingCard) {
        if (card.color) {
          existingCard.style.backgroundColor = card.color;
          existingCard.classList.add('custom-colored');
        } else {
          existingCard.style.backgroundColor = '';
          existingCard.classList.remove('custom-colored');
        }
        
        dashboardGrid.appendChild(existingCard);
      } else {
        const newCard = createNewCard(card);
        dashboardGrid.appendChild(newCard);
      }
    });
  }
  
  function createNewCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'research-item';
    cardElement.setAttribute('data-card-id', card.id);
    
    cardElement.style.backgroundColor = card.color || '#ffffff';
    cardElement.style.borderRadius = '8px';
    cardElement.style.padding = '20px';
    cardElement.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
    
    const iconClass = card.icon || 'fas fa-flask';
    
    cardElement.innerHTML = `
      <div style="font-size: 2rem; color: #4361ee; margin-bottom: 15px;">
        <i class="${iconClass}"></i>
      </div>
      <h3 class="item-title" style="margin-bottom: 10px;">${card.title}</h3>
      <p style="color: #6c757d; margin-bottom: 15px;">Manage your ${card.title.toLowerCase()}</p>
      <a href="#${card.id}" style="color: #4361ee; text-decoration: none; display: flex; align-items: center;">
        View details <i class="fas fa-chevron-right" style="margin-left: 5px;"></i>
      </a>
    `;
    
    return cardElement;
  }
});