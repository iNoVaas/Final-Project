document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const topBar = document.querySelector('.top-bar');
    
    // Create hamburger menu for mobile
    const hamburgerMenu = document.createElement('div');
    hamburgerMenu.className = 'hamburger-menu';
    hamburgerMenu.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;
    
    // Create overlay for mobile sidebar
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    
    // Insert hamburger menu in top bar for mobile
    if (window.innerWidth <= 768) {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.appendChild(hamburgerMenu);
        div.appendChild(document.querySelector('.search-box'));
        topBar.insertBefore(div, topBar.firstChild);
    }
    
    // Toggle sidebar on hamburger menu click
    hamburgerMenu.addEventListener('click', function() {
        sidebar.classList.toggle('expanded');
        mainContent.classList.toggle('expanded');
        overlay.style.display = sidebar.classList.contains('expanded') ? 'block' : 'none';
        
        // Animate hamburger menu
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
            this.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            this.children[1].style.opacity = '0';
            this.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            this.children[0].style.transform = 'none';
            this.children[1].style.opacity = '1';
            this.children[2].style.transform = 'none';
        }
    });
    
    // Close sidebar when clicking overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('expanded');
        mainContent.classList.remove('expanded');
        this.style.display = 'none';
        
        if (hamburgerMenu.classList.contains('active')) {
            hamburgerMenu.classList.remove('active');
            hamburgerMenu.children[0].style.transform = 'none';
            hamburgerMenu.children[1].style.opacity = '1';
            hamburgerMenu.children[2].style.transform = 'none';
        }
    });
    
    // Hover effect for sidebar on desktop
    if (window.innerWidth > 768 && window.innerWidth <= 992) {
        sidebar.addEventListener('mouseenter', function() {
            this.classList.add('expanded');
            mainContent.classList.add('expanded');
        });
        
        sidebar.addEventListener('mouseleave', function() {
            this.classList.remove('expanded');
            mainContent.classList.remove('expanded');
        });
    }
    
    // Navigation links active state
    const navLinks = document.querySelectorAll('.nav-links li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(item => {
                item.parentElement.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Close sidebar on mobile after clicking a link
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('expanded');
                overlay.style.display = 'none';
                
                if (hamburgerMenu.classList.contains('active')) {
                    hamburgerMenu.classList.remove('active');
                    hamburgerMenu.children[0].style.transform = 'none';
                    hamburgerMenu.children[1].style.opacity = '1';
                    hamburgerMenu.children[2].style.transform = 'none';
                }
            }
        });
    });
    
    // Add animation classes to elements on page load
    const cards = document.querySelectorAll('.card');
    const resourceItems = document.querySelectorAll('.resource-item');
    const events = document.querySelectorAll('.event');
    
    // Function to add animation with delay
    function addAnimationWithDelay(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in');
            }, index * delay);
        });
    }
    
    // Add animations
    addAnimationWithDelay(cards);
    addAnimationWithDelay(resourceItems, 150);
    addAnimationWithDelay(events, 200);
    
    // Calendar navigation
    const prevBtn = document.querySelector('.calendar-navigation button:first-child');
    const nextBtn = document.querySelector('.calendar-navigation button:last-child');
    const monthDisplay = document.querySelector('.calendar-navigation span');
    
    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    let currentDate = new Date();
    
    function updateCalendar() {
        const month = months[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        monthDisplay.textContent = `${month} ${year}`;
        
        // Here you would typically update the calendar events based on the month
        // This is a placeholder for that functionality
    }
    
    prevBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    
    nextBtn.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
    
    // Notifications dropdown
    const notifications = document.querySelector('.notifications');
    const messages = document.querySelector('.messages');
    const userProfile = document.querySelector('.user');
    
    // Create dropdown for notifications
    function createDropdown(element, content) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.right = '0';
        dropdown.style.width = '300px';
        dropdown.style.background = 'white';
        dropdown.style.borderRadius = '8px';
        dropdown.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        dropdown.style.padding = '1rem';
        dropdown.style.zIndex = '1000';
        dropdown.style.display = 'none';
        dropdown.style.marginTop = '10px';
        dropdown.innerHTML = content;
        
        element.style.position = 'relative';
        element.appendChild(dropdown);
        
        return dropdown;
    }
    
    // Notification dropdown content
    const notificationContent = `
        <h4 style="margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e0e0e0;">Notifications</h4>
        <div class="notification-item" style="padding: 0.7rem 0; border-bottom: 1px solid #f5f5f5;">
            <div style="font-weight: 500; margin-bottom: 3px;">Nouveau Document Disponible</div>
            <div style="font-size: 0.8rem; color: #6c757d;">Il y a 5 minutes</div>
        </div>
        <div class="notification-item" style="padding: 0.7rem 0; border-bottom: 1px solid #f5f5f5;">
            <div style="font-weight: 500; margin-bottom: 3px;">Rappel: Remise du projet</div>
            <div style="font-size: 0.8rem; color: #6c757d;">Il y a 2 heures</div>
        </div>
        <div class="notification-item" style="padding: 0.7rem 0;">
            <div style="font-weight: 500; margin-bottom: 3px;">Note publiée: Mécanique des Fluides</div>
            <div style="font-size: 0.8rem; color: #6c757d;">Hier</div>
        </div>
        <a href="#" style="display: block; text-align: center; margin-top: 1rem; color: var(--primary-color); font-weight: 500;">Voir toutes les notifications</a>
    `;
    
    // Messages dropdown content
    const messagesContent = `
        <h4 style="margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e0e0e0;">Messages</h4>
        <div class="message-item" style="display: flex; padding: 0.7rem 0; border-bottom: 1px solid #f5f5f5;">
            <img src="/api/placeholder/40/40" alt="User" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
            <div>
                <div style="font-weight: 500; margin-bottom: 3px;">Prof. Martin</div>
                <div style="font-size: 0.8rem; color: #6c757d;">Bonjour, pouvez-vous...</div>
            </div>
        </div>
        <div class="message-item" style="display: flex; padding: 0.7rem 0; border-bottom: 1px solid #f5f5f5;">
            <img src="/api/placeholder/40/40" alt="User" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
            <div>
                <div style="font-weight: 500; margin-bottom: 3px;">Sophie Dubois</div>
                <div style="font-size: 0.8rem; color: #6c757d;">À propos du projet...</div>
            </div>
        </div>
        <div class="message-item" style="display: flex; padding: 0.7rem 0;">
            <img src="/api/placeholder/40/40" alt="User" style="width: 40px; height: 40px; border-radius: 50%; margin-right: 10px;">
            <div>
                <div style="font-weight: 500; margin-bottom: 3px;">Thomas Bernard</div>
                <div style="font-size: 0.8rem; color: #6c757d;">Merci pour votre aide...</div>
            </div>
        </div>
        <a href="#" style="display: block; text-align: center; margin-top: 1rem; color: var(--primary-color); font-weight: 500;">Voir tous les messages</a>
    `;
    
    // User profile dropdown content
    const userProfileContent = `
        <div style="text-align: center; padding-bottom: 1rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0;">
            <img src="/api/placeholder/80/80" alt="User Profile" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 1rem;">
            <h4 style="margin-bottom: 0.3rem;">John Doe</h4>
            <p style="font-size: 0.8rem; color: #6c757d;">Étudiant en Ingénierie</p>
        </div>
        <a href="#profile" style="display: flex; align-items: center; padding: 0.7rem 0; color: var(--text-primary); border-bottom: 1px solid #f5f5f5;">
            <i class="fas fa-user" style="width: 20px; margin-right: 10px;"></i>
            Mon Profil
        </a>
        <a href="#settings" style="display: flex; align-items: center; padding: 0.7rem 0; color: var(--text-primary); border-bottom: 1px solid #f5f5f5;">
            <i class="fas fa-cog" style="width: 20px; margin-right: 10px;"></i>
            Paramètres
        </a>
        <a href="#logout" style="display: flex; align-items: center; padding: 0.7rem 0; color: var(--danger-color);">
            <i class="fas fa-sign-out-alt" style="width: 20px; margin-right: 10px;"></i>
            Déconnexion
        </a>
    `;
    
    // Create dropdowns
    const notificationsDropdown = createDropdown(notifications, notificationContent);
    const messagesDropdown = createDropdown(messages, messagesContent);
    const userProfileDropdown = createDropdown(userProfile, userProfileContent);
    
    // Toggle dropdowns
    function setupDropdownToggle(element, dropdown) {
        element.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Close all other dropdowns
            [notificationsDropdown, messagesDropdown, userProfileDropdown].forEach(d => {
                if (d !== dropdown) d.style.display = 'none';
            });
            
            // Toggle current dropdown
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    setupDropdownToggle(notifications, notificationsDropdown);
    setupDropdownToggle(messages, messagesDropdown);
    setupDropdownToggle(userProfile, userProfileDropdown);
    
    // Close dropdowns when clicking elsewhere
    document.addEventListener('click', function() {
        [notificationsDropdown, messagesDropdown, userProfileDropdown].forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    });
    
    // Prevent dropdown from closing when clicking inside
    [notificationsDropdown, messagesDropdown, userProfileDropdown].forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
    
    // Theme Switching (Optional feature)
    // You could add theme selection in settings
    function changeTheme(themeName) {
        document.body.className = themeName; // e.g., theme-blue, theme-green, theme-purple
        localStorage.setItem('theme', themeName);
    }
    
    // Apply saved theme if any
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.className = savedTheme;
    }
    
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 20,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add pulse animation to upcoming deadlines
    const highlightElements = document.querySelectorAll('.highlight');
    highlightElements.forEach(element => {
        element.classList.add('pulse');
    });
    
    // Initialize calendar on page load
    updateCalendar();
    
    // Window resize event handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            overlay.style.display = 'none';
            sidebar.classList.remove('expanded');
            
            if (hamburgerMenu.classList.contains('active')) {
                hamburgerMenu.classList.remove('active');
                hamburgerMenu.children[0].style.transform = 'none';
                hamburgerMenu.children[1].style.opacity = '1';
                hamburgerMenu.children[2].style.transform = 'none';
            }
        }
    });
    
    // Add interactive features to cards
    cards.forEach(card => {
        card.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)'; // Fixed: Direct value instead of var()
        });
        
        card.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.15)'; // Fixed: Direct value instead of var()
        });
    });
    
    // Show welcome message
    console.log('Welcome to University Portal Dashboard!');
});