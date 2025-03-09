
document.addEventListener('DOMContentLoaded', function() {
  // Load all components
  loadComponent('navbar-container', 'components/navbar.html', initNavbar);
  loadComponent('sidebar-container', 'components/sidebar.html', initSidebar);
  loadComponent('dashboard-header-container', 'components/dashboard-header.html', initDashboardHeader);
  loadComponent('home-tab-container', 'components/home-tab.html', initHomeTab);
  loadComponent('user-log-tab-container', 'components/user-log-tab.html');
  loadComponent('settings-tab-container', 'components/settings-tab.html');
  loadComponent('footer-container', 'components/footer.html');
  
  // Initialize auto logout
  initAutoLogout();
  
  // Initialize login modal functionality
  initLoginModal();
  
  // Initialize forgot password modal
  initForgotPasswordModal();
  
  // Update date and time
  updateDateTime();
  setInterval(updateDateTime, 1000);
});

function loadComponent(containerId, componentUrl, callback) {
  const container = document.getElementById(containerId);
  
  if (container) {
    fetch(componentUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load component: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        container.innerHTML = html;
        if (callback && typeof callback === 'function') {
          callback();
        }
      })
      .catch(error => {
        console.error(`Error loading ${componentUrl}:`, error);
        container.innerHTML = `<div class="error-message">Error loading content from ${componentUrl}</div>`;
      });
  }
}

function initNavbar() {
  const logoutBtn = document.getElementById('logoutBtn');
  const loginBtn = document.getElementById('loginBtn');
  
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      alert('Logging out...');
      // In a real app, this would handle the logout process
      window.location.href = 'index.html';
    });
  }
  
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      openLoginModal();
    });
  }
}

function initSidebar() {
  const tabButtons = document.querySelectorAll('.sidebar-nav a');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const tabId = this.getAttribute('data-tab');
      if (tabId) {
        switchTab(tabId);
      }
    });
  });
}

function initDashboardHeader() {
  const runVerificationBtn = document.getElementById('runVerification');
  const websiteMonitoringBtn = document.getElementById('websiteMonitoring');
  
  if (runVerificationBtn) {
    runVerificationBtn.addEventListener('click', function() {
      alert('Running verification...');
      // In a real app, this would trigger authentication verification
    });
  }
  
  if (websiteMonitoringBtn) {
    websiteMonitoringBtn.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      if (tabId) {
        switchTab(tabId);
      }
    });
  }
}

function initHomeTab() {
  const startFaceAuthBtn = document.getElementById('startFaceAuth');
  const startVoiceAuthBtn = document.getElementById('startVoiceAuth');
  
  if (startFaceAuthBtn) {
    startFaceAuthBtn.addEventListener('click', function() {
      toggleFaceAuth();
    });
  }
  
  if (startVoiceAuthBtn) {
    startVoiceAuthBtn.addEventListener('click', function() {
      toggleVoiceAuth();
    });
  }
  
  // Initialize the voice visualization canvas
  initVoiceCanvas();
}

function toggleFaceAuth() {
  const faceVideo = document.getElementById('faceVideo');
  const faceStatus = document.getElementById('faceStatus');
  const faceConfidence = document.getElementById('faceConfidence');
  const faceConfidenceValue = document.getElementById('faceConfidenceValue');
  const startFaceAuthBtn = document.getElementById('startFaceAuth');
  
  if (faceVideo && faceStatus && faceConfidence && faceConfidenceValue && startFaceAuthBtn) {
    if (faceStatus.textContent === 'Camera Off') {
      // Start face auth
      faceStatus.textContent = 'Verifying...';
      startFaceAuthBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
      
      // Simulate camera starting and verification
      setTimeout(() => {
        faceStatus.textContent = 'Verified';
        faceConfidence.style.width = '85%';
        faceConfidenceValue.textContent = '85%';
      }, 2000);
      
      // In a real app, this would start the camera and face verification
    } else {
      // Stop face auth
      faceStatus.textContent = 'Camera Off';
      startFaceAuthBtn.innerHTML = '<i class="fas fa-play"></i> Start';
      faceConfidence.style.width = '0%';
      faceConfidenceValue.textContent = '0%';
      
      // In a real app, this would stop the camera and face verification
    }
  }
}

function toggleVoiceAuth() {
  const voiceStatus = document.getElementById('voiceStatus');
  const voiceConfidence = document.getElementById('voiceConfidence');
  const voiceConfidenceValue = document.getElementById('voiceConfidenceValue');
  const startVoiceAuthBtn = document.getElementById('startVoiceAuth');
  
  if (voiceStatus && voiceConfidence && voiceConfidenceValue && startVoiceAuthBtn) {
    if (voiceStatus.textContent === 'Microphone Off') {
      // Start voice auth
      voiceStatus.textContent = 'Listening...';
      startVoiceAuthBtn.innerHTML = '<i class="fas fa-stop"></i> Stop';
      
      // Simulate microphone starting and voice verification
      startVoiceVisualization();
      
      setTimeout(() => {
        voiceStatus.textContent = 'Verified';
        voiceConfidence.style.width = '90%';
        voiceConfidenceValue.textContent = '90%';
      }, 2000);
      
      // In a real app, this would start the microphone and voice verification
    } else {
      // Stop voice auth
      voiceStatus.textContent = 'Microphone Off';
      startVoiceAuthBtn.innerHTML = '<i class="fas fa-microphone"></i> Start';
      voiceConfidence.style.width = '0%';
      voiceConfidenceValue.textContent = '0%';
      stopVoiceVisualization();
      
      // In a real app, this would stop the microphone and voice verification
    }
  }
}

