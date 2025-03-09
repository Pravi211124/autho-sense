
document.addEventListener('DOMContentLoaded', function() {
  // Get current year for footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Initialize AOS library if it's loaded
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }

  // Toggle mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Scroll to top button
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  if (scrollToTopBtn) {
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('show');
      } else {
        scrollToTopBtn.classList.remove('show');
      }
    });

    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Demo button functionality
  const demoButtons = document.querySelectorAll('#demoButton, #demoButtonHero');
  const toast = document.getElementById('toast');
  
  demoButtons.forEach(button => {
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Show toast notification
        if (toast) {
          toast.classList.add('show');
          
          // Hide toast after 3 seconds
          setTimeout(function() {
            toast.classList.remove('show');
          }, 3000);
        }
        
        // Redirect to dashboard after a short delay
        setTimeout(function() {
          window.location.href = 'dashboard.html';
        }, 1500);
      });
    }
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    if (!anchor.getAttribute('href').includes('tab')) {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    }
  });
});
