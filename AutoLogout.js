
// Auto Logout Functionality

class AutoLogout {
  constructor(options = {}) {
    // Default options
    this.options = {
      warningTime: 60000, // 1 minute before showing warning
      logoutTime: 10000,  // 10 seconds countdown after warning
      warningElement: document.getElementById('autoLogoutWarning'),
      countdownElement: document.getElementById('logoutCountdown'),
      stayLoggedInButton: document.getElementById('stayLoggedIn'),
      logoutNowButton: document.getElementById('logoutNow'),
      onLogout: () => { window.location.href = 'index.html'; },
      ...options
    };
    
    // Initialize timers
    this.idleTimer = null;
    this.countdownTimer = null;
    this.secondsLeft = this.options.logoutTime / 1000;
    
    // Bind methods
    this.resetIdleTimer = this.resetIdleTimer.bind(this);
    this.showWarning = this.showWarning.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.cancelLogout = this.cancelLogout.bind(this);
    this.performLogout = this.performLogout.bind(this);
    
    // Initialize the auto logout
    this.init();
  }
  
  init() {
    // Set up event listeners to reset idle timer
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(eventName => {
      document.addEventListener(eventName, this.resetIdleTimer, true);
    });
    
    // Set up stay logged in button
    if (this.options.stayLoggedInButton) {
      this.options.stayLoggedInButton.addEventListener('click', this.cancelLogout);
    }
    
    // Set up logout now button
    if (this.options.logoutNowButton) {
      this.options.logoutNowButton.addEventListener('click', this.performLogout);
    }
    
    // Start the initial idle timer
    this.resetIdleTimer();
  }
  
  resetIdleTimer() {
    // Clear any existing timer
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    
    // Start a new timer
    this.idleTimer = setTimeout(this.showWarning, this.options.warningTime);
  }
  
  showWarning() {
    // Show the warning element
    if (this.options.warningElement) {
      this.options.warningElement.classList.add('show');
    }
    
    // Start the countdown
    this.startCountdown();
  }
  
  startCountdown() {
    // Reset seconds
    this.secondsLeft = this.options.logoutTime / 1000;
    
    // Update countdown display
    if (this.options.countdownElement) {
      this.options.countdownElement.textContent = this.secondsLeft;
    }
    
    // Clear any existing countdown
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    
    // Start the countdown
    this.countdownTimer = setInterval(() => {
      this.secondsLeft--;
      
      // Update countdown display
      if (this.options.countdownElement) {
        this.options.countdownElement.textContent = this.secondsLeft;
      }
      
      // Check if countdown is complete
      if (this.secondsLeft <= 0) {
        clearInterval(this.countdownTimer);
        this.performLogout();
      }
    }, 1000);
  }
  
  cancelLogout() {
    // Hide the warning
    if (this.options.warningElement) {
      this.options.warningElement.classList.remove('show');
    }
    
    // Clear the countdown
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    
    // Reset the idle timer
    this.resetIdleTimer();
  }
  
  performLogout() {
    // Clean up
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    
    // Hide the warning
    if (this.options.warningElement) {
      this.options.warningElement.classList.remove('show');
    }
    
    // Execute the logout callback
    if (typeof this.options.onLogout === 'function') {
      this.options.onLogout();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for components to load
  setTimeout(() => {
    new AutoLogout();
  }, 500);
});
