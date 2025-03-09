
// Auto Logout Handler for continuous authentication
let inactivityTimer;
let countdownTimer;
let countdownSeconds = 10;
let isWarningDisplayed = false;

// Initialize auto logout when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initAutoLogout();
});

// Initialize the auto logout system
function initAutoLogout() {
  // Set the initial timer
  resetAutoLogoutTimer();
  
  // Add event listeners to detect user activity
  const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
  
  activityEvents.forEach(event => {
    document.addEventListener(event, handleUserActivity);
  });
}

// Handle any user activity
function handleUserActivity() {
  // Reset the timer whenever user is active
  if (!isWarningDisplayed) {
    resetAutoLogoutTimer();
  }
}

// Reset the auto logout timer
function resetAutoLogoutTimer() {
  // Clear existing timer
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  
  // Clear countdown if it's running
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownSeconds = 10;
  }
  
  // Hide warning if it's displayed
  const autoLogoutWarning = document.getElementById('autoLogoutWarning');
  if (autoLogoutWarning) {
    autoLogoutWarning.style.display = 'none';
  }
  isWarningDisplayed = false;
  
  // Set a new timer - 5 minutes of inactivity before showing warning
  inactivityTimer = setTimeout(showAutoLogoutWarning, 5 * 60 * 1000);
}

// Show the auto logout warning
function showAutoLogoutWarning() {
  const autoLogoutWarning = document.getElementById('autoLogoutWarning');
  const logoutCountdown = document.getElementById('logoutCountdown');
  
  if (autoLogoutWarning && logoutCountdown) {
    autoLogoutWarning.style.display = 'flex';
    isWarningDisplayed = true;
    
    // Update the countdown text
    logoutCountdown.textContent = countdownSeconds;
    
    // Start countdown timer
    countdownTimer = setInterval(function() {
      countdownSeconds--;
      logoutCountdown.textContent = countdownSeconds;
      
      if (countdownSeconds <= 0) {
        // Time's up, log the user out
        clearInterval(countdownTimer);
        performAutoLogout();
      }
    }, 1000);
  }
}

// Perform the actual logout
function performAutoLogout() {
  // In a real application, this would perform a proper logout
  alert('You have been automatically logged out due to inactivity.');
  window.location.href = 'index.html';
}

// Make functions available to other scripts
window.resetAutoLogoutTimer = resetAutoLogoutTimer;
window.performAutoLogout = performAutoLogout;
