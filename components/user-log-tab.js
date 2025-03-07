
document.addEventListener('DOMContentLoaded', function() {
  // Load the user log tab component
  fetch('components/user-log-tab.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('user-log-tab-container').innerHTML = html;
      
      // Setup log filters functionality
      const filterSelect = document.querySelector('.log-filters .select-control');
      const dateButtons = document.querySelectorAll('.date-range .btn');
      
      if (filterSelect) {
        filterSelect.addEventListener('change', function() {
          filterLogs(this.value);
        });
      }
      
      if (dateButtons.length) {
        dateButtons.forEach(button => {
          button.addEventListener('click', function() {
            // Remove active class from all buttons
            dateButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter logs by date range
            const range = this.textContent.trim().toLowerCase();
            filterLogsByDate(range);
          });
        });
      }
      
      // Handle load more button
      const loadMoreButton = document.querySelector('.load-more .btn');
      if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
          loadMoreLogs();
        });
      }
    })
    .catch(error => {
      console.error('Error loading user log tab component:', error);
    });
});

// Log filtering functions
function filterLogs(category) {
  console.log('Filtering logs by category:', category);
  // Implement actual filtering logic here
  // This would typically involve showing/hiding log entries based on their category
}

function filterLogsByDate(range) {
  console.log('Filtering logs by date range:', range);
  // Implement actual date filtering logic here
}

function loadMoreLogs() {
  // Simulate loading more logs
  const logEntries = document.querySelector('.log-entries');
  const loadingIndicator = document.createElement('div');
  loadingIndicator.classList.add('loading-indicator');
  loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading more entries...';
  
  // Append loading indicator
  logEntries.appendChild(loadingIndicator);
  
  // Simulate network delay
  setTimeout(() => {
    // Remove loading indicator
    loadingIndicator.remove();
    
    // Add new log entries
    const newEntries = [
      {
        icon: 'info',
        title: 'Settings Changed',
        time: '3 days ago',
        description: 'User changed notification settings'
      },
      {
        icon: 'success',
        title: 'Password Updated',
        time: '4 days ago',
        description: 'User successfully updated their password'
      },
      {
        icon: 'warning',
        title: 'New Login Location',
        time: '5 days ago',
        description: 'Login detected from a new location: New York, USA'
      }
    ];
    
    // Create and append new entries
    newEntries.forEach(entry => {
      const entryElement = document.createElement('div');
      entryElement.classList.add('log-entry');
      entryElement.innerHTML = `
        <div class="log-icon ${entry.icon}">
          <i class="fas fa-${entry.icon === 'info' ? 'info-circle' : entry.icon === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        </div>
        <div class="log-content">
          <div class="log-header">
            <h4>${entry.title}</h4>
            <span class="log-time">${entry.time}</span>
          </div>
          <p>${entry.description}</p>
        </div>
      `;
      
      logEntries.appendChild(entryElement);
    });
  }, 1000);
}
