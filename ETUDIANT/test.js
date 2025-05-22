test.js
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebar = document.getElementById('sidebar');
    
    // Toggle sidebar when hamburger menu is clicked
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            if (sidebar) {
                sidebar.classList.toggle('active');
                console.log('Sidebar toggled');
            }
        });
    }
    
    // Close sidebar when close button is clicked
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function() {
            if (sidebar) {
                sidebar.classList.remove('active');
                console.log('Sidebar closed');
            }
        });
    }
    
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024 && sidebar) {
            sidebar.classList.add('active');
        } else if (window.innerWidth < 1024 && sidebar) {
            sidebar.classList.remove('active');
        }
    });

    if (window.innerWidth >= 1024 && sidebar) {
        sidebar.classList.add('active');
        console.log('Sidebar activated on load (desktop)');
    }
});