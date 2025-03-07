document.addEventListener('DOMContentLoaded', function() {
  // DateTime display
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Initialize UI handlers
  initFaceDetection();
  initVoiceVisualization();
  initAutoLogoutSettings();
  initTabNavigation();
  
  // Initialize auto logout
  const autoLogout = new AutoLogout({
    enabledByDefault: true,
    timeoutDuration: 10000, // 10 seconds default
    showWarning: true,
    onLogout: () => {
      // Redirect to login page
      window.location.href = 'index.html';
    }
  });
  
  // Start face detection when button is clicked
  document.getElementById('startFaceAuth').addEventListener('click', function() {
    startFaceDetection(autoLogout);
  });
  
  // Run verification button
  document.getElementById('runVerification').addEventListener('click', function() {
    runFullVerification(autoLogout);
  });
});

// Tab navigation functionality
function initTabNavigation() {
  const tabContents = {
    'home-tab': document.getElementById('home-content'),
    'user-log-tab': document.getElementById('user-log-content'),
    'settings-tab': document.getElementById('settings-content')
  };
  
  // Set default active tab
  showActiveTab('home-tab');
  
  // Add click event to tab links
  document.querySelectorAll('.sidebar-menu li a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.getAttribute('data-tab')) {
        e.preventDefault();
        const tabId = this.getAttribute('data-tab');
        showActiveTab(tabId);
      }
    });
  });
  
  function showActiveTab(tabId) {
    // Remove active class from all links
    document.querySelectorAll('.sidebar-menu li').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to current link
    const activeLink = document.querySelector(`.sidebar-menu li a[data-tab="${tabId}"]`);
    if (activeLink) {
      activeLink.closest('li').classList.add('active');
    }
    
    // Hide all tab contents
    Object.values(tabContents).forEach(content => {
      if (content) content.style.display = 'none';
    });
    
    // Show active tab content
    if (tabContents[tabId]) {
      tabContents[tabId].style.display = 'block';
    }
  }
}

// Initialize auto logout settings UI
function initAutoLogoutSettings() {
  const enableAutoLogout = document.getElementById('enableAutoLogout');
  const autoLogoutDuration = document.getElementById('autoLogoutDuration');
  const enableLogoutWarning = document.getElementById('enableLogoutWarning');
  
  if (enableAutoLogout) {
    enableAutoLogout.addEventListener('change', function() {
      if (window.autoLogoutInstance) {
        window.autoLogoutInstance.setEnabled(this.checked);
      }
    });
  }
  
  if (autoLogoutDuration) {
    autoLogoutDuration.addEventListener('change', function() {
      if (window.autoLogoutInstance) {
        window.autoLogoutInstance.setTimeout(parseInt(this.value));
      }
    });
  }
  
  if (enableLogoutWarning) {
    enableLogoutWarning.addEventListener('change', function() {
      if (window.autoLogoutInstance) {
        window.autoLogoutInstance.setShowWarning(this.checked);
      }
    });
  }
}

// Update date and time in the header
function updateDateTime() {
  const dateElement = document.getElementById('current-date');
  const timeElement = document.getElementById('current-time');
  
  if (dateElement && timeElement) {
    const now = new Date();
    
    // Format date: Weekday, Month Day, Year
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time: Hours:Minutes:Seconds AM/PM
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
  }
}

// Initialize face detection
function initFaceDetection() {
  const faceVideo = document.getElementById('faceVideo');
  const faceStatus = document.getElementById('faceStatus');
  
  if (!faceVideo || !faceStatus) return;
  
  // Check for webcam access
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    faceStatus.textContent = 'Camera Ready';
  } else {
    faceStatus.textContent = 'Camera Not Available';
  }
}

// Start face detection
function startFaceDetection(autoLogoutInstance) {
  const faceVideo = document.getElementById('faceVideo');
  const faceStatus = document.getElementById('faceStatus');
  const faceConfidence = document.getElementById('faceConfidence');
  const faceConfidenceValue = document.getElementById('faceConfidenceValue');
  
  if (!faceVideo || !faceStatus) return;
  
  if (window.faceStream) {
    // Already running
    return;
  }
  
  // Access webcam
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      window.faceStream = stream;
      faceVideo.srcObject = stream;
      
      faceStatus.textContent = 'Detecting...';
      
      // Store the auto logout instance
      window.autoLogoutInstance = autoLogoutInstance;
      
      // Simulate face detection (in a real app, this would use a face detection library)
      simulateFaceDetection(faceConfidence, faceConfidenceValue, autoLogoutInstance);
    })
    .catch(function(error) {
      console.error('Error accessing webcam:', error);
      faceStatus.textContent = 'Camera Error';
    });
}

