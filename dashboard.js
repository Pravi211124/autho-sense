
document.addEventListener('DOMContentLoaded', function() {
  // Sidebar toggle on mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('open');
    });
  }
  
  // Logout button handler
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      const confirmLogout = confirm('Are you sure you want to log out?');
      
      if (confirmLogout) {
        window.location.href = 'index.html';
      }
    });
  }
  
  // Analytics chart initialization
  const chartCanvas = document.getElementById('authChart');
  
  if (chartCanvas && typeof Chart !== 'undefined') {
    const ctx = chartCanvas.getContext('2d');
    
    const authChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Face Authentication',
            data: [5, 7, 4, 6, 8, 3, 5],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Voice Authentication',
            data: [3, 5, 2, 4, 6, 2, 3],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Authentication Count'
            }
          }
        }
      }
    });
    
    // Handle timeframe buttons
    const timeframeButtons = document.querySelectorAll('.timeframe-btn');
    
    timeframeButtons.forEach(button => {
      button.addEventListener('click', function() {
        timeframeButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        const timeframe = this.dataset.timeframe;
        
        // Update chart data based on timeframe
        if (timeframe === 'weekly') {
          authChart.data.labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
          authChart.data.datasets[0].data = [5, 7, 4, 6, 8, 3, 5];
          authChart.data.datasets[1].data = [3, 5, 2, 4, 6, 2, 3];
        } else if (timeframe === 'monthly') {
          authChart.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
          authChart.data.datasets[0].data = [18, 25, 30, 22];
          authChart.data.datasets[1].data = [12, 18, 20, 15];
        }
        
        authChart.update();
      });
    });
  }
  
  // Handle notification button
  const notificationBtn = document.querySelector('.notification-btn');
  
  if (notificationBtn) {
    notificationBtn.addEventListener('click', function() {
      alert('Notifications feature will be implemented in the future');
    });
  }
  
  // Simulate periodic security checks
  function simulateSecurityCheck() {
    const securityIndicator = document.querySelector('.status-indicator');
    
    if (securityIndicator) {
      securityIndicator.classList.remove('secure');
      securityIndicator.classList.add('checking');
      securityIndicator.textContent = 'Checking...';
      
      setTimeout(function() {
        securityIndicator.classList.remove('checking');
        securityIndicator.classList.add('secure');
        securityIndicator.textContent = 'Secure';
      }, 2000);
    }
  }
  
  // Run security check every 5 minutes
  setInterval(simulateSecurityCheck, 300000);
  
  // Add a random activity to the log
  function addRandomActivity() {
    const activityList = document.querySelector('.activity-list');
    
    if (!activityList) return;
    
    const activities = [
      {
        type: 'success',
        title: 'Continuous Authentication',
        description: 'Face verification successful',
        device: 'MacBook Pro'
      },
      {
        type: 'success',
        title: 'Continuous Authentication',
        description: 'Voice verification successful',
        device: 'MacBook Pro'
      },
      {
        type: 'warning',
        title: 'Face Verification Delay',
        description: 'Poor lighting conditions detected',
        device: 'MacBook Pro'
      }
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <div class="activity-icon ${randomActivity.type}">
        <i class="fas fa-${randomActivity.type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      </div>
      <div class="activity-details">
        <h4>${randomActivity.title}</h4>
        <p>${randomActivity.description}</p>
        <span class="activity-time">Just now, ${timeString}</span>
      </div>
      <div class="activity-meta">
        <span class="activity-device">
          <i class="fas fa-laptop"></i> ${randomActivity.device}
        </span>
      </div>
    `;
    
    // Add to the beginning of the list
    activityList.prepend(activityItem);
    
    // Remove the last item if there are more than 4
    if (activityList.children.length > 4) {
      activityList.removeChild(activityList.lastElementChild);
    }
  }
  
  // Simulate random activities every 20-30 seconds
  function scheduleRandomActivity() {
    const randomDelay = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
    
    setTimeout(function() {
      addRandomActivity();
      scheduleRandomActivity();
    }, randomDelay);
  }
  
  // Start the random activity simulation
  scheduleRandomActivity();
});
