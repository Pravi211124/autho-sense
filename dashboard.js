
document.addEventListener('DOMContentLoaded', function() {
  // Load all components
  loadComponent('navbar-container', 'components/navbar.html', initNavbar);
  loadComponent('sidebar-container', 'components/sidebar.html', initSidebar);
  loadComponent('dashboard-header-container', 'components/dashboard-header.html');
  loadComponent('home-tab-container', 'components/home-tab.html', initHomeTab);
  loadComponent('user-log-tab-container', 'components/user-log-tab.html', initUserLogTab);
  loadComponent('settings-tab-container', 'components/settings-tab.html', initSettingsTab);
  loadComponent('monitoring-tab-container', 'components/monitoring-tab.html', initMonitoringTab);
  loadComponent('footer-container', 'components/footer.html');

  // Initialize auto-logout functionality
  initAutoLogout();

  // Function to load component HTML
  function loadComponent(containerId, componentPath, callback) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container ${containerId} not found`);
      return;
    }

    fetch(componentPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load ${componentPath}: ${response.status} ${response.statusText}`);
        }
        return response.text();
      })
      .then(html => {
        container.innerHTML = html;
        if (callback && typeof callback === 'function') {
          callback();
        }
      })
      .catch(error => {
        console.error('Error loading component:', error);
        container.innerHTML = `<div class="error-message">Failed to load component. ${error.message}</div>`;
      });
  }

  // Tab switching functionality
  function initTabSwitching() {
    const tabLinks = document.querySelectorAll('[data-tab]');
    tabLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.getAttribute('data-tab');
        switchTab(tabId);
      });
    });
  }

  function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // Show the selected tab content
    const selectedTab = document.getElementById(`${tabId}-container`);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }
    
    // Update active state in navbar
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
      }
    });
    
    // Update active state in sidebar
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
      item.classList.remove('active');
      const itemLink = item.querySelector('a');
      if (itemLink && itemLink.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      }
    });
  }

  // Initialize navbar functionality
  function initNavbar() {
    // Login button functionality
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
      loginButton.addEventListener('click', function() {
        openModal('loginModal');
      });
    }

    // Forgot password link functionality
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal('forgotPasswordModal');
      });
    }

    // Init tab switching for navbar links
    const navLinks = document.querySelectorAll('.nav-links a[data-tab]');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (menuToggle && navLinksContainer) {
      menuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
      });
    }
  }

  // Initialize sidebar functionality
  function initSidebar() {
    // Sidebar links tab switching
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a[data-tab]');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const tabId = this.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // Manual auto-logout button
    const autoLogoutButton = document.getElementById('sidebar-auto-logout');
    if (autoLogoutButton) {
      autoLogoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('autoLogoutWarning').classList.add('visible');
      });
    }
  }

  // Initialize home tab functionality
  function initHomeTab() {
    // Any specific home tab initialization can go here
    console.log('Home tab initialized');
  }

  // Initialize user log tab functionality
  function initUserLogTab() {
    // Any specific user log tab initialization can go here
    console.log('User log tab initialized');
  }

  // Initialize settings tab functionality
  function initSettingsTab() {
    // Any specific settings tab initialization can go here
    console.log('Settings tab initialized');
  }

  // Initialize monitoring tab functionality
  function initMonitoringTab() {
    // Any specific monitoring tab initialization can go here
    console.log('Monitoring tab initialized');
    
    // Get monitoring data buttons
    const startMonitoringBtn = document.getElementById('startMonitoring');
    const stopMonitoringBtn = document.getElementById('stopMonitoring');
    
    if (startMonitoringBtn) {
      startMonitoringBtn.addEventListener('click', function() {
        console.log('Starting monitoring...');
        document.querySelector('.monitoring-status').textContent = 'Active';
        document.querySelector('.status-indicator').classList.remove('inactive');
        document.querySelector('.status-indicator').classList.add('active');
      });
    }
    
    if (stopMonitoringBtn) {
      stopMonitoringBtn.addEventListener('click', function() {
        console.log('Stopping monitoring...');
        document.querySelector('.monitoring-status').textContent = 'Inactive';
        document.querySelector('.status-indicator').classList.remove('active');
        document.querySelector('.status-indicator').classList.add('inactive');
      });
    }
  }

  // Initialize auto logout functionality
  function initAutoLogout() {
    // This is handled by AutoLogout.js
    if (typeof AutoLogout !== 'undefined') {
      const autoLogout = new AutoLogout({
        warningTime: 300, // 5 minutes
        logoutTime: 10,   // 10 seconds warning
        warningElement: document.getElementById('autoLogoutWarning'),
        countdownElement: document.getElementById('logoutCountdown'),
        stayLoggedInButton: document.getElementById('stayLoggedIn'),
        logoutNowButton: document.getElementById('logoutNow'),
        onLogout: function() {
          console.log('User logged out due to inactivity');
          // In a real app, this would redirect to the login page
          openModal('loginModal');
        }
      });
      autoLogout.init();
    }
  }

  // Modal functionality
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Close modal when clicking the close button
  document.querySelectorAll('.close-modal').forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Close modal when clicking outside the content
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  });

  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      console.log(`Login attempt for: ${email}`);
      // This would normally call an authentication API
      
      // For demo purposes, just close the modal and show logged in state
      closeModal('loginModal');
      
      // Update UI to show logged in status
      document.querySelectorAll('.user-profile').forEach(profile => {
        profile.classList.add('logged-in');
      });
    });
  }

  // Handle forgot password form submission
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('resetEmail').value;
      
      console.log(`Password reset requested for: ${email}`);
      // This would normally call a password reset API
      
      // For demo purposes, just close the modal
      closeModal('forgotPasswordModal');
      
      // Show a toast or notification
      alert('Password reset link sent to your email');
    });
  }

  // Back to login button in forgot password modal
  const backToLoginBtn = document.getElementById('backToLoginBtn');
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeModal('forgotPasswordModal');
      openModal('loginModal');
    });
  }

  // After all components are loaded, initialize tab switching
  setTimeout(initTabSwitching, 500);
});
