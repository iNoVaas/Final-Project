document.addEventListener('DOMContentLoaded', function() {
    // Add animation classes to elements when page loads
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('fade-in');
        }, index * 100);
    });

    // Add pulse animation to new notifications
    const newAnnouncements = document.querySelector('.stat-card:nth-child(4)');
    newAnnouncements.classList.add('pulse');

    // Menu highlight for current page
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('.main-menu a');
    menuLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.parentElement.classList.add('active');
        }
    });

    // Logout button functionality
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to logout?')) {
            // In a real implementation, this would redirect to a logout endpoint
            alert('Logout successful');
            window.location.href = 'login.html';
        }
    });

    // Mobile menu toggle functionality
    function setupMobileMenu() {
        if (window.innerWidth <= 768) {
            const menuItems = document.querySelectorAll('.main-menu > li > a');
            menuItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    if (this.nextElementSibling && this.nextElementSibling.classList.contains('submenu')) {
                        e.preventDefault();
                        const submenu = this.nextElementSibling;
                        const isOpen = submenu.style.maxHeight !== '0px' && submenu.style.maxHeight !== '';
                        
                        if (isOpen) {
                            submenu.style.maxHeight = '0px';
                        } else {
                            submenu.style.maxHeight = submenu.scrollHeight + 'px';
                        }
                    }
                });
            });
        }
    }

    setupMobileMenu();
    window.addEventListener('resize', setupMobileMenu);

    // Loading state simulation for demonstration
    function simulateLoading() {
        const main = document.querySelector('main');
        main.style.opacity = '0.6';
        main.style.pointerEvents = 'none';
        
        setTimeout(() => {
            main.style.opacity = '1';
            main.style.pointerEvents = 'all';
        }, 1000);
    }

    // Simulate loading when clicking on navigation items
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent navigation for mobile menu toggles
            if (window.innerWidth <= 768 && this.nextElementSibling && this.nextElementSibling.classList.contains('submenu')) {
                return;
            }
            
            e.preventDefault();
            simulateLoading();
            
            // In a real implementation, this would navigate to the link
            console.log('Navigating to:', this.getAttribute('href'));
        });
    });
});