
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components by loading all component scripts
  
  // Tab navigation functionality
  function setupTabNavigation() {
    const tabLinks = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the tab ID from the data attribute
        const tabId = this.getAttribute('data-tab');
        
        // Deactivate all tabs
        tabLinks.forEach(el => el.classList.remove('active'));
        tabContents.forEach(el => el.classList.remove('active'));
        
        // Activate the current tab
        this.classList.add('active');
        document.getElementById(tabId + '-container').classList.add('active');
      });
    });
  }
  
  // Login modal functionality
  function setupLoginModal() {
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    
    // Open login modal
    if (loginButton) {
      loginButton.addEventListener('click', function() {
        if (loginModal) loginModal.style.display = 'flex';
      });
    }
    
    // Close modals
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (loginModal) loginModal.style.display = 'none';
        if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
      });
    });
    
    // Open forgot password modal
    if (forgotPasswordLink) {
      forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (loginModal) loginModal.style.display = 'none';
        if (forgotPasswordModal) forgotPasswordModal.style.display = 'flex';
      });
    }
    
    if (forgotPasswordBtn) {
      forgotPasswordBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (loginModal) loginModal.style.display = 'none';
        if (forgotPasswordModal) forgotPasswordModal.style.display = 'flex';
      });
    }
    
    // Back to login
    if (backToLoginBtn) {
      backToLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
        if (loginModal) loginModal.style.display = 'flex';
      });
    }
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate login success
        alert('Login successful!');
        if (loginModal) loginModal.style.display = 'none';
      });
    }
    
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
      forgotPasswordForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Simulate password reset email sent
        alert('Password reset link sent to your email!');
        if (forgotPasswordModal) forgotPasswordModal.style.display = 'none';
      });
    }
  }
  
  // Initialize Auto Logout functionality
  function setupAutoLogout() {
    const sidebarAutoLogoutBtn = document.getElementById('sidebar-auto-logout');
    
    if (sidebarAutoLogoutBtn) {
      sidebarAutoLogoutBtn.addEventListener('click', function() {
        if (window.AutoLogout) {
          // Create auto logout instance if it doesn't exist
          if (!window.autoLogoutManager) {
            window.autoLogoutManager = new AutoLogout({
              logoutFunction: function() {
                console.log('Auto logout triggered');
                window.location.href = 'index.html';
              },
              warningElement: document.getElementById('autoLogoutWarning'),
              countdownElement: document.getElementById('logoutCountdown'),
              timeout: 10000, // 10 seconds default
              showWarning: true
            });
          }
          
          // Toggle auto logout monitoring
          if (window.autoLogoutManager.isMonitoring) {
            window.autoLogoutManager.stopMonitoring();
            alert('Auto logout disabled');
          } else {
            window.autoLogoutManager.startMonitoring();
            alert('Auto logout enabled');
          }
        }
      });
    }
    
    // Connect auto logout settings in the settings tab
    const enableAutoLogout = document.getElementById('enableAutoLogout');
    const autoLogoutDuration = document.getElementById('autoLogoutDuration');
    const enableLogoutWarning = document.getElementById('enableLogoutWarning');
    
    if (enableAutoLogout) {
      enableAutoLogout.addEventListener('change', function() {
        if (window.autoLogoutManager) {
          if (this.checked) {
            window.autoLogoutManager.startMonitoring();
          } else {
            window.autoLogoutManager.stopMonitoring();
          }
        }
      });
    }
    
    if (autoLogoutDuration) {
      autoLogoutDuration.addEventListener('change', function() {
        if (window.autoLogoutManager) {
          window.autoLogoutManager.setTimeout(Number(this.value));
        }
      });
    }
    
    if (enableLogoutWarning) {
      enableLogoutWarning.addEventListener('change', function() {
        if (window.autoLogoutManager) {
          window.autoLogoutManager.setShowWarning(this.checked);
        }
      });
    }
  }
  
  // Initialize all functionality
  setupTabNavigation();
  setupLoginModal();
  setupAutoLogout();
  
  // Initialize the Face Authentication for Auto Logout
  document.addEventListener('faceAuthStarted', function() {
    if (window.AutoLogout) {
      // Create auto logout instance
      window.autoLogoutManager = new AutoLogout({
        logoutFunction: function() {
          console.log('Auto logout triggered');
          window.location.href = 'index.html';
        },
        warningElement: document.getElementById('autoLogoutWarning'),
        countdownElement: document.getElementById('logoutCountdown'),
        timeout: 10000, // 10 seconds default
        showWarning: true
      });
      
      // Start monitoring
      window.autoLogoutManager.startMonitoring();
    }
  });
  
  // Make sure the website monitoring tab works correctly
  const monitoringBtn = document.getElementById('websiteMonitoring');
  if (monitoringBtn) {
    monitoringBtn.addEventListener('click', function() {
      const tabLinks = document.querySelectorAll('[data-tab]');
      const tabContents = document.querySelectorAll('.tab-content');
      
      // Deactivate all tabs
      tabLinks.forEach(el => el.classList.remove('active'));
      tabContents.forEach(el => el.classList.remove('active'));
      
      // Activate the monitoring tab
      const monitoringTabLink = document.querySelector('[data-tab="monitoring-tab"]');
      if (monitoringTabLink) monitoringTabLink.classList.add('active');
      
      const monitoringTabContent = document.getElementById('monitoring-tab-container');
      if (monitoringTabContent) monitoringTabContent.classList.add('active');
    });
  }
});