let voiceVisualizationInterval;
let voiceCanvas;
let voiceCtx;

function initVoiceCanvas() {
  voiceCanvas = document.getElementById('voiceCanvas');
  if (voiceCanvas) {
    voiceCtx = voiceCanvas.getContext('2d');
    // Set canvas dimensions
    voiceCanvas.width = voiceCanvas.parentElement.clientWidth;
    voiceCanvas.height = voiceCanvas.parentElement.clientHeight;
  }
}

function startVoiceVisualization() {
  if (!voiceCanvas || !voiceCtx) return;
  
  // Clear previous interval if any
  if (voiceVisualizationInterval) {
    clearInterval(voiceVisualizationInterval);
  }
  
  // Draw voice visualization (simple waveform)
  voiceVisualizationInterval = setInterval(() => {
    voiceCtx.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);
    voiceCtx.beginPath();
    voiceCtx.strokeStyle = '#4CAF50';
    voiceCtx.lineWidth = 2;
    
    const centerY = voiceCanvas.height / 2;
    const amplitude = Math.random() * 20 + 10; // Random amplitude for visualization
    
    for (let x = 0; x < voiceCanvas.width; x += 2) {
      const y = centerY + Math.sin(x * 0.1 + Date.now() * 0.01) * amplitude;
      if (x === 0) {
        voiceCtx.moveTo(x, y);
      } else {
        voiceCtx.lineTo(x, y);
      }
    }
    
    voiceCtx.stroke();
  }, 50);
}

function stopVoiceVisualization() {
  if (voiceVisualizationInterval) {
    clearInterval(voiceVisualizationInterval);
    voiceVisualizationInterval = null;
  }
  
  if (voiceCanvas && voiceCtx) {
    voiceCtx.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);
  }
}

function switchTab(tabId) {
  // Hide all tabs
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show the selected tab
  const selectedTab = document.getElementById(`${tabId}-container`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Update active state in sidebar
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  sidebarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('active');
    }
  });
}

function updateDateTime() {
  const dateElement = document.getElementById('current-date');
  const timeElement = document.getElementById('current-time');
  
  if (dateElement && timeElement) {
    const now = new Date();
    
    // Format date: Monday, January 1, 2023
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('en-US', dateOptions);
    
    // Format time: 12:00:00 PM
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    timeElement.textContent = now.toLocaleTimeString('en-US', timeOptions);
  }
}

function openLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.style.display = 'flex';
  }
}

function closeLoginModal() {
  const loginModal = document.getElementById('loginModal');
  if (loginModal) {
    loginModal.style.display = 'none';
  }
}

function openForgotPasswordModal() {
  closeLoginModal();
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  if (forgotPasswordModal) {
    forgotPasswordModal.style.display = 'flex';
  }
}

function closeForgotPasswordModal() {
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  if (forgotPasswordModal) {
    forgotPasswordModal.style.display = 'none';
  }
}

function initLoginModal() {
  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Login successful!');
      closeLoginModal();
    });
  }
  
  if (closeModalBtns) {
    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        closeLoginModal();
        closeForgotPasswordModal();
      });
    });
  }
  
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openForgotPasswordModal();
    });
  }
  
  // Close modal when clicking outside of it
  window.addEventListener('click', function(e) {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });
}

function initForgotPasswordModal() {
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  const backToLoginBtn = document.getElementById('backToLoginBtn');
  
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Password reset link sent to your email!');
      closeForgotPasswordModal();
    });
  }
  
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closeForgotPasswordModal();
      openLoginModal();
    });
  }
  
  // Close modal when clicking outside of it
  window.addEventListener('click', function(e) {
    if (e.target === forgotPasswordModal) {
      closeForgotPasswordModal();
    }
  });
}

function initAutoLogout() {
  // Auto logout functionality is handled in AutoLogout.js
  const autoLogoutWarning = document.getElementById('autoLogoutWarning');
  const stayLoggedInBtn = document.getElementById('stayLoggedIn');
  const logoutNowBtn = document.getElementById('logoutNow');
  
  if (stayLoggedInBtn) {
    stayLoggedInBtn.addEventListener('click', function() {
      if (autoLogoutWarning) {
        autoLogoutWarning.style.display = 'none';
      }
      // Reset the auto logout timer
      if (typeof resetAutoLogoutTimer === 'function') {
        resetAutoLogoutTimer();
      }
    });
  }
  
  if (logoutNowBtn) {
    logoutNowBtn.addEventListener('click', function() {
      alert('Logging out now...');
      window.location.href = 'index.html';
    });
  }
}
