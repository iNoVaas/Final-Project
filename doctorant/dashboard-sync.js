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
        {id: 'dashboard', title: 'Dashboard', icon: 'fas fa-tachometer-alt', color: null, visible: true},
        {id: 'research', title: 'Research', icon: 'fas fa-microscope', color: null, visible: true},
        {id: 'stages', title: 'Internships', icon: 'fas fa-briefcase', color: null, visible: true},
        {id: 'library', title: 'Virtual Library', icon: 'fas fa-book', color: null, visible: true},
        {id: 'technique', title: 'Engineering Techniques', icon: 'fas fa-tools', color: null, visible: true},
        {id: 'profile', title: 'My Profile', icon: 'fas fa-user', color: null, visible: true}
      ],
      deletedCards: []
    };
  }
  
  function applyLayoutToDashboard(layout) {
    if (!layout || !layout.cards) return;
    
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
      navMenu.innerHTML = '';
      
      layout.cards.forEach(card => {
        if (!card.visible) return;
        
        const navItem = document.createElement('li');
        navItem.className = 'nav-item';
        navItem.innerHTML = `
          <a href="#${card.id}" class="nav-link">
            <i class="${card.icon}"></i>
            ${card.title}
          </a>
        `;
        navMenu.appendChild(navItem);
      });
    }

    layout.cards.forEach(card => {
      const section = document.getElementById(card.id);
      if (section) {
        if (card.visible) {
          section.style.display = '';
          if (card.color) {
            section.style.backgroundColor = card.color;
          }
        } else {
          section.style.display = 'none';
        }
      }
    });

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer && layout.cards.find(card => card.id === 'dashboard' && card.visible)) {
      statsContainer.style.display = '';
    }

    const stagesContainer = document.querySelector('.stages-container');
    if (stagesContainer && layout.cards.find(card => card.id === 'stages' && card.visible)) {
      stagesContainer.style.display = '';
    }

    const libraryCategories = document.querySelector('.library-categories');
    if (libraryCategories && layout.cards.find(card => card.id === 'library' && card.visible)) {
      libraryCategories.style.display = '';
    }

    const techniqueContainer = document.querySelector('.technique-container');
    if (techniqueContainer && layout.cards.find(card => card.id === 'technique' && card.visible)) {
      techniqueContainer.style.display = '';
    }

    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer && layout.cards.find(card => card.id === 'profile' && card.visible)) {
      profileContainer.style.display = '';
    }
  }
});