
// AutoLogout class for handling continuous presence detection and auto-logout
class AutoLogout {
  constructor(options = {}) {
    this.options = {
      timeout: options.timeout || 10000, // Default: 10 seconds
      warningTime: options.warningTime || 3000, // Default: 3 seconds before logout
      onLogout: options.onLogout || (() => {}),
      onWarning: options.onWarning || (() => {}),
      onReset: options.onReset || (() => {}),
      enabled: options.enabled !== undefined ? options.enabled : true,
      showWarning: options.showWarning !== undefined ? options.showWarning : true,
      apiUrl: options.apiUrl || 'http://localhost:5000',
      sessionId: options.sessionId || null,
      username: options.username || null
    };
    
    this.timer = null;
    this.warningTimer = null;
    this.isWarningShown = false;
    this.lastActivity = Date.now();
    this.presenceTimeout = null;
    
    // Bind methods
    this.resetTimer = this.resetTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.showWarning = this.showWarning.bind(this);
    this.logout = this.logout.bind(this);
    this.sendPresenceCheck = this.sendPresenceCheck.bind(this);
    
    if (this.options.enabled) {
      this.startTimer();
    }
  }
  
  // Start the timer
  startTimer() {
    console.log("Auto logout timer started");
    this.lastActivity = Date.now();
    this.clearTimers();
    
    if (!this.options.enabled) return;
    
    const timeUntilWarning = this.options.timeout - this.options.warningTime;
    
    // Set timer for showing warning
    if (this.options.showWarning && timeUntilWarning > 0) {
      this.warningTimer = setTimeout(() => {
        this.showWarning();
      }, timeUntilWarning);
    }
    
    // Set timer for logout
    this.timer = setTimeout(() => {
      this.logout();
    }, this.options.timeout);
    
    // Start checking presence via API
    this.startPresenceCheck();
  }
  
  // Reset the timer
  resetTimer() {
    if (this.isWarningShown) {
      this.options.onReset();
      this.isWarningShown = false;
    }
    this.startTimer();
  }
  
  // Stop the timer
  stopTimer() {
    this.clearTimers();
  }
  
  // Clear all timers
  clearTimers() {
    if (this.timer) clearTimeout(this.timer);
    if (this.warningTimer) clearTimeout(this.warningTimer);
    if (this.presenceTimeout) clearTimeout(this.presenceTimeout);
  }
  
  // Show warning before logout
  showWarning() {
    if (!this.options.enabled || !this.options.showWarning) return;
    
    console.log("Auto logout warning shown");
    this.isWarningShown = true;
    this.options.onWarning();
  }
  
  // Perform logout
  logout() {
    if (!this.options.enabled) return;
    
    console.log("Auto logout executed");
    this.clearTimers();
    this.options.onLogout();
  }
  
  // Set enabled/disabled
  setEnabled(enabled) {
    this.options.enabled = enabled;
    
    if (enabled) {
      this.startTimer();
    } else {
      this.stopTimer();
      if (this.isWarningShown) {
        this.options.onReset();
        this.isWarningShown = false;
      }
    }
  }
  
  // Update timeout duration
  setTimeout(timeout) {
    this.options.timeout = timeout;
    if (this.options.enabled) {
      this.startTimer();
    }
  }
  
  // Update warning settings
  setWarning(showWarning, warningTime) {
    if (showWarning !== undefined) {
      this.options.showWarning = showWarning;
    }
    
    if (warningTime !== undefined) {
      this.options.warningTime = warningTime;
    }
    
    if (this.options.enabled) {
      this.startTimer();
    }
  }
  
  // Set session info
  setSessionInfo(sessionId, username) {
    this.options.sessionId = sessionId;
    this.options.username = username;
  }
  
  // Start checking user presence
  startPresenceCheck() {
    if (!this.options.enabled || !this.options.sessionId) return;
    
    // Check every second
    this.presenceTimeout = setTimeout(this.sendPresenceCheck, 1000);
  }
  
  // Send presence check request to backend
  async sendPresenceCheck() {
    if (!this.options.enabled || !this.options.sessionId) return;
    
    try {
      const response = await fetch(`${this.options.apiUrl}/check_session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.options.sessionId
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Session active, continue checking
        this.presenceTimeout = setTimeout(this.sendPresenceCheck, 1000);
      } else {
        // Session expired or invalid, logout
        this.logout();
      }
    } catch (error) {
      console.error('Error checking session:', error);
      // Continue checking despite error
      this.presenceTimeout = setTimeout(this.sendPresenceCheck, 1000);
    }
  }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AutoLogout;
}
