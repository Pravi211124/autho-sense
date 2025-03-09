
// This file will be used to add any specific functionality to the monitoring tab
console.log('Monitoring tab script loaded');

function initMonitoringTab() {
  console.log('Initializing monitoring tab functionality');
  
  // Get monitoring data buttons
  const startMonitoringBtn = document.getElementById('startMonitoring');
  const stopMonitoringBtn = document.getElementById('stopMonitoring');
  
  if (startMonitoringBtn) {
    startMonitoringBtn.addEventListener('click', function() {
      console.log('Starting monitoring...');
      document.querySelector('.monitoring-status').textContent = 'Active';
      document.querySelector('.status-indicator').classList.remove('inactive');
      document.querySelector('.status-indicator').classList.add('active');
    });
  }
  
  if (stopMonitoringBtn) {
    stopMonitoringBtn.addEventListener('click', function() {
      console.log('Stopping monitoring...');
      document.querySelector('.monitoring-status').textContent = 'Inactive';
      document.querySelector('.status-indicator').classList.remove('active');
      document.querySelector('.status-indicator').classList.add('inactive');
    });
  }
}
