
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS library if it's loaded
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  
  function handleScroll() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleScroll);
  
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
  }
  
  // Demo button toast
  const demoButton = document.getElementById('demoButton');
  const demoButtonHero = document.getElementById('demoButtonHero');
  const toast = document.getElementById('toast');
  
  function showToast() {
    toast.classList.add('visible');
    
    setTimeout(function() {
      toast.classList.remove('visible');
    }, 3000);
  }
  
  if (demoButton) {
    demoButton.addEventListener('click', showToast);
  }
  
  if (demoButtonHero) {
    demoButtonHero.addEventListener('click', showToast);
  }
  
  // Scroll to top button
  const scrollToTopBtn = document.getElementById('scrollToTop');
  
  function toggleScrollToTopButton() {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }
  
  if (scrollToTopBtn) {
    window.addEventListener('scroll', toggleScrollToTopButton);
    
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Set current year in footer
  const currentYearElements = document.querySelectorAll('#current-year');
  
  currentYearElements.forEach(function(element) {
    element.textContent = new Date().getFullYear();
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      e.preventDefault();
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
});
