document.addEventListener('DOMContentLoaded', function() {
  const currentProfile = getCurrentProfile();
  if (!currentProfile) return;
  
  console.log(`Dashboard sync initialized for ${currentProfile} profile`);
  
  const layout = getCurrentLayout(currentProfile);
  applyLayoutToDashboard(layout);
  
  window.addEventListener('storage', function(e) {
    if (e.key === 'dashboard_update_trigger') {
      try {
        const data = JSON.parse(e.newValue);
        if (data.profile === currentProfile) {
          console.log('Received dashboard update:', data);
          applyLayoutToDashboard(data.layout);
        }
      } catch (error) {
        console.error('Error processing dashboard update:', error);
      }
    }
  });
  
  function getCurrentProfile() {
    const path = window.location.pathname.toLowerCase();
    if (path.includes('/etudiant/')) {
      return 'student';
    } else if (path.includes('/prof/')) {
      return 'teacher';
    } else if (path.includes('/ats/')) {
      return 'ats';
    } else if (path.includes('/doctorant/')) {
      return 'doctoral';
    }
    return null;
  }
  
  function getCurrentLayout(profile) {
    const storedLayout = localStorage.getItem(`${profile}_layout`);
    if (storedLayout) {
      try {
        return JSON.parse(storedLayout);
      } catch (e) {
        console.error('Error parsing stored layout:', e);
      }
    }
    return { cards: [], deletedCards: [] };
  }
  
  function applyLayoutToDashboard(layout) {
    if (!layout || !layout.cards) return;
    console.log('Applying layout to dashboard:', layout);
    const cardContainer = document.querySelector('.dashboard-cards') || 
                          document.querySelector('.cards-container') ||
                          document.querySelector('.main-content');
    if (!cardContainer) {
      console.warn('Could not find card container in the dashboard');
      return;
    }
    const existingCards = Array.from(cardContainer.children);
    cardContainer.innerHTML = '';
    layout.cards.forEach(card => {
      if (!card.visible) return;
      const existingCard = existingCards.find(el => {
        return el.getAttribute('data-card-id') === card.id || 
               el.querySelector('.card-title')?.textContent.trim() === card.title;
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
    cardElement.className = 'card-item';
    cardElement.setAttribute('data-card-id', card.id);
    if (card.color) {
      cardElement.style.backgroundColor = card.color;
      cardElement.classList.add('custom-colored');
    }
    const iconClass = card.icon || 'fas fa-cube';
    cardElement.innerHTML = `
      <div class="card-icon">
        <i class="${iconClass}"></i>
      </div>
      <div class="card-title">${card.title}</div>
    `;
    return cardElement;
  }
});
