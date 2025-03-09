
// Auto Logout functionality
window.AutoLogout = (function() {
  // Configuration
  let config = {
    enabled: true,
    timeout: 10000, // Default: 10 seconds
    showWarning: true,
    warningDuration: 10, // Warning countdown in seconds
    warningTimeout: null,
    logoutCallback: function() {
      alert('You have been automatically logged out due to inactivity.');
      window.location.href = 'index.html'; // Redirect to home page
    }
  };

  // DOM Elements
  let elements = {
    warningEl: null,
    countdownEl: null,
    stayLoggedInBtn: null,
    logoutNowBtn: null
  };

  // Internal state
  let state = {
    inactivityTimer: null,
    lastActivity: Date.now(),
    isWarningVisible: false
  };

  // Initialize auto-logout
  function init() {
    console.log('Initializing Auto Logout...');
    
    // Get DOM elements
    elements.warningEl = document.getElementById('autoLogoutWarning');
    elements.countdownEl = document.getElementById('logoutCountdown');
    elements.stayLoggedInBtn = document.getElementById('stayLoggedIn');
    elements.logoutNowBtn = document.getElementById('logoutNow');
    
    // Get settings from the UI if available
    initializeFromSettings();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start the inactivity timer
    resetInactivityTimer();
    
    console.log('Auto Logout initialized with timeout:', config.timeout, 'ms');
  }

  // Initialize from settings in the UI
  function initializeFromSettings() {
    // Check if settings elements exist in the DOM
    const enableAutoLogout = document.getElementById('enableAutoLogout');
    const autoLogoutDuration = document.getElementById('autoLogoutDuration');
    const enableLogoutWarning = document.getElementById('enableLogoutWarning');
    
    // Apply settings if they exist
    if (enableAutoLogout) {
      config.enabled = enableAutoLogout.checked;
      
      enableAutoLogout.addEventListener('change', function() {
        config.enabled = this.checked;
        if (config.enabled) {
          resetInactivityTimer();
        } else {
          clearTimeout(state.inactivityTimer);
        }
      });
    }
    
    if (autoLogoutDuration) {
      config.timeout = parseInt(autoLogoutDuration.value, 10);
      
      autoLogoutDuration.addEventListener('change', function() {
        config.timeout = parseInt(this.value, 10);
        resetInactivityTimer();
      });
    }
    
    if (enableLogoutWarning) {
      config.showWarning = enableLogoutWarning.checked;
      
      enableLogoutWarning.addEventListener('change', function() {
        config.showWarning = this.checked;
      });
    }
  }

  // Set up event listeners for user activity
  function setupEventListeners() {
    // Activity events
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, activityDetected);
    });
    
    // Warning action buttons
    if (elements.stayLoggedInBtn) {
      elements.stayLoggedInBtn.addEventListener('click', function() {
        hideWarning();
        resetInactivityTimer();
      });
    }
    
    if (elements.logoutNowBtn) {
      elements.logoutNowBtn.addEventListener('click', logoutNow);
    }
  }

  // Handle detected user activity
  function activityDetected() {
    state.lastActivity = Date.now();
    
    // If the warning is visible, hide it and reset the timer
    if (state.isWarningVisible) {
      hideWarning();
      resetInactivityTimer();
    }
  }

  // Reset the inactivity timer
  function resetInactivityTimer() {
    // Clear existing timer
    if (state.inactivityTimer) {
      clearTimeout(state.inactivityTimer);
    }
    
    // Don't set a new timer if auto-logout is disabled
    if (!config.enabled) return;
    
    // Set new timer
    state.inactivityTimer = setTimeout(function() {
      handleInactivity();
    }, config.timeout);
  }

  // Handle user inactivity
  function handleInactivity() {
    if (!config.enabled) return;
    
    if (config.showWarning) {
      showWarning();
    } else {
      logoutNow();
    }
  }

  // Show the warning message
  function showWarning() {
    if (!elements.warningEl || !elements.countdownEl) return;
    
    // Display the warning
    elements.warningEl.classList.add('visible');
    state.isWarningVisible = true;
    
    // Set the initial countdown value
    elements.countdownEl.textContent = config.warningDuration;
    
    // Start the countdown
    let secondsLeft = config.warningDuration;
    
    config.warningTimeout = setInterval(function() {
      secondsLeft--;
      
      if (elements.countdownEl) {
        elements.countdownEl.textContent = secondsLeft;
      }
      
      if (secondsLeft <= 0) {
        clearInterval(config.warningTimeout);
        logoutNow();
      }
    }, 1000);
  }

  // Hide the warning message
  function hideWarning() {
    if (!elements.warningEl) return;
    
    // Hide the warning
    elements.warningEl.classList.remove('visible');
    state.isWarningVisible = false;
    
    // Clear the countdown
    if (config.warningTimeout) {
      clearInterval(config.warningTimeout);
      config.warningTimeout = null;
    }
  }

  // Perform logout
  function logoutNow() {
    hideWarning();
    
    // Clear all timers
    if (state.inactivityTimer) {
      clearTimeout(state.inactivityTimer);
    }
    
    if (config.warningTimeout) {
      clearInterval(config.warningTimeout);
    }
    
    // Execute the logout callback
    if (typeof config.logoutCallback === 'function') {
      config.logoutCallback();
    }
  }

  // Initialize when the DOM is ready
  document.addEventListener('DOMContentLoaded', init);

  // Public API
  return {
    resetTimer: resetInactivityTimer,
    logoutNow: logoutNow,
    setEnabled: function(enabled) {
      config.enabled = enabled;
      if (enabled) {
        resetInactivityTimer();
      } else {
        clearTimeout(state.inactivityTimer);
      }
    },
    setTimeout: function(timeout) {
      config.timeout = timeout;
      resetInactivityTimer();
    },
    setWarningEnabled: function(enabled) {
      config.showWarning = enabled;
    }
  };
})();
