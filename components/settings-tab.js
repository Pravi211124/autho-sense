
document.addEventListener('DOMContentLoaded', function() {
  // Load the settings tab component
  fetch('components/settings-tab.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('settings-tab-container').innerHTML = html;
      
      // Initialize settings functionality
      
      // Auto Logout toggle
      const enableAutoLogoutToggle = document.getElementById('enableAutoLogout');
      if (enableAutoLogoutToggle) {
        enableAutoLogoutToggle.addEventListener('change', function() {
          // Update auto logout settings
          if (window.autoLogoutManager) {
            window.autoLogoutManager.setEnabled(this.checked);
          }
          
          // Show notification
          showSettingsToast(
            this.checked ? 'Auto Logout Enabled' : 'Auto Logout Disabled',
            this.checked ? 'You will be logged out automatically when not present.' : 'Auto logout has been turned off.'
          );
        });
      }
      
      // Auto Logout Duration
      const autoLogoutDurationSelect = document.getElementById('autoLogoutDuration');
      if (autoLogoutDurationSelect) {
        autoLogoutDurationSelect.addEventListener('change', function() {
          const duration = parseInt(this.value);
          
          // Update auto logout settings
          if (window.autoLogoutManager) {
            window.autoLogoutManager.setTimeout(duration);
          }
          
          // Show notification
          const durationText = this.options[this.selectedIndex].text;
          showSettingsToast(
            'Timeout Updated',
            `Auto logout timeout set to ${durationText}.`
          );
        });
      }
      
      // Warning toggle
      const enableLogoutWarningToggle = document.getElementById('enableLogoutWarning');
      if (enableLogoutWarningToggle) {
        enableLogoutWarningToggle.addEventListener('change', function() {
          // Update auto logout settings
          if (window.autoLogoutManager) {
            window.autoLogoutManager.setWarningEnabled(this.checked);
          }
          
          // Show notification
          showSettingsToast(
            this.checked ? 'Logout Warning Enabled' : 'Logout Warning Disabled',
            this.checked ? 'You will be warned before being logged out.' : 'No warning will be shown before logout.'
          );
        });
      }
      
      // Save settings button
      const saveSettingsButton = document.querySelector('.settings-actions .btn-primary');
      if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function() {
          // Simulate saving settings
          this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
          
          setTimeout(() => {
            this.innerHTML = 'Save Settings';
            
            // Show success notification
            showSettingsToast(
              'Settings Saved',
              'Your settings have been saved successfully.'
            );
          }, 1000);
        });
      }
      
      // Reset to defaults button
      const resetSettingsButton = document.querySelector('.settings-actions .btn-outline');
      if (resetSettingsButton) {
        resetSettingsButton.addEventListener('click', function() {
          if (confirm('Are you sure you want to reset all settings to their default values?')) {
            // Reset form controls
            document.querySelectorAll('.settings-card input[type="checkbox"]').forEach(checkbox => {
              checkbox.checked = true;
            });
            
            if (autoLogoutDurationSelect) {
              autoLogoutDurationSelect.value = '10000';
            }
            
            // Show notification
            showSettingsToast(
              'Settings Reset',
              'All settings have been reset to their default values.'
            );
          }
        });
      }
    })
    .catch(error => {
      console.error('Error loading settings tab component:', error);
    });
});

// Helper function to show settings toast notifications
function showSettingsToast(title, message) {
  // Create toast element if it doesn't exist
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  // Set toast content
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    <div class="toast-message">${message}</div>
  `;
  
  // Set border color (blue for settings)
  toast.style.borderLeftColor = 'var(--primary)';
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('visible');
  }, 100);
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}
