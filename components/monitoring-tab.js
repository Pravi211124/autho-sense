
// Load the monitoring tab HTML content
document.addEventListener('DOMContentLoaded', function() {
  const monitoringTabContainer = document.getElementById('monitoring-tab-container');
  
  if (monitoringTabContainer) {
    // Load the HTML content
    fetch('components/monitoring-tab.html')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load monitoring tab: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        monitoringTabContainer.innerHTML = html;
        initMonitoringTab();
      })
      .catch(error => {
        console.error('Error loading monitoring tab:', error);
        monitoringTabContainer.innerHTML = '<div class="error-message">Error loading monitoring tab content.</div>';
      });
  }
});

function initMonitoringTab() {
  // Initialize monitoring tab functionality
  const runScanButton = document.querySelector('.monitoring-tab .btn-primary');
  const downloadReportButton = document.querySelector('.monitoring-tab .btn-outline');
  
  if (runScanButton) {
    runScanButton.addEventListener('click', function() {
      alert('Starting new security scan...');
      // Simulate scan running
      const scanBadge = document.querySelector('.monitoring-tab .badge.warning');
      if (scanBadge) {
        scanBadge.textContent = 'Scanning...';
        
        // Simulate scan completion after 2 seconds
        setTimeout(() => {
          scanBadge.textContent = '3 Issues Found';
        }, 2000);
      }
    });
  }
  
  if (downloadReportButton) {
    downloadReportButton.addEventListener('click', function() {
      alert('Downloading security report...');
      // In a real application, this would generate and download a report
    });
  }
  
  // Initialize fix buttons
  const fixButtons = document.querySelectorAll('.monitoring-tab .scan-results .btn');
  fixButtons.forEach(button => {
    button.addEventListener('click', function() {
      const issue = this.closest('li').querySelector('.result-details h4').textContent;
      alert(`Attempting to fix issue: ${issue}`);
      // In a real application, this would start the fix process
    });
  });
}
