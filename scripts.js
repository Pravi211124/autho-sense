
document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
    });
  }
  
  // Initialize smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
        }
      }
    });
  });
  
  // Handle demo buttons on the index page
  const demoButtons = document.querySelectorAll('.demo-btn');
  
  demoButtons.forEach(button => {
    button.addEventListener('click', function() {
      window.location.href = 'dashboard.html';
    });
  });
  
  // Handle login buttons on the index page
  const loginButtons = document.querySelectorAll('.login-btn');
  
  loginButtons.forEach(button => {
    button.addEventListener('click', function() {
      window.location.href = 'dashboard.html';
    });
  });
  
  // Handle sign up buttons on the index page
  const signupButtons = document.querySelectorAll('.signup-btn');
  
  signupButtons.forEach(button => {
    button.addEventListener('click', function() {
      window.location.href = 'register.html';
    });
  });
  
  // Initialize animations for elements that should animate when they come into view
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  function checkIfInView() {
    animatedElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (elementPosition.top < windowHeight * 0.8) {
        element.classList.add('in-view');
      }
    });
  }
  
  // Check elements on page load
  checkIfInView();
  
  // Check elements on scroll
  window.addEventListener('scroll', checkIfInView);
});
