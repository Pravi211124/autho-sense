document.addEventListener('DOMContentLoaded', function() {
  // Initialize components by loading all component scripts
  
  // This is now handled by the individual component scripts which are loaded in the HTML
  
  // Initialize the Auto Logout functionality once face auth is active
  document.addEventListener('faceAuthStarted', function() {
    if (window.AutoLogout) {
      // Create auto logout instance
      window.autoLogoutManager = new AutoLogout({
        logoutFunction: function() {
          console.log('Auto logout triggered');
          window.location.href = 'index.html';
        },
        warningElement: document.getElementById('autoLogoutWarning'),
        countdownElement: document.getElementById('logoutCountdown'),
        timeout: 10000, // 10 seconds default
        showWarning: true
      });
      
      // Start monitoring
      window.autoLogoutManager.startMonitoring();
    }
  });
  
  // Simulate initial loading of the home tab (default tab)
  setTimeout(() => {
    // Trigger a click on the home tab link once everything is loaded
    const homeTabLink = document.querySelector('.sidebar-menu a[data-tab="home-tab"]');
    if (homeTabLink) {
      homeTabLink.click();
    }
  }, 500);
});
