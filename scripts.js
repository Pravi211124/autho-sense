AOS.init({
  duration: 600, // Animation duration
  easing: 'ease-in-out', // Animation easing
  once: true, // Whether animation should happen only once
  mirror: false, // Whether elements should animate out while scrolling past them
});

// Function to update the current year in the footer
function updateCurrentYear() {
  const currentYear = new Date().getFullYear();
  document.getElementById('current-year').textContent = currentYear;
}

// Function to handle the scroll-to-top button
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // for smooth scrolling
  });
}

// Function to toggle mobile menu
function toggleMobileMenu() {
  const navbar = document.getElementById('navbar');
  navbar.classList.toggle('active');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Update current year
  updateCurrentYear();

  // Scroll to top button functionality
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', scrollToTop);

    // Show/hide the button based on scroll position
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'block';
      } else {
        scrollToTopBtn.style.display = 'none';
      }
    });
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }
});

// Handle Demo Mode Button
document.addEventListener('DOMContentLoaded', function() {
  const demoButton = document.getElementById('demoButton');
  const toast = document.getElementById('toast');

  if (demoButton) {
    demoButton.addEventListener('click', function() {
      // Show the toast notification
      toast.classList.add('show');

      // Redirect to dashboard after showing toast
      setTimeout(function() {
        toast.classList.remove('show');
        window.location.href = 'dashboard.html';
      }, 2000); // Redirect after 2 seconds
    });
  }
});

// Dashboard Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
  const tabLinks = document.querySelectorAll('.sidebar-menu a');
  const tabContainers = {
    'home-tab': document.getElementById('home-tab-container'),
    'user-log-tab': document.getElementById('user-log-tab-container'),
    'settings-tab': document.getElementById('settings-tab-container'),
	'monitoring-tab': document.getElementById('monitoring-tab-container')
  };

  function showTab(tabId) {
    // Hide all tab containers
    for (let tab in tabContainers) {
      if (tabContainers.hasOwnProperty(tab)) {
        tabContainers[tab].style.display = 'none';
      }
    }

    // Show the selected tab
    if (tabContainers[tabId]) {
      tabContainers[tabId].style.display = 'block';
    }
  }

  // Initially show the home tab
  showTab('home-tab');

  // Add click event listeners to tab links
  tabLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      // Remove active class from all links
      tabLinks.forEach(link => link.parentElement.classList.remove('active'));

      // Add active class to the clicked link
      this.parentElement.classList.add('active');

      // Show the corresponding tab
      const tabId = this.getAttribute('data-tab');
      showTab(tabId);
    });
  });
});

// Dashboard Date and Time Display
function updateDateTime() {
  const now = new Date();
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true };

  document.getElementById('current-date').textContent = now.toLocaleDateString(undefined, dateOptions);
  document.getElementById('current-time').textContent = now.toLocaleTimeString(undefined, timeOptions);
}

// Update date and time every second
setInterval(updateDateTime, 1000);

// Footer Year Update
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('footer-year').textContent = new Date().getFullYear();
});

// Handle Logout Button
document.addEventListener('DOMContentLoaded', function() {
  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      // Redirect to index.html
      window.location.href = 'index.html';
    });
  }
});

// Handle Run Verification Button
document.addEventListener('DOMContentLoaded', function() {
  const runVerificationButton = document.getElementById('runVerification');

  if (runVerificationButton) {
    runVerificationButton.addEventListener('click', function() {
      // Add logic to run verification here
      alert('Verification process initiated!');
    });
  }
});

// Handle Auto Logout Button
document.addEventListener('DOMContentLoaded', function() {
  const sidebarAutoLogout = document.getElementById('sidebar-auto-logout');

  if (sidebarAutoLogout) {
    sidebarAutoLogout.addEventListener('click', function() {
      // Add auto-logout functionality here
      alert('Auto-logout feature activated!');
    });
  }
});

