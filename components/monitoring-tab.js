
// Load monitoring tab component
document.addEventListener('DOMContentLoaded', function() {
  // Load the monitoring tab content
  const monitoringTabContainer = document.getElementById('monitoring-tab-container');
  
  fetch('components/monitoring-tab.html')
    .then(response => response.text())
    .then(data => {
      monitoringTabContainer.innerHTML = data;
      setupMonitoringCharts();
      initializeMonitoringTab();
    })
    .catch(error => console.error('Error loading monitoring tab:', error));
});

function setupMonitoringCharts() {
  // Check if Chart.js is loaded
  if (typeof Chart === 'undefined') {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = initCharts;
    document.head.appendChild(script);
  } else {
    initCharts();
  }
}

function initCharts() {
  if (document.getElementById('uptimeChart1')) {
    const ctx1 = document.getElementById('uptimeChart1').getContext('2d');
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
        datasets: [{
          label: 'Response Time (ms)',
          data: [95, 92, 90, 95, 88, 89, 89],
          borderColor: '#4CAF50',
          tension: 0.3,
          fill: false,
          pointBackgroundColor: '#4CAF50'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 80,
            max: 120
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
  
  if (document.getElementById('uptimeChart2')) {
    const ctx2 = document.getElementById('uptimeChart2').getContext('2d');
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ['6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago', 'Now'],
        datasets: [{
          label: 'Response Time (ms)',
          data: [98, 95, 96, 94, 93, 91, 92],
          borderColor: '#4CAF50',
          tension: 0.3,
          fill: false,
          pointBackgroundColor: '#4CAF50'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: false,
            min: 80,
            max: 120
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }
}

function initializeMonitoringTab() {
  // Add event listeners for monitoring tab buttons
  const detailButtons = document.querySelectorAll('.monitor-actions .btn-primary');
  if (detailButtons) {
    detailButtons.forEach(button => {
      button.addEventListener('click', function() {
        showToast('Website details view is coming soon!');
      });
    });
  }
  
  const alertButtons = document.querySelectorAll('.monitor-actions .btn-outline');
  if (alertButtons) {
    alertButtons.forEach(button => {
      button.addEventListener('click', function() {
        showToast('Alert configuration will be available soon!');
      });
    });
  }
  
  const addWebsiteButton = document.querySelector('.add-website .btn-primary');
  if (addWebsiteButton) {
    addWebsiteButton.addEventListener('click', function() {
      showToast('Add website functionality coming soon!');
    });
  }
  
  const runScanButton = document.querySelector('.scan-header .btn-outline');
  if (runScanButton) {
    runScanButton.addEventListener('click', function() {
      runScanButton.disabled = true;
      runScanButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
      
      // Simulate scan completion after 3 seconds
      setTimeout(() => {
        runScanButton.disabled = false;
        runScanButton.innerHTML = 'Run New Scan';
        showToast('Security scan completed successfully!');
      }, 3000);
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.querySelector('.toast-message');
  
  if (toast && toastMessage) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}
