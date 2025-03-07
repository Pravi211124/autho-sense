
document.addEventListener('DOMContentLoaded', function() {
  // Load the sidebar component
  fetch('components/sidebar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('sidebar-container').innerHTML = html;
      
      // Initialize sidebar tab functionality after loading
      const sidebarLinks = document.querySelectorAll('.sidebar-menu a[data-tab]');
      
      sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Remove active class from all sidebar links
          sidebarLinks.forEach(item => {
            item.parentElement.classList.remove('active');
          });
          
          // Add active class to clicked link
          this.parentElement.classList.add('active');
          
          // Hide all content tabs
          document.getElementById('home-content').style.display = 'none';
          document.getElementById('user-log-content').style.display = 'none';
          document.getElementById('settings-tab').style.display = 'none';
          
          // Show the selected tab
          const tabId = this.getAttribute('data-tab');
          if (tabId === 'home-tab') {
            document.getElementById('home-content').style.display = 'block';
          } else if (tabId === 'user-log-tab') {
            document.getElementById('user-log-content').style.display = 'block';
          } else if (tabId === 'settings-tab') {
            document.getElementById('settings-tab').style.display = 'block';
          }
        });
      });
      
      // Handle auto logout sidebar link
      const autoLogoutLink = document.getElementById('sidebar-auto-logout');
      if (autoLogoutLink) {
        autoLogoutLink.addEventListener('click', function(e) {
          e.preventDefault();
          // Trigger manual logout
          window.location.href = 'index.html';
        });
      }
    })
    .catch(error => {
      console.error('Error loading sidebar component:', error);
    });
});
