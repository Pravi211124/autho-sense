
document.addEventListener('DOMContentLoaded', function() {
  const monitoringTabContainer = document.getElementById('monitoring-tab-container');
  
  if (monitoringTabContainer) {
    // Fetch and load the monitoring tab HTML
    fetch('components/monitoring-tab.html')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load monitoring tab component');
        }
        return response.text();
      })
      .then(html => {
        monitoringTabContainer.innerHTML = html;
        
        // Initialize button functionality
        const runScanButton = monitoringTabContainer.querySelector('.btn-primary');
        const downloadReportButton = monitoringTabContainer.querySelector('.btn-outline');
        
        if (runScanButton) {
          runScanButton.addEventListener('click', function() {
            alert('Scanning website for security vulnerabilities...');
            // In a real app, this would trigger an actual scan
          });
        }
        
        if (downloadReportButton) {
          downloadReportButton.addEventListener('click', function() {
            alert('Downloading security report...');
            // In a real app, this would generate and download a report
          });
        }
        
        // Initialize fix/update buttons
        const fixButtons = monitoringTabContainer.querySelectorAll('.scan-results .btn');
        fixButtons.forEach(button => {
          button.addEventListener('click', function() {
            const issue = this.parentElement.querySelector('.result-details h4').textContent;
            alert(`Fixing issue: ${issue}`);
            // In a real app, this would trigger the fix process
          });
        });
      })
      .catch(error => {
        console.error('Error loading monitoring tab:', error);
        monitoringTabContainer.innerHTML = '<div class="error-message">Failed to load monitoring tab component</div>';
      });
  }
});
