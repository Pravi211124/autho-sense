
document.addEventListener('DOMContentLoaded', function() {
  // Initialize date and time
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Initialize tab navigation
  initTabNavigation();
  
  // Initialize login modal
  initLoginModal();
  
  // Initialize forgot password modal
  initForgotPasswordModal();
  
  // Initialize auto logout
  initAutoLogout();
  
  // Initialize verification button
  initVerificationButton();
});

function updateDateTime() {
  const dateElement = document.getElementById('current-date');
  const timeElement = document.getElementById('current-time');
  
  if (dateElement && timeElement) {
    const now = new Date();
    
    // Format date: Monday, January 1, 2023
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time: 12:00:00 PM
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
  }
}

function initTabNavigation() {
  const tabLinks = document.querySelectorAll('[data-tab]');
  
  tabLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const tabId = this.getAttribute('data-tab');
      
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Show selected tab content
      const selectedTab = document.getElementById(`${tabId}-container`);
      if (selectedTab) {
        selectedTab.classList.add('active');
      }
      
      // Update active state on navigation links
      document.querySelectorAll('.nav-links a').forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      // Add active class to clicked link
      this.classList.add('active');
    });
  });
  
  // Special handling for Website Monitoring button in header
  const monitoringButton = document.getElementById('websiteMonitoring');
  if (monitoringButton) {
    monitoringButton.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
      });
      
      // Show monitoring tab content
      const monitoringTab = document.getElementById(`${tabId}-container`);
      if (monitoringTab) {
        monitoringTab.classList.add('active');
      }
      
      // Update active state on navigation links
      document.querySelectorAll('.nav-links a').forEach(navLink => {
        navLink.classList.remove('active');
        if (navLink.getAttribute('data-tab') === tabId) {
          navLink.classList.add('active');
        }
      });
    });
  }
}

function initLoginModal() {
  const loginButton = document.getElementById('loginButton');
  const loginModal = document.getElementById('loginModal');
  const closeModal = loginModal.querySelector('.close-modal');
  const loginForm = document.getElementById('loginForm');
  
  // Open login modal
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      loginModal.style.display = 'flex';
    });
  }
  
  // Close login modal
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      loginModal.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });
  
  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Simulate login
      showToast('Login successful! Welcome back.');
      loginModal.style.display = 'none';
      
      // Update UI to show logged in state
      if (loginButton) {
        loginButton.textContent = 'Logout';
        loginButton.id = 'logoutButton';
        loginButton.addEventListener('click', function() {
          window.location.reload();
        });
      }
      
      // Hide forgot password link
      const forgotPasswordLink = document.getElementById('forgotPasswordLink');
      if (forgotPasswordLink) {
        forgotPasswordLink.style.display = 'none';
      }
    });
  }
}

function initForgotPasswordModal() {
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const closeModal = forgotPasswordModal.querySelector('.close-modal');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const backToLoginBtn = document.getElementById('backToLoginBtn');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  
  // Functions to show/hide modals
  const showLoginModal = () => {
    document.getElementById('loginModal').style.display = 'flex';
    forgotPasswordModal.style.display = 'none';
  };
  
  const showForgotPasswordModal = () => {
    document.getElementById('loginModal').style.display = 'none';
    forgotPasswordModal.style.display = 'flex';
  };
  
  // Link from login modal to forgot password modal
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showForgotPasswordModal();
    });
  }
  
  // Link from navbar to forgot password
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      showForgotPasswordModal();
    });
  }
  
  // Back to login button
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showLoginModal();
    });
  }
  
  // Close forgot password modal
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      forgotPasswordModal.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    if (event.target === forgotPasswordModal) {
      forgotPasswordModal.style.display = 'none';
    }
  });
  
  // Handle forgot password form submission
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('resetEmail').value;
      
      // Simulate reset email sending
      showToast(`Password reset link sent to ${email}`);
      forgotPasswordModal.style.display = 'none';
    });
  }
}

function initAutoLogout() {
  let inactivityTimer;
  const autoLogoutWarning = document.getElementById('autoLogoutWarning');
  const logoutCountdown = document.getElementById('logoutCountdown');
  const stayLoggedInBtn = document.getElementById('stayLoggedIn');
  const logoutNowBtn = document.getElementById('logoutNow');
  let countdownInterval;
  let secondsLeft = 10;
  
  // Reset the inactivity timer on user interaction
  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(showWarning, 5 * 60 * 1000); // 5 minutes
  };
  
  // Show the auto logout warning
  const showWarning = () => {
    if (autoLogoutWarning) {
      autoLogoutWarning.classList.add('show');
      secondsLeft = 10;
      updateCountdown();
      
      countdownInterval = setInterval(() => {
        secondsLeft--;
        updateCountdown();
        
        if (secondsLeft <= 0) {
          performLogout();
        }
      }, 1000);
    }
  };
  
  // Update the countdown timer
  const updateCountdown = () => {
    if (logoutCountdown) {
      logoutCountdown.textContent = secondsLeft.toString();
    }
  };
  
  // Perform logout action
  const performLogout = () => {
    clearInterval(countdownInterval);
    if (autoLogoutWarning) {
      autoLogoutWarning.classList.remove('show');
    }
    
    showToast('You have been logged out due to inactivity');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  // Reset timer when user chooses to stay logged in
  if (stayLoggedInBtn) {
    stayLoggedInBtn.addEventListener('click', () => {
      clearInterval(countdownInterval);
      autoLogoutWarning.classList.remove('show');
      resetInactivityTimer();
    });
  }
  
  // Log out immediately if user chooses to
  if (logoutNowBtn) {
    logoutNowBtn.addEventListener('click', performLogout);
  }
  
  // User activity events
  const activityEvents = [
    'mousedown', 'mousemove', 'keypress', 
    'scroll', 'touchstart', 'click', 'keydown'
  ];
  
  activityEvents.forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
  });
  
  // Initialize the inactivity timer on page load
  resetInactivityTimer();
}

function initVerificationButton() {
  const verifyButton = document.getElementById('runVerification');
  
  if (verifyButton) {
    verifyButton.addEventListener('click', function() {
      verifyButton.disabled = true;
      verifyButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
      
      // Simulate verification
      setTimeout(() => {
        verifyButton.disabled = false;
        verifyButton.innerHTML = '<i class="fas fa-sync-alt"></i> Verify Now';
        showToast('Identity verification successful!');
      }, 2000);
    });
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">Notification</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
