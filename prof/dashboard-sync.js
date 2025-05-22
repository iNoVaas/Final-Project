document.addEventListener('DOMContentLoaded', function() {
  console.log('Teacher dashboard sync initialized');
  
  const layout = getCurrentLayout('teacher');
  
  applyLayoutToDashboard(layout);
  
  window.addEventListener('storage', function(e) {
    if (e.key === 'dashboard_update_trigger') {
      try {
        const data = JSON.parse(e.newValue);
        
        if (data.profile === 'teacher') {
          console.log('Received teacher dashboard update:', data);
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
        {id: 'my-classes', title: 'My Classes', icon: 'fas fa-chalkboard-teacher', color: null, visible: true},
        {id: 'lesson-plans', title: 'Lesson Plans', icon: 'fas fa-book-open', color: null, visible: true},
        {id: 'gradebook', title: 'Gradebook', icon: 'fas fa-clipboard-list', color: null, visible: true},
        {id: 'student-progress', title: 'Student Progress', icon: 'fas fa-chart-line', color: null, visible: true}
      ], 
      deletedCards: [] 
    };
  }
  
  function applyLayoutToDashboard(layout) {
    if (!layout || !layout.cards) return;
    
    const cardContainer = document.querySelector('.card-container') || 
                          document.querySelector('.course-grid') || 
                          document.querySelector('.dashboard-grid');
    
    if (!cardContainer) {
      console.warn('Could not find card container in the teacher dashboard');
      return;
    }
    
    const existingCards = Array.from(cardContainer.children);
    
    cardContainer.innerHTML = '';
    
    layout.cards.forEach(card => {
      if (!card.visible) return;
      
      const existingCard = existingCards.find(el => {
        return el.getAttribute('data-card-id') === card.id || 
               el.querySelector('.card-title, .course-name')?.textContent.trim() === card.title;
      });
      
      if (existingCard) {
        if (card.color) {
          existingCard.style.backgroundColor = card.color;
          existingCard.classList.add('custom-colored');
        } else {
          existingCard.style.backgroundColor = '';
          existingCard.classList.remove('custom-colored');
        }
        
        cardContainer.appendChild(existingCard);
      } else {
        const newCard = createNewCard(card);
        cardContainer.appendChild(newCard);
      }
    });
  }
  
  function createNewCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'course-card';
    cardElement.setAttribute('data-card-id', card.id);
    
    if (card.color) {
      cardElement.style.backgroundColor = card.color;
      cardElement.classList.add('custom-colored');
    }
    
    const iconClass = card.icon || 'fas fa-book';
    
    cardElement.innerHTML = `
      <div class="course-icon">
        <i class="${iconClass}"></i>
      </div>
      <h3 class="course-name">${card.title}</h3>
      <p class="course-details">Added from AI chat interface</p>
      <a href="#${card.id}" class="course-link">View Details</a>
    `;
    
    return cardElement;
  }
}); 