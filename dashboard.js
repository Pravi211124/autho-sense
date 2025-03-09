
document.addEventListener('DOMContentLoaded', function() {
  // Load components
  loadComponent('navbar-container', 'components/navbar.html');
  loadComponent('sidebar-container', 'components/sidebar.html');
  loadComponent('dashboard-header-container', 'components/dashboard-header.html');
  loadComponent('home-tab-container', 'components/home-tab.html');
  loadComponent('user-log-tab-container', 'components/user-log-tab.html');
  loadComponent('settings-tab-container', 'components/settings-tab.html');
  loadComponent('footer-container', 'components/footer.html');
  
  // Initialize date and time display
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Initialize tabs
  setTimeout(initializeTabs, 500);
  
  // Initialize login and forgot password modals
  setTimeout(initializeModals, 500);
  
  // Initialize Auto Logout functionality
  setTimeout(initializeAutoLogout, 1000);
});

// Helper function to load HTML components
function loadComponent(containerId, componentUrl) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  fetch(componentUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load component: ${componentUrl}`);
      }
      return response.text();
    })
    .then(html => {
      container.innerHTML = html;
      
      // Initialize component-specific script if it exists
      const scriptSrc = componentUrl.replace('.html', '.js');
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.onload = function() {
        console.log(`Loaded script: ${scriptSrc}`);
      };
      script.onerror = function() {
        console.warn(`Script not found or error loading: ${scriptSrc}`);
      };
      document.body.appendChild(script);
    })
    .catch(error => {
      console.error(`Error loading ${componentUrl}:`, error);
      container.innerHTML = `<div class="error-message">Failed to load component: ${componentUrl}</div>`;
    });
}

// Update date and time display
function updateDateTime() {
  const dateElement = document.getElementById('current-date');
  const timeElement = document.getElementById('current-time');
  
  if (dateElement && timeElement) {
    const now = new Date();
    
    // Format date: e.g., "Monday, January 1, 2023"
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time: e.g., "3:45 PM"
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
  }
}

// Initialize tab functionality
function initializeTabs() {
  const tabLinks = document.querySelectorAll('[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetTab = this.getAttribute('data-tab');
      
      // Update active tab in navbar
      document.querySelectorAll('.nav-links a').forEach(navLink => {
        navLink.classList.remove('active');
        if (navLink.getAttribute('data-tab') === targetTab) {
          navLink.classList.add('active');
        }
      });
      
      // Update active tab in sidebar
      document.querySelectorAll('.sidebar-menu li').forEach(sidebarItem => {
        sidebarItem.classList.remove('active');
        const sidebarLink = sidebarItem.querySelector('a');
        if (sidebarLink && sidebarLink.getAttribute('data-tab') === targetTab) {
          sidebarItem.classList.add('active');
        }
      });
      
      // Show the selected tab content
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === targetTab + '-container') {
          content.classList.add('active');
        }
      });
    });
  });
  
  // Handle sidebar auto-logout button
  const sidebarAutoLogoutBtn = document.getElementById('sidebar-auto-logout');
  if (sidebarAutoLogoutBtn) {
    sidebarAutoLogoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Trigger manual logout
      if (window.AutoLogout && typeof window.AutoLogout.logoutNow === 'function') {
        window.AutoLogout.logoutNow();
      } else {
        alert('Auto Logout functionality not initialized yet.');
      }
    });
  }
  
  // Handle website monitoring button in dashboard header
  setTimeout(() => {
    const monitoringBtn = document.getElementById('websiteMonitoring');
    if (monitoringBtn) {
      monitoringBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Trigger click on the monitoring tab link in the sidebar
        const monitoringTabLink = document.querySelector('.sidebar-menu a[data-tab="monitoring-tab"]');
        if (monitoringTabLink) {
          monitoringTabLink.click();
        }
      });
    }
  }, 1000);
}

// Initialize login and forgot password modals
function initializeModals() {
  // Get modal elements
  const loginModal = document.getElementById('loginModal');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const loginButton = document.getElementById('loginButton');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const backToLoginBtn = document.getElementById('backToLoginBtn');
  const closeModalButtons = document.querySelectorAll('.close-modal');
  
  // Open login modal
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      if (loginModal) {
        loginModal.style.display = 'flex';
      }
    });
  }
  
  // Switch to forgot password modal
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (loginModal && forgotPasswordModal) {
        loginModal.style.display = 'none';
        forgotPasswordModal.style.display = 'flex';
      }
    });
  }
  
  // Forgot password link in navbar
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      if (forgotPasswordModal) {
        forgotPasswordModal.style.display = 'flex';
      }
    });
  }
  
  // Back to login button
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (loginModal && forgotPasswordModal) {
        forgotPasswordModal.style.display = 'none';
        loginModal.style.display = 'flex';
      }
    });
  }
  
  // Close modal buttons
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
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
  
  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Simple validation
      if (email && password) {
        // In a real app, this would authenticate with a server
        alert(`Successfully logged in as ${email}`);
        if (loginModal) {
          loginModal.style.display = 'none';
        }
      } else {
        alert('Please enter both email and password');
      }
    });
  }
  
  // Handle forgot password form submission
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('resetEmail').value;
      
      // Simple validation
      if (email) {
        // In a real app, this would send a reset link
        alert(`Password reset link sent to ${email}`);
        if (forgotPasswordModal) {
          forgotPasswordModal.style.display = 'none';
        }
      } else {
        alert('Please enter your email address');
      }
    });
  }
}

// Initialize Auto Logout functionality
function initializeAutoLogout() {
  // Check if AutoLogout.js is loaded
  if (window.AutoLogout) {
    console.log('Auto Logout functionality initialized');
  } else {
    console.warn('AutoLogout.js not loaded properly');
    
    // Fallback: add the script manually
    const script = document.createElement('script');
    script.src = 'AutoLogout.js';
    document.body.appendChild(script);
  }
}
