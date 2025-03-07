
document.addEventListener('DOMContentLoaded', function() {
  // Load the dashboard header component
  fetch('components/dashboard-header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('dashboard-header-container').innerHTML = html;
      
      // Initialize date and time display
      updateDateTime();
      setInterval(updateDateTime, 1000);
      
      // Handle verification button click
      const verifyButton = document.getElementById('runVerification');
      if (verifyButton) {
        verifyButton.addEventListener('click', function() {
          // Simulate verification process
          this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
          
          setTimeout(() => {
            this.innerHTML = '<i class="fas fa-sync-alt"></i> Verify Now';
            document.getElementById('last-verified-time').textContent = 'Just now';
            
            // Show success toast
            showToast('Verification Complete', 'Your identity has been successfully verified.', 'success');
          }, 2000);
        });
      }
    })
    .catch(error => {
      console.error('Error loading dashboard header component:', error);
    });
});

// Helper function to update date and time
function updateDateTime() {
  const dateElement = document.getElementById('current-date');
  const timeElement = document.getElementById('current-time');
  
  if (dateElement && timeElement) {
    const now = new Date();
    
    // Format date (e.g., Wed, Sep 15, 2023)
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time (e.g., 14:30:45)
    timeElement.textContent = now.toLocaleTimeString('en-US');
  }
}

// Helper function to show toast notifications
function showToast(title, message, type = 'info') {
  // Create toast element if it doesn't exist
  let toast = document.querySelector('.toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  // Set toast content and type
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    <div class="toast-message">${message}</div>
  `;
  
  // Set border color based on type
  if (type === 'success') {
    toast.style.borderLeftColor = 'var(--success)';
  } else if (type === 'warning') {
    toast.style.borderLeftColor = 'var(--warning)';
  } else if (type === 'error') {
    toast.style.borderLeftColor = 'var(--danger)';
  } else {
    toast.style.borderLeftColor = 'var(--info)';
  }
  
  // Show toast
  setTimeout(() => {
    toast.classList.add('visible');
  }, 100);
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3000);
}
