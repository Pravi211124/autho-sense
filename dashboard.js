
// This script manages the dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
  // Load component HTML into containers
  loadComponent('navbar-container', 'components/navbar.html');
  loadComponent('sidebar-container', 'components/sidebar.html');
  loadComponent('dashboard-header-container', 'components/dashboard-header.html');
  loadComponent('home-tab-container', 'components/home-tab.html');
  loadComponent('user-log-tab-container', 'components/user-log-tab.html');
  loadComponent('settings-tab-container', 'components/settings-tab.html');
  loadComponent('monitoring-tab-container', 'components/monitoring-tab.html');
  loadComponent('footer-container', 'components/footer.html');

  // Initialize tab navigation
  setTimeout(initializeTabs, 100);
  
  // Initialize login and forgot password modals
  setTimeout(initializeModals, 150);
  
  // Initialize auto logout functionality
  setTimeout(initializeAutoLogout, 200);
});

// Function to load components
function loadComponent(containerId, componentPath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  fetch(componentPath)
    .then(response => response.text())
    .then(html => {
      container.innerHTML = html;
      
      // Execute component's JavaScript if it exists
      const script = document.createElement('script');
      script.src = componentPath.replace('.html', '.js');
      script.onerror = function() {
        // Silently handle missing JS files
        this.remove();
      };
      document.body.appendChild(script);
      
      // If this is the monitoring tab, initialize monitoring interactions
      if (containerId === 'monitoring-tab-container') {
        setTimeout(initializeMonitoring, 100);
      }
    })
    .catch(error => {
      console.error(`Error loading component ${componentPath}:`, error);
    });
}

// Function to initialize tab navigation
function initializeTabs() {
  // Get all tab links
  const tabLinks = document.querySelectorAll('[data-tab]');
  
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the tab to show
      const tabId = this.getAttribute('data-tab');
      
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Show the selected tab
      const selectedTab = document.getElementById(tabId + '-container');
      if (selectedTab) {
        selectedTab.classList.add('active');
      }
      
      // Update active state on nav links
      document.querySelectorAll('.nav-links a').forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      // Make current link active
      this.classList.add('active');
    });
  });
  
  // Initialize monitoring tab button
  const monitoringBtn = document.getElementById('websiteMonitoring');
  if (monitoringBtn) {
    monitoringBtn.addEventListener('click', function() {
      // Hide all tabs
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Show monitoring tab
      const monitoringTab = document.getElementById('monitoring-tab-container');
      if (monitoringTab) {
        monitoringTab.classList.add('active');
      }
      
      // Update active state on nav links
      document.querySelectorAll('.nav-links a').forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      // Make monitoring link active
      const monitoringLink = document.querySelector('[data-tab="monitoring-tab"]');
      if (monitoringLink) {
        monitoringLink.classList.add('active');
      }
    });
  }
}

// Function to initialize login and forgot password modals
function initializeModals() {
  // Login Modal
  const loginModal = document.getElementById('loginModal');
  const loginBtn = document.getElementById('loginButton');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const backToLoginBtn = document.getElementById('backToLoginBtn');
  const closeButtons = document.querySelectorAll('.close-modal');
  
  // Show login modal
  if (loginBtn && loginModal) {
    loginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      loginModal.style.display = 'flex';
    });
  }
  
  // Show forgot password modal
  if (forgotPasswordBtn && forgotPasswordModal && loginModal) {
    forgotPasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      loginModal.style.display = 'none';
      forgotPasswordModal.style.display = 'flex';
    });
  }
  
  // Back to login
  if (backToLoginBtn && loginModal && forgotPasswordModal) {
    backToLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      forgotPasswordModal.style.display = 'none';
      loginModal.style.display = 'flex';
    });
  }
  
  // Close modals
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
  
  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // In a real app, you would validate credentials
      // For demo purposes, just close the modal and show logged in state
      loginModal.style.display = 'none';
      
      // Show success toast
      showToast('Login Successful', 'You are now logged in with ' + email);
    });
  }
  
  // Handle forgot password form submission
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('resetEmail').value;
      
      // In a real app, you would send a reset email
      forgotPasswordModal.style.display = 'none';
      
      // Show success toast
      showToast('Reset Link Sent', 'Password reset instructions sent to ' + email);
    });
  }
}

// Function to initialize auto logout
function initializeAutoLogout() {
  const autoLogoutWarning = document.getElementById('autoLogoutWarning');
  const logoutCountdown = document.getElementById('logoutCountdown');
  const stayLoggedInBtn = document.getElementById('stayLoggedIn');
  const logoutNowBtn = document.getElementById('logoutNow');
  
  let countdownTimer;
  let seconds = 10;
  
  // Function to start countdown
  function startCountdown() {
    autoLogoutWarning.classList.add('show');
    
    seconds = 10;
    if (logoutCountdown) {
      logoutCountdown.textContent = seconds;
    }
    
    countdownTimer = setInterval(function() {
      seconds--;
      
      if (logoutCountdown) {
        logoutCountdown.textContent = seconds;
      }
      
      if (seconds <= 0) {
        clearInterval(countdownTimer);
        performLogout();
      }
    }, 1000);
  }
  
  // Function to perform logout
  function performLogout() {
    clearInterval(countdownTimer);
    autoLogoutWarning.classList.remove('show');
    
    // In a real app, you would clear session, etc.
    // For demo, redirect to home page
    window.location.href = 'index.html';
  }
  
  // Function to cancel logout
  function cancelLogout() {
    clearInterval(countdownTimer);
    autoLogoutWarning.classList.remove('show');
    
    // Reset idle timer
    resetIdleTimer();
  }
  
  // Set up idle detection
  let idleTimer;
  
  function resetIdleTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startCountdown, 60000); // 1 minute of inactivity
  }
  
  // User actions that reset the idle timer
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(name => {
    document.addEventListener(name, resetIdleTimer, true);
  });
  
  // Start initial timer
  resetIdleTimer();
  
  // Handle stay logged in button
  if (stayLoggedInBtn) {
    stayLoggedInBtn.addEventListener('click', cancelLogout);
  }
  
  // Handle logout now button
  if (logoutNowBtn) {
    logoutNowBtn.addEventListener('click', performLogout);
  }
}

// Function to initialize monitoring tab interactions
function initializeMonitoring() {
  // Run New Scan button functionality
  const runScanBtn = document.querySelector('#monitoring-tab-container .action-buttons .btn-primary');
  if (runScanBtn) {
    runScanBtn.addEventListener('click', function() {
      showToast('Scan Started', 'Security scan is now running...');
      
      // Simulate scan completing after 3 seconds
      setTimeout(function() {
        showToast('Scan Complete', 'Security scan completed successfully');
      }, 3000);
    });
  }
  
  // Download Report button functionality
  const downloadReportBtn = document.querySelector('#monitoring-tab-container .action-buttons .btn-outline');
  if (downloadReportBtn) {
    downloadReportBtn.addEventListener('click', function() {
      showToast('Report Generated', 'Security report has been downloaded');
    });
  }
  
  // Fix and Update buttons in scan results
  const actionButtons = document.querySelectorAll('#monitoring-tab-container .scan-results button');
  actionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const action = this.textContent.trim();
      const issue = this.closest('li').querySelector('h4').textContent;
      
      showToast(`${action} Action`, `${action} process initiated for: ${issue}`);
    });
  });
}

// Helper function to show toast notifications
function showToast(title, message) {
  const toast = document.createElement('div');
  toast.className = 'toast show';
  
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() {
      toast.remove();
    }, 300);
  }, 3000);
}
