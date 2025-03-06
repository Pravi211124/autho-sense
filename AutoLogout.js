
// Auto Logout Component
// This component monitors if the user is in front of the camera and logs them out automatically if not

class AutoLogout {
  constructor(options = {}) {
    this.timeoutDuration = options.timeoutDuration || 10000; // Default 10 seconds
    this.warningDuration = options.warningDuration || 5000; // Default 5 seconds warning before logout
    this.onLogout = options.onLogout || (() => window.location.href = 'index.html');
    this.onWarning = options.onWarning || (() => console.log('Warning: Auto logout soon'));
    this.checkInterval = options.checkInterval || 1000; // Check every second by default
    
    this.timer = null;
    this.warningTimer = null;
    this.monitoring = false;
    this.lastDetectedTime = Date.now();
  }

  // Start monitoring for user presence
  startMonitoring() {
    if (this.monitoring) return;
    
    this.monitoring = true;
    this.lastDetectedTime = Date.now();
    
    // Start checking at regular intervals
    this.timer = setInterval(() => {
      const timeSinceLastDetection = Date.now() - this.lastDetectedTime;
      
      // If user has been absent longer than warning threshold but less than timeout
      if (timeSinceLastDetection >= (this.timeoutDuration - this.warningDuration) && 
          timeSinceLastDetection < this.timeoutDuration && 
          !this.warningTimer) {
        this.triggerWarning();
      }
      
      // If user has been absent longer than timeout
      if (timeSinceLastDetection >= this.timeoutDuration) {
        this.logout();
      }
    }, this.checkInterval);
    
    console.log('AutoLogout monitoring started');
  }

  // Call this whenever user is detected
  userDetected() {
    this.lastDetectedTime = Date.now();
    
    // Clear any warning that might be active
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
      
      // Hide any warning UI
      const warningElement = document.getElementById('auto-logout-warning');
      if (warningElement) {
        warningElement.style.display = 'none';
      }
    }
  }

  // Call this when user isn't detected
  userAbsent() {
    // We don't update lastDetectedTime here, as that's what triggers our logout
  }

  // Trigger warning before logout
  triggerWarning() {
    this.onWarning();
    
    // Create a toast notification if it doesn't exist
    let warningElement = document.getElementById('auto-logout-warning');
    if (!warningElement) {
      warningElement = document.createElement('div');
      warningElement.id = 'auto-logout-warning';
      warningElement.className = 'auto-logout-warning';
      warningElement.innerHTML = `
        <div class="warning-content">
          <div class="warning-title">Absence Detected</div>
          <div class="warning-message">You'll be logged out in ${Math.ceil(this.warningDuration/1000)} seconds due to inactivity</div>
        </div>
      `;
      document.body.appendChild(warningElement);
    }
    
    warningElement.style.display = 'flex';
    
    // Remove the warning if user comes back before timeout
    this.warningTimer = setTimeout(() => {
      this.warningTimer = null;
    }, this.warningDuration);
  }

  // Logout the user
  logout() {
    this.stopMonitoring();
    this.onLogout();
  }

  // Stop monitoring
  stopMonitoring() {
    if (!this.monitoring) return;
    
    this.monitoring = false;
    
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = null;
    }
    
    console.log('AutoLogout monitoring stopped');
  }
}

// Make it available globally
window.AutoLogout = AutoLogout;
