
/**
 * AutoLogout - A class to handle automatic logout due to user inactivity
 */
class AutoLogout {
  constructor(options) {
    this.options = Object.assign({
      warningTime: 300, // Default: 5 minutes before showing warning
      logoutTime: 10,   // Default: 10 seconds countdown before logout
      warningElement: null,
      countdownElement: null,
      stayLoggedInButton: null,
      logoutNowButton: null,
      onLogout: () => { console.log('User logged out due to inactivity'); }
    }, options);

    this.warningTimer = null;
    this.logoutTimer = null;
    this.countdownInterval = null;
    this.countdown = this.options.logoutTime;
    this.activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  }

  /**
   * Initialize the auto logout functionality
   */
  init() {
    // Set up activity listeners
    this.setupActivityListeners();
    
    // Start the warning timer
    this.resetWarningTimer();
    
    // Set up UI controls
    this.setupUIControls();
    
    console.log('Auto logout initialized');
  }

  /**
   * Setup activity listeners to detect user activity
   */
  setupActivityListeners() {
    const resetTimerBound = this.resetWarningTimer.bind(this);
    
    this.activityEvents.forEach(event => {
      document.addEventListener(event, resetTimerBound);
    });
    
    // Save the bound function reference for later cleanup
    this.resetTimerBound = resetTimerBound;
  }

  /**
   * Set up UI control event listeners
   */
  setupUIControls() {
    // Stay logged in button
    if (this.options.stayLoggedInButton) {
      this.options.stayLoggedInButton.addEventListener('click', () => {
        this.hideWarning();
        this.resetWarningTimer();
      });
    }
    
    // Logout now button
    if (this.options.logoutNowButton) {
      this.options.logoutNowButton.addEventListener('click', () => {
        this.hideWarning();
        this.logout();
      });
    }
  }

  /**
   * Reset the warning timer whenever user activity is detected
   */
  resetWarningTimer() {
    // Clear any existing timers
    clearTimeout(this.warningTimer);
    clearTimeout(this.logoutTimer);
    clearInterval(this.countdownInterval);
    
    // Hide the warning if it's visible
    this.hideWarning();
    
    // Start a new warning timer
    this.warningTimer = setTimeout(() => {
      this.showWarning();
    }, this.options.warningTime * 1000);
  }

  /**
   * Show the logout warning and start the countdown
   */
  showWarning() {
    // Show warning element
    if (this.options.warningElement) {
      this.options.warningElement.classList.add('visible');
    }
    
    // Reset countdown
    this.countdown = this.options.logoutTime;
    this.updateCountdown();
    
    // Start countdown interval
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      this.updateCountdown();
      
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.hideWarning();
        this.logout();
      }
    }, 1000);
  }

  /**
   * Hide the logout warning
   */
  hideWarning() {
    if (this.options.warningElement) {
      this.options.warningElement.classList.remove('visible');
    }
    
    clearInterval(this.countdownInterval);
  }

  /**
   * Update the countdown display
   */
  updateCountdown() {
    if (this.options.countdownElement) {
      this.options.countdownElement.textContent = this.countdown;
    }
  }

  /**
   * Perform the logout action
   */
  logout() {
    if (typeof this.options.onLogout === 'function') {
      this.options.onLogout();
    }
  }

  /**
   * Clean up event listeners
   */
  destroy() {
    // Remove all event listeners
    this.activityEvents.forEach(event => {
      document.removeEventListener(event, this.resetTimerBound);
    });
    
    // Clear all timers
    clearTimeout(this.warningTimer);
    clearTimeout(this.logoutTimer);
    clearInterval(this.countdownInterval);
    
    console.log('Auto logout destroyed');
  }
}