// Simulate face detection with random confidence values
function simulateFaceDetection(confidenceElement, confidenceValueElement, autoLogoutInstance) {
  if (!confidenceElement || !confidenceValueElement) return;
  
  // Create countdown element if it doesn't exist
  let countdownElement = document.getElementById('autoLogoutCountdown');
  if (!countdownElement) {
    countdownElement = document.createElement('div');
    countdownElement.id = 'autoLogoutCountdown';
    countdownElement.className = 'auto-logout-countdown';
    document.querySelector('.face-monitor').appendChild(countdownElement);
  }
  
  // Start the detection loop
  let faceDetected = true;
  const detectionInterval = setInterval(() => {
    // Random detection with 80% chance of seeing a face
    faceDetected = Math.random() > 0.2;
    
    // Update confidence display
    const confidenceValue = faceDetected ? Math.floor(75 + Math.random() * 25) : Math.floor(Math.random() * 40);
    confidenceElement.style.width = `${confidenceValue}%`;
    confidenceValueElement.textContent = `${confidenceValue}%`;
    
    // Update face status
    const faceStatus = document.getElementById('faceStatus');
    if (faceStatus) {
      faceStatus.textContent = faceDetected ? 'Face Detected' : 'No Face Detected';
      faceStatus.style.color = faceDetected ? 'var(--success)' : 'var(--danger)';
    }
    
    // Update auto logout instance with face detection status
    if (autoLogoutInstance) {
      autoLogoutInstance.updateUserPresence(faceDetected);
      
      // Update countdown display
      if (!faceDetected && autoLogoutInstance.isEnabled()) {
        const remainingTime = autoLogoutInstance.getRemainingTime();
        const totalTime = autoLogoutInstance.getTimeout();
        
        // Only show countdown if there's remaining time
        if (remainingTime > 0) {
          countdownElement.style.display = 'block';
          countdownElement.innerHTML = `<i class="fas fa-clock"></i> Auto logout in: ${Math.ceil(remainingTime / 1000)}s`;
          
          // Update progress bar
          const percentage = (remainingTime / totalTime) * 100;
          countdownElement.style.background = `linear-gradient(to right, var(--danger) ${percentage}%, transparent ${percentage}%)`;
        } else {
          countdownElement.style.display = 'none';
        }
      } else {
        countdownElement.style.display = 'none';
      }
    }
  }, 1000);
  
  // Store interval for cleanup
  window.faceDetectionInterval = detectionInterval;
}

// Voice visualization
function initVoiceVisualization() {
  const voiceCanvas = document.getElementById('voiceCanvas');
  const voiceStatus = document.getElementById('voiceStatus');
  
  if (!voiceCanvas || !voiceStatus) return;
  
  const ctx = voiceCanvas.getContext('2d');
  voiceCanvas.width = voiceCanvas.offsetWidth;
  voiceCanvas.height = voiceCanvas.offsetHeight;
  
  // Draw initial state
  ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
  ctx.fillRect(0, 0, voiceCanvas.width, voiceCanvas.height);
}

// Run full verification
function runFullVerification(autoLogoutInstance) {
  // Start face detection if not already running
  if (!window.faceStream) {
    startFaceDetection(autoLogoutInstance);
  }
  
  // Update status card
  document.querySelector('.auth-status .status-text').textContent = 'Verifying...';
  document.querySelector('.auth-status .status-text').className = 'status-text warning';
  
  // Simulate verification process
  setTimeout(() => {
    document.querySelector('.auth-status .status-text').textContent = 'Verified';
    document.querySelector('.auth-status .status-text').className = 'status-text success';
    document.getElementById('last-verified-time').textContent = 'Just now';
    
    // Show success toast
    showToast('Verification Successful', 'Your identity has been confirmed.', 'success');
  }, 2000);
}

// Show toast notification
function showToast(title, message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-title">${title}</div>
    <div class="toast-message">${message}</div>
  `;
  
  document.body.appendChild(toast);
  
  // Animate in
  setTimeout(() => {
    toast.classList.add('visible');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
