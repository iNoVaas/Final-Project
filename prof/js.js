js.js
  // This is a placeholder for JavaScript functionality
        // Basic functionality to demonstrate the concept
        document.addEventListener('DOMContentLoaded', function() {
            // Show only the dashboard section initially
            const sections = document.querySelectorAll('main section');
            sections.forEach(section => {
                if (section.id !== 'dashboard') {
                    section.classList.add('hidden');
                }
            });
            
            // Navigation functionality
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Remove active class from all items
                    navItems.forEach(navItem => navItem.classList.remove('active'));
                    
                    // Add active class to clicked item
                    this.classList.add('active');
                    
                    // Get the target section id from the href attribute
                    const targetId = this.querySelector('a').getAttribute('href').substring(1);
                    
                    // Hide all sections
                    sections.forEach(section => section.classList.add('hidden'));
                    
                    // Show the target section
                    document.getElementById(targetId).classList.remove('hidden');
                });
            });
            
            // Notification toggle
            const notificationIcon = document.querySelector('.notification-icon');
            const notificationPanel = document.querySelector('.notification-panel');
            
            if (notificationIcon && notificationPanel) {
                notificationIcon.addEventListener('click', function() {
                    const isHidden = notificationPanel.style.display === 'none';
                    notificationPanel.style.display = isHidden ? 'block' : 'none';
                });
            }
            
            // Add event to mark notifications as read
            const markReadButtons = document.querySelectorAll('.mark-read-btn');
            markReadButtons.forEach(button => {
                button.addEventListener('click', function() {
                    this.closest('.notification-item').classList.remove('unread');
                });
            });
            
            // Mark all notifications as read
            const markAllReadBtn = document.querySelector('.mark-all-read-btn');
            if (markAllReadBtn) {
                markAllReadBtn.addEventListener('click', function() {
                    document.querySelectorAll('.notification-item').forEach(item => {
                        item.classList.remove('unread');
                    });
                });
            }
            
            // Modal functionality
            const openModalButtons = document.querySelectorAll('.add-event-btn, .add-new-course');
            const closeModalButtons = document.querySelectorAll('.close-modal, .cancel-event-btn, .cancel-course-btn');
            
            openModalButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const targetModal = this.classList.contains('add-event-btn') ? 
                        document.getElementById('new-event-modal') : 
                        document.getElementById('new-course-modal');
                    
                    if (targetModal) {
                        targetModal.style.display = 'block';
                    }
                });
            });
            
            closeModalButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const modal = this.closest('.modal');
                    if (modal) {
                        modal.style.display = 'none';
                    }
                });
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', function(event) {
                const modals = document.querySelectorAll('.modal');
                modals.forEach(modal => {
                    if (event.target === modal) {
                        modal.style.display = 'none';
                    }
                });
            });
        });