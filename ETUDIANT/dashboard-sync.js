/**
 * Student Dashboard Sync - Updates dashboard when changes are made via the chat interface
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Student dashboard sync initialized');
  
  // Load existing layout
  const layout = getCurrentLayout('student');
  
  // Apply initial layout if needed
  applyLayoutToDashboard(layout);
  
  // Listen for changes in localStorage
  window.addEventListener('storage', function(e) {
    if (e.key === 'dashboard_update_trigger') {
      try {
        const data = JSON.parse(e.newValue);
        
        // Only apply if this is for the student profile
        if (data.profile === 'student') {
          console.log('Received student dashboard update:', data);
          applyLayoutToDashboard(data.layout);
        }
      } catch (error) {
        console.error('Error processing dashboard update:', error);
      }
    }
  });
  
  function getCurrentLayout(profile) {
    // Try to get layout from localStorage
    const storedLayout = localStorage.getItem(`${profile}_layout`);
    if (storedLayout) {
      try {
        return JSON.parse(storedLayout);
      } catch (e) {
        console.error('Error parsing stored layout:', e);
      }
    }
    
    // Default student layout if none exists
    return { 
      cards: [
        {id: 'my-cursus', title: 'My Cursus', icon: 'fas fa-graduation-cap', color: null, visible: true},
        {id: 'announcements', title: 'Announcements', icon: 'fas fa-bullhorn', color: null, visible: true},
        {id: 'schedule', title: 'Emploi du Temps', icon: 'fas fa-calendar-alt', color: null, visible: true},
        {id: 'virtual-library', title: 'Virtual Library', icon: 'fas fa-book', color: null, visible: true},
        {id: 'grades', title: 'Grades', icon: 'fas fa-chart-bar', color: null, visible: true},
        {id: 'assignments', title: 'Assignments', icon: 'fas fa-tasks', color: null, visible: true}
      ], 
      deletedCards: [] 
    };
  }
  
  function applyLayoutToDashboard(layout) {
    if (!layout || !layout.cards) return;
    
    // For student dashboard, we update the quick-access-grid section
    const gridContainer = document.querySelector('.quick-access-grid');
    
    if (!gridContainer) {
      console.warn('Could not find quick-access-grid in the dashboard');
      return;
    }
    
    // Save existing cards for reference
    const existingCards = Array.from(gridContainer.children);
    
    // Clear the container
    gridContainer.innerHTML = '';
    
    // Add cards in the order from the layout
    layout.cards.forEach(card => {
      if (!card.visible) return;
      
      // Create card with appropriate structure for this dashboard
      const newCard = createNewCard(card);
      gridContainer.appendChild(newCard);
    });
  }
  
  function createNewCard(card) {
    // Create a new card element matching the structure in test.html
    const cardElement = document.createElement('div');
    cardElement.className = 'quick-access-item';
    cardElement.setAttribute('data-card-id', card.id);
    
    if (card.color) {
      cardElement.style.backgroundColor = card.color;
      cardElement.classList.add('custom-colored');
    }
    
    const iconClass = card.icon || 'fas fa-cube';
    
    cardElement.innerHTML = `
      <a href="#${card.id}">
        <div class="icon-container">
          <i class="${iconClass}"></i>
        </div>
        <h3>${card.title}</h3>
      </a>
    `;
    
    return cardElement;
  }
}); 