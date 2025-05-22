// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements when they come into view
    initAnimations();
    
    // Initialize progress bars
    initProgressBars();
    
    // Add event listeners
    setupEventListeners();
  });
  
  // Initialize animations for elements
  function initAnimations() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.dashboard section');
    sections.forEach((section, index) => {
      section.classList.add('fade-in');
      section.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add slide-up animation to announcements and events
    const animatedItems = document.querySelectorAll('.announcement-item, .event-item');
    animatedItems.forEach((item, index) => {
      item.classList.add('slide-up');
      item.style.animationDelay = `${0.3 + (index * 0.1)}s`;
    });
  }
  
  // Initialize progress bars with values
  function initProgressBars() {
    const progressItems = document.querySelectorAll('.progress-item');
    
    progressItems.forEach(item => {
      const percentage = item.querySelector('.progress-percentage').textContent;
      const progressValue = item.querySelector('.progress-value');
      
      // Initially set width to 0
      progressValue.style.width = '0%';
      
      // Animate to actual percentage after a delay
      setTimeout(() => {
        progressValue.style.width = percentage;
      }, 500);
    });
  }
  
  // Set up event listeners for interactive elements
  function setupEventListeners() {
    // Mobile sidebar toggle
    const sidebarToggleBtn = document.createElement('button');
    sidebarToggleBtn.className = 'sidebar-toggle-btn';
    sidebarToggleBtn.innerHTML = '<i class="icon-menu"></i>';
    document.querySelector('.top-header').prepend(sidebarToggleBtn);
    
    sidebarToggleBtn.addEventListener('click', function() {
      document.querySelector('.sidebar').classList.toggle('expanded');
    });
    
    // Notification button popup
    const notificationBtn = document.querySelector('.notification-button');
    if (notificationBtn) {
      notificationBtn.addEventListener('click', function() {
        alert('You have no new notifications.');
      });
    }
    
    // Search functionality
    const searchForm = document.querySelector('.search-container');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchValue = document.querySelector('.search-input').value;
        if (searchValue.trim() !== '') {
          alert(`Searching for: ${searchValue}`);
        }
      });
    }
    
    // Hover effects for icon cards
    const iconCards = document.querySelectorAll('.icon-card');
    iconCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.querySelector('.icon-container').classList.add('pulse');
      });
      
      card.addEventListener('mouseleave', function() {
        this.querySelector('.icon-container').classList.remove('pulse');
      });
    });
    
    // Enable smooth scrolling for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }
  
  // Add Font Awesome icon class support
  function loadIcons() {
    // Create a mapping for icon class names
    const iconMap = {
      'icon-home': 'fas fa-home',
      'icon-book': 'fas fa-book',
      'icon-briefcase': 'fas fa-briefcase',
      'icon-announcement': 'fas fa-bullhorn',
      'icon-calendar': 'fas fa-calendar-alt',
      'icon-users': 'fas fa-users',
      'icon-file': 'fas fa-file-alt',
      'icon-settings': 'fas fa-cog',
      'icon-menu': 'fas fa-bars'
    };
    
    // Replace all custom icon classes with Font Awesome classes
    document.querySelectorAll('[class*="icon-"]').forEach(element => {
      for (const [customClass, faClass] of Object.entries(iconMap)) {
        if (element.classList.contains(customClass)) {
          element.classList.remove(customClass);
          const classArray = faClass.split(' ');
          element.classList.add(...classArray);
        }
      }
    });
  }
  
  // Append Font Awesome CDN if not already present
  function appendFontAwesome() {
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesomeLink = document.createElement('link');
      fontAwesomeLink.rel = 'stylesheet';
      fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
      document.head.appendChild(fontAwesomeLink);
      
      // Load icons after Font Awesome is loaded
      fontAwesomeLink.onload = loadIcons;
    } else {
      loadIcons();
    }
  }
  
  // Call Font Awesome initialization
  appendFontAwesome();