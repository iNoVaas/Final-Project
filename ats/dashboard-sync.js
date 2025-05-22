
document.addEventListener('DOMContentLoaded', function() {
  console.log('ATS dashboard sync initialized');
  const layout = getCurrentLayout('ats');
  
  applyLayoutToDashboard(layout);
  
  window.addEventListener('storage', function(e) {
    if (e.key === 'dashboard_update_trigger') {
      try {
        const data = JSON.parse(e.newValue);
        
        if (data.profile === 'ats') {
          console.log('Received ATS dashboard update:', data);
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
        {id: 'profile', title: 'Mon Profil', icon: 'fas fa-user-graduate', color: null, visible: true},
        {id: 'wifi', title: 'Compte WiFi', icon: 'fas fa-wifi', color: null, visible: true},
        {id: 'stage', title: 'Stage de Perfectionnement', icon: 'fas fa-briefcase', color: null, visible: true},
        {id: 'prime', title: 'Prime de Rendement', icon: 'fas fa-award', color: null, visible: true}
      ], 
      deletedCards: [] 
    };
  }
  
  function applyLayoutToDashboard(layout) {
    if (!layout || !layout.cards) return;
    
    const cardsContainer = document.querySelector('.cards-container');
    
    if (!cardsContainer) {
      console.warn('Could not find cards-container in the dashboard');
      return;
    }
    
    const existingCards = Array.from(cardsContainer.children);
    
    cardsContainer.innerHTML = '';
    
    layout.cards.forEach(card => {
      if (!card.visible) return;
      
      const existingCard = existingCards.find(el => {
        const title = el.querySelector('.card-info h3')?.textContent.trim();
        return el.getAttribute('data-card-id') === card.id || title === card.title;
      });
      
      if (existingCard) {
        if (card.color) {
          existingCard.style.backgroundColor = card.color;
          existingCard.classList.add('custom-colored');
        } else {
          existingCard.style.backgroundColor = '';
          existingCard.classList.remove('custom-colored');
        }
        
        cardsContainer.appendChild(existingCard);
      } else {
        const newCard = createNewCard(card);
        cardsContainer.appendChild(newCard);
      }
    });
  }
  
  function createNewCard(card) {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.setAttribute('data-card-id', card.id);
    
    if (card.color) {
      cardElement.style.backgroundColor = card.color;
      cardElement.classList.add('custom-colored');
    }
    
    if (card.color) {
      cardElement.style.setProperty('--card-accent-color', card.color);
    }
    
    const iconClass = card.icon || 'fas fa-cube';
    
    let description = 'Description...';
    
    switch(card.id) {
      case 'profile':
        description = 'Informations personnelles et académiques';
        break;
      case 'wifi':
        description = 'Statut: <span class="status-active">Actif</span>';
        break;
      case 'stage':
        description = 'Date limite: <span class="highlight">15 Mai 2025</span>';
        break;
      case 'prime':
        description = 'Éligibilité: <span class="status-pending">En attente</span>';
        break;
      default:
        description = 'Information complémentaire';
        break;
    }
    
    let linkText = 'Voir détails';
    
    switch(card.id) {
      case 'wifi':
        linkText = 'Gérer';
        break;
      case 'stage':
        linkText = 'Postuler';
        break;
      case 'prime':
        linkText = 'Vérifier';
        break;
      default:
        linkText = 'Voir détails';
        break;
    }
    
    cardElement.innerHTML = `
      <div class="card-icon">
        <i class="${iconClass}"></i>
      </div>
      <div class="card-info">
        <h3>${card.title}</h3>
        <p>${description}</p>
      </div>
      <a href="#${card.id}" class="card-link">${linkText} <i class="fas fa-arrow-right"></i></a>
    `;
    
    return cardElement;
  }
}); 