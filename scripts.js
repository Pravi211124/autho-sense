
// This script handles all interactions on the main landing page

document.addEventListener('DOMContentLoaded', function() {
  // Set current year in the footer
  const currentYearElem = document.getElementById('current-year');
  if (currentYearElem) {
    currentYearElem.textContent = new Date().getFullYear();
  }

  // Demo buttons
  const demoButtonNav = document.getElementById('demoButton');
  const demoButtonHero = document.getElementById('demoButtonHero');
  const toast = document.getElementById('toast');

  // Function to show toast notification
  function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      // Redirect to dashboard after showing toast
      window.location.href = 'dashboard.html';
    }, 2000);
  }

  // Add click event listeners to demo buttons
  if (demoButtonNav) {
    demoButtonNav.addEventListener('click', function(e) {
      e.preventDefault();
      showToast();
    });
  }

  if (demoButtonHero) {
    demoButtonHero.addEventListener('click', function() {
      showToast();
    });
  }

  // Scroll to top functionality
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

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });
  }

  // Initialize AOS library if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
});
