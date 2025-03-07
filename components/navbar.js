
document.addEventListener('DOMContentLoaded', function() {
  // Load the navbar component
  fetch('components/navbar.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('navbar-container').innerHTML = html;
      
      // Initialize navbar functionality after loading
      const menuToggle = document.getElementById('menuToggle');
      const navLinks = document.querySelector('.nav-links');
      
      if (menuToggle) {
        menuToggle.addEventListener('click', function() {
          navLinks.classList.toggle('open');
        });
      }
      
      // Add scroll event for navbar styling
      window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
          if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        }
      });
      
      // Handle logout button click
      const logoutButton = document.getElementById('logoutButton');
      if (logoutButton) {
        logoutButton.addEventListener('click', function() {
          // Implement logout functionality
          window.location.href = 'index.html';
        });
      }
    })
    .catch(error => {
      console.error('Error loading navbar component:', error);
    });
});
