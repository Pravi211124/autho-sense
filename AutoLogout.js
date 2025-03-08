
class AutoLogout {
  constructor(options = {}) {
    this.options = {
      warningTime: options.warningTime || 4 * 60 * 1000, // 4 minutes
      logoutTime: options.logoutTime || 10 * 1000, // 10 seconds after warning
      warningElement: options.warningElement || '#autoLogoutWarning',
      countdownElement: options.countdownElement || '#logoutCountdown',
      stayLoggedInButton: options.stayLoggedInButton || '#stayLoggedIn',
      logoutNowButton: options.logoutNowButton || '#logoutNow',
      onLogout: options.onLogout || this.defaultLogout,
      activityEvents: options.activityEvents || [
        'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click', 'keydown'
      ]
    };

    this.inactivityTimer = null;
    this.countdownInterval = null;
    this.secondsLeft = this.options.logoutTime / 1000;
    
    this.warningElement = document.querySelector(this.options.warningElement);
    this.countdownElement = document.querySelector(this.options.countdownElement);
    this.stayLoggedInButton = document.querySelector(this.options.stayLoggedInButton);
    this.logoutNowButton = document.querySelector(this.options.logoutNowButton);
    
    this.resetInactivityTimer = this.resetInactivityTimer.bind(this);
    this.showWarning = this.showWarning.bind(this);
    this.hideWarning = this.hideWarning.bind(this);
    this.performLogout = this.performLogout.bind(this);
    this.updateCountdown = this.updateCountdown.bind(this);
    
    this.init();
  }
  
  init() {
    // Set up event listeners for user activity
    this.options.activityEvents.forEach(event => {
      document.addEventListener(event, this.resetInactivityTimer);
    });
    
    // Set up UI controls
    if (this.stayLoggedInButton) {
      this.stayLoggedInButton.addEventListener('click', this.hideWarning);
    }
    
    if (this.logoutNowButton) {
      this.logoutNowButton.addEventListener('click', this.performLogout);
    }
    
    // Start the inactivity timer
    this.resetInactivityTimer();
  }
  
  resetInactivityTimer() {
    // Clear existing timer
    clearTimeout(this.inactivityTimer);
    
    // Set new timer
    this.inactivityTimer = setTimeout(this.showWarning, this.options.warningTime);
    
    // Hide warning if it's showing
    if (this.warningElement && this.warningElement.classList.contains('show')) {
      this.hideWarning();
    }
  }
  
  showWarning() {
    if (this.warningElement) {
      this.warningElement.classList.add('show');
      
      // Reset countdown
      this.secondsLeft = this.options.logoutTime / 1000;
      this.updateCountdown();
      
      // Start countdown
      clearInterval(this.countdownInterval);
      this.countdownInterval = setInterval(() => {
        this.secondsLeft--;
        this.updateCountdown();
        
        if (this.secondsLeft <= 0) {
          this.performLogout();
        }
      }, 1000);
    }
  }
  
  hideWarning() {
    if (this.warningElement) {
      this.warningElement.classList.remove('show');
      clearInterval(this.countdownInterval);
      this.resetInactivityTimer();
    }
  }
  
  updateCountdown() {
    if (this.countdownElement) {
      this.countdownElement.textContent = Math.max(0, Math.floor(this.secondsLeft)).toString();
    }
  }
  
  performLogout() {
    clearTimeout(this.inactivityTimer);
    clearInterval(this.countdownInterval);
    
    if (this.warningElement) {
      this.warningElement.classList.remove('show');
    }
    
    this.options.onLogout();
  }
  
  defaultLogout() {
    // Default logout behavior
    alert('You have been logged out due to inactivity.');
    window.location.reload();
  }
  
  // Public method to clean up event listeners
  destroy() {
    this.options.activityEvents.forEach(event => {
      document.removeEventListener(event, this.resetInactivityTimer);
    });
    
    if (this.stayLoggedInButton) {
      this.stayLoggedInButton.removeEventListener('click', this.hideWarning);
    }
    
    if (this.logoutNowButton) {
      this.logoutNowButton.removeEventListener('click', this.performLogout);
    }
    
    clearTimeout(this.inactivityTimer);
    clearInterval(this.countdownInterval);
  }
}

// Create instance for demo purposes
document.addEventListener('DOMContentLoaded', () => {
  const autoLogout = new AutoLogout({
    warningTime: 60 * 1000, // For demo: show warning after 1 minute
    onLogout: () => {
      // Create a toast message
      const toast = document.createElement('div');
      toast.className = 'toast show';
      toast.innerHTML = `
        <div class="toast-content">
          <div class="toast-title">Session Ended</div>
          <div class="toast-message">You have been logged out due to inactivity.</div>
        </div>
      `;
      document.body.appendChild(toast);
      
      // Show toast for 3 seconds then reload page
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }, 3000);
    }
  });
  
  // Add to window for debugging
  window.autoLogout = autoLogout;
});