// Handle Login Button
document.addEventListener('DOMContentLoaded', function() {
  // Get the login button
  const loginButton = document.getElementById('loginButton');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const demoButton = document.getElementById('demoButton');
  const demoButtonHero = document.getElementById('demoButtonHero');
  
  // Add the toast to the body if it doesn't exist
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-title">Notification</div>
        <div class="toast-message"></div>
      </div>
    `;
    document.body.appendChild(toast);
  }
  
  // Handle login button click
  if (loginButton) {
    loginButton.addEventListener('click', function() {
      showLoginModal();
    });
  }
  
  // Handle forgot password link click
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      showForgotPasswordModal();
    });
  }
  
  // Handle demo buttons
  if (demoButton) {
    demoButton.addEventListener('click', function() {
      activateDemoMode();
    });
  }
  
  if (demoButtonHero) {
    demoButtonHero.addEventListener('click', function() {
      activateDemoMode();
    });
  }
  
  // Create modal container if it doesn't exist
  let modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
  }
});

function showLoginModal() {
  const modalContainer = document.getElementById('modal-container');
  
  modalContainer.innerHTML = `
    <div class="modal" id="loginModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Log In</h2>
          <button class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <form id="loginForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Log In</button>
              <a href="#" id="forgotPasswordModalLink">Forgot Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Show the modal
  modalContainer.classList.add('show');
  
  // Add event listeners
  modalContainer.querySelector('.close-button').addEventListener('click', closeModal);
  modalContainer.querySelector('#forgotPasswordModalLink').addEventListener('click', function(e) {
    e.preventDefault();
    showForgotPasswordModal();
  });
  
  // Handle form submission
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Simulate login process
    simulateLogin(email, password);
  });
  
  // Close modal when clicking outside
  modalContainer.addEventListener('click', function(e) {
    if (e.target === modalContainer) {
      closeModal();
    }
  });
}

function showForgotPasswordModal() {
  const modalContainer = document.getElementById('modal-container');
  
  modalContainer.innerHTML = `
    <div class="modal" id="forgotPasswordModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Reset Password</h2>
          <button class="close-button">&times;</button>
        </div>
        <div class="modal-body">
          <p>Enter your email address and we'll send you instructions to reset your password.</p>
          <form id="forgotPasswordForm">
            <div class="form-group">
              <label for="resetEmail">Email</label>
              <input type="email" id="resetEmail" name="resetEmail" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-primary">Send Reset Link</button>
              <button type="button" class="btn btn-outline" id="backToLoginBtn">Back to Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Show the modal
  modalContainer.classList.add('show');
  
  // Add event listeners
  modalContainer.querySelector('.close-button').addEventListener('click', closeModal);
  modalContainer.querySelector('#backToLoginBtn').addEventListener('click', showLoginModal);
  
  // Handle form submission
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  forgotPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    
    // Simulate password reset
    simulatePasswordReset(email);
  });
  
  // Close modal when clicking outside
  modalContainer.addEventListener('click', function(e) {
    if (e.target === modalContainer) {
      closeModal();
    }
  });
}

function closeModal() {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.classList.remove('show');
  modalContainer.innerHTML = '';
}

function simulateLogin(email, password) {
  // Show loading state
  const loginButton = document.querySelector('#loginForm .btn-primary');
  loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
  loginButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    closeModal();
    
    // Redirect to dashboard
    showToast('Login successful! Redirecting to dashboard...');
    
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 2000);
  }, 1500);
}

function simulatePasswordReset(email) {
  // Show loading state
  const resetButton = document.querySelector('#forgotPasswordForm .btn-primary');
  resetButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  resetButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    closeModal();
    
    // Show success message
    showToast('Password reset link sent! Check your email.');
  }, 1500);
}

function activateDemoMode() {
  // Show loading state
  const toastElement = document.getElementById('toast');
  const toastTitle = document.querySelector('.toast-title');
  const toastMessage = document.querySelector('.toast-message');
  
  if (toastTitle && toastMessage) {
    toastTitle.textContent = 'Demo Mode';
    toastMessage.textContent = 'Entering demo experience with sample data...';
  }
  
  if (toastElement) {
    toastElement.classList.add('show');
    
    // Redirect to dashboard after showing toast
    setTimeout(() => {
      toastElement.classList.remove('show');
      window.location.href = 'dashboard.html';
    }, 2000);
  } else {
    // Fallback if toast element doesn't exist
    window.location.href = 'dashboard.html';
  }
}

function showToast(message, title = 'Notification') {
  const toast = document.getElementById('toast');
  const toastTitle = document.querySelector('.toast-title');
  const toastMessage = document.querySelector('.toast-message');
  
  if (toast && toastMessage) {
    if (toastTitle) {
      toastTitle.textContent = title;
    }
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}
