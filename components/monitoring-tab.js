
// Load monitoring tab component
document.addEventListener('DOMContentLoaded', function() {
  // Load the monitoring tab content
  const monitoringTabContainer = document.getElementById('monitoring-tab-container');
  
  if (monitoringTabContainer) {
    fetch('components/monitoring-tab.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        monitoringTabContainer.innerHTML = data;
        initializeMonitoringTab();
      })
      .catch(error => {
        console.error('Error loading monitoring tab:', error);
        monitoringTabContainer.innerHTML = '<div class="error-message">Failed to load monitoring content. Please try again later.</div>';
      });
  }
});

function initializeMonitoringTab() {
  // Add event listeners for monitoring tab buttons
  const runScanButton = document.querySelector('.action-buttons .btn-primary');
  if (runScanButton) {
    runScanButton.addEventListener('click', function() {
      showToast('Running new security scan...');
      runScanButton.disabled = true;
      runScanButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
      
      // Simulate scan completion after 3 seconds
      setTimeout(() => {
        runScanButton.disabled = false;
        runScanButton.innerHTML = '<i class="fas fa-sync-alt"></i> Run New Scan';
        showToast('Security scan completed successfully!');
      }, 3000);
    });
  }
  
  const downloadButton = document.querySelector('.action-buttons .btn-outline');
  if (downloadButton) {
    downloadButton.addEventListener('click', function() {
      showToast('Downloading security report...');
    });
  }
  
  // Add event listeners for fix buttons
  const fixButtons = document.querySelectorAll('.scan-results .btn-small');
  if (fixButtons) {
    fixButtons.forEach(button => {
      button.addEventListener('click', function() {
        const issue = this.closest('li').querySelector('h4').textContent;
        showToast(`Fixing issue: ${issue}`);
        this.disabled = true;
        this.textContent = 'Fixing...';
        
        // Simulate fix completion after 2 seconds
        setTimeout(() => {
          this.textContent = 'Fixed';
          this.disabled = true;
          this.className = 'btn btn-small btn-success';
        }, 2000);
      });
    });
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-title">Notification</div>
      <div class="toast-message">${message}</div>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
