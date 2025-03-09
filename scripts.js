
document.addEventListener('DOMContentLoaded', function() {
  // Current year for footer
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Menu toggle functionality
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }

  // Scroll to top functionality
  const scrollToTopButton = document.getElementById('scrollToTop');
  
  if (scrollToTopButton) {
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('visible');
      } else {
        scrollToTopButton.classList.remove('visible');
      }
    });
    
    scrollToTopButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          navLinks.classList.remove('active');
        }
      }
    });
  });

  // Toast notification functionality
  const toast = document.getElementById('toast');
  const demoButton = document.getElementById('demoButton');
  const demoButtonHero = document.getElementById('demoButtonHero');
  
  function showToast() {
    if (toast) {
      toast.classList.add('visible');
      setTimeout(() => {
        toast.classList.remove('visible');
      }, 3000);
    }
  }
  
  if (demoButton) {
    demoButton.addEventListener('click', function(e) {
      showToast();
    });
  }
  
  if (demoButtonHero) {
    demoButtonHero.addEventListener('click', function(e) {
      showToast();
    });
  }

  // Initialize AOS animation library
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100
    });
  }
});
