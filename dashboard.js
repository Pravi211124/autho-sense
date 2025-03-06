
document.addEventListener('DOMContentLoaded', function() {
  // Initialize date and time
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Set current year in footer
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  // Logout button functionality
  const logoutButton = document.getElementById('logoutButton');
  if (logoutButton) {
    logoutButton.addEventListener('click', function() {
      window.location.href = 'index.html';
    });
  }
  
  // Face authentication setup
  const faceVideo = document.getElementById('faceVideo');
  const startFaceAuthButton = document.getElementById('startFaceAuth');
  const faceStatus = document.getElementById('faceStatus');
  const faceConfidence = document.getElementById('faceConfidence');
  const faceConfidenceValue = document.getElementById('faceConfidenceValue');
  
  let faceStream = null;
  let faceAuthActive = false;
  let faceDetectionInterval = null;
  
  // Voice authentication setup
  const voiceCanvas = document.getElementById('voiceCanvas');
  const startVoiceAuthButton = document.getElementById('startVoiceAuth');
  const voiceStatus = document.getElementById('voiceStatus');
  const voiceConfidence = document.getElementById('voiceConfidence');
  const voiceConfidenceValue = document.getElementById('voiceConfidenceValue');
  
  let voiceStream = null;
  let voiceAuthActive = false;
  let audioContext = null;
  let analyser = null;
  let animationFrameId = null;
  
  // Auto Logout functionality
  let autoLogout = null;
  
  // Initialize Auto Logout with settings from UI
  function initAutoLogout() {
    const enableAutoLogout = document.getElementById('enableAutoLogout').checked;
    const autoLogoutDuration = parseInt(document.getElementById('autoLogoutDuration').value, 10);
    const enableLogoutWarning = document.getElementById('enableLogoutWarning').checked;
    
    // Create new instance if needed
    if (!autoLogout) {
      autoLogout = new AutoLogout({
        timeoutDuration: autoLogoutDuration,
        warningDuration: enableLogoutWarning ? 5000 : 0,
        onLogout: () => {
          // Show logout notification
          const logoutNotification = document.createElement('div');
          logoutNotification.className = 'notification logout-notification';
          logoutNotification.innerHTML = `
            <div class="notification-content">
              <div class="notification-title">Auto Logout</div>
              <div class="notification-message">You've been logged out due to inactivity</div>
            </div>
          `;
          document.body.appendChild(logoutNotification);
          
          // Redirect after a brief delay to show notification
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1500);
        },
        onWarning: () => {
          // Play a notification sound if warning is enabled
          if (enableLogoutWarning) {
            const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==');
            audio.play().catch(e => console.log('Audio play failed', e));
          }
        }
      });
    } else {
      // Update settings for existing instance
      autoLogout.timeoutDuration = autoLogoutDuration;
      autoLogout.warningDuration = enableLogoutWarning ? 5000 : 0;
    }
    
    // Start or stop monitoring based on settings
    if (enableAutoLogout && faceAuthActive) {
      autoLogout.startMonitoring();
    } else if (autoLogout.monitoring) {
      autoLogout.stopMonitoring();
    }
  }
  
  // Auto Logout settings change handlers
  document.getElementById('enableAutoLogout').addEventListener('change', initAutoLogout);
  document.getElementById('autoLogoutDuration').addEventListener('change', initAutoLogout);
  document.getElementById('enableLogoutWarning').addEventListener('change', initAutoLogout);
  
  // Face authentication
  if (startFaceAuthButton) {
    startFaceAuthButton.addEventListener('click', async function() {
      if (faceAuthActive) {
        // Stop face authentication
        if (faceStream) {
          faceStream.getTracks().forEach(track => track.stop());
          faceStream = null;
        }
        
        if (faceDetectionInterval) {
          clearInterval(faceDetectionInterval);
          faceDetectionInterval = null;
        }
        
        faceAuthActive = false;
        faceStatus.textContent = 'Camera Off';
        faceStatus.parentElement.parentElement.classList.remove('active');
        startFaceAuthButton.innerHTML = '<i class="fas fa-play"></i> Start';
        
        // Stop auto logout monitoring if face auth is stopped
        if (autoLogout && autoLogout.monitoring) {
          autoLogout.stopMonitoring();
        }
      } else {
        // Start face authentication
        try {
          faceStream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            } 
          });
          
          if (faceVideo) {
            faceVideo.srcObject = faceStream;
          }
          
          faceAuthActive = true;
          faceStatus.textContent = 'Authenticating...';
          faceStatus.parentElement.parentElement.classList.add('active');
          startFaceAuthButton.innerHTML = '<i class="fas fa-stop"></i> Stop';
          
          // Simulate face detection (in a real app, this would use a face detection library)
          let consecutiveNoFaceFrames = 0;
          faceDetectionInterval = setInterval(() => {
            // Simulate face detection with random confidence
            // In a real app, this would use a real face detection algorithm
            const faceDetected = Math.random() > 0.2; // 80% chance of detecting a face
            
            if (faceDetected) {
              consecutiveNoFaceFrames = 0;
              const confidenceScore = 70 + Math.random() * 30; // Random between 70-100
              faceConfidence.style.width = confidenceScore + '%';
              faceConfidenceValue.textContent = Math.round(confidenceScore) + '%';
              
              // Update status
              faceStatus.textContent = 'Face Detected';
              faceStatus.parentElement.parentElement.classList.add('success');
              faceStatus.parentElement.parentElement.classList.remove('warning', 'danger');
              
              // Update last verified time
              document.getElementById('last-verified-time').textContent = 'Just now';
              
              // Update auto logout - user is present
              if (autoLogout) {
                autoLogout.userDetected();
              }
            } else {
              consecutiveNoFaceFrames++;
              
              if (consecutiveNoFaceFrames >= 3) {
                // No face for several consecutive frames
                const confidenceScore = Math.max(0, 70 - (consecutiveNoFaceFrames * 10));
                faceConfidence.style.width = confidenceScore + '%';
                faceConfidenceValue.textContent = Math.round(confidenceScore) + '%';
                
                // Update status based on how long no face has been detected
                if (consecutiveNoFaceFrames >= 10) {
                  faceStatus.textContent = 'No Face Detected!';
                  faceStatus.parentElement.parentElement.classList.add('danger');
                  faceStatus.parentElement.parentElement.classList.remove('success', 'warning');
                } else if (consecutiveNoFaceFrames >= 5) {
                  faceStatus.textContent = 'Face Lost';
                  faceStatus.parentElement.parentElement.classList.add('warning');
                  faceStatus.parentElement.parentElement.classList.remove('success', 'danger');
                }
                
                // Update auto logout - user is absent
                if (autoLogout) {
                  autoLogout.userAbsent();
                }
              }
            }
          }, 1000);
          
          // Initialize auto logout if enabled
          if (document.getElementById('enableAutoLogout').checked) {
            initAutoLogout();
          }
        } catch (error) {
          console.error('Error accessing the camera:', error);
          alert('Unable to access the camera. Please make sure you have granted camera permissions.');
        }
      }
    });
  }
  
  // Voice authentication
  if (startVoiceAuthButton) {
    startVoiceAuthButton.addEventListener('click', async function() {
      if (voiceAuthActive) {
        // Stop voice authentication
        if (voiceStream) {
          voiceStream.getTracks().forEach(track => track.stop());
          voiceStream = null;
        }
        
        if (audioContext) {
          audioContext.close();
          audioContext = null;
        }
        
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        
        voiceAuthActive = false;
        voiceStatus.textContent = 'Microphone Off';
        voiceStatus.parentElement.parentElement.classList.remove('active');
        startVoiceAuthButton.innerHTML = '<i class="fas fa-microphone"></i> Start';
      } else {
        // Start voice authentication
        try {
          voiceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          const microphone = audioContext.createMediaStreamSource(voiceStream);
          microphone.connect(analyser);
          
          analyser.fftSize = 256;
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          const canvas = voiceCanvas;
          const canvasCtx = canvas.getContext('2d');
          canvas.width = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
          
          function drawVoiceVisualization() {
            animationFrameId = requestAnimationFrame(drawVoiceVisualization);
            
            analyser.getByteFrequencyData(dataArray);
            
            canvasCtx.fillStyle = 'rgb(20, 20, 30)';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;
            
            // Calculate average volume level for voice detection
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const average = sum / bufferLength;
            
            // Update voice confidence based on volume
            const confidenceScore = Math.min(100, average * 1.5);
            voiceConfidence.style.width = confidenceScore + '%';
            voiceConfidenceValue.textContent = Math.round(confidenceScore) + '%';
            
            // Update status based on confidence
            if (confidenceScore > 60) {
              voiceStatus.textContent = 'Voice Detected';
              voiceStatus.parentElement.parentElement.classList.add('success');
              voiceStatus.parentElement.parentElement.classList.remove('warning', 'danger');
            } else if (confidenceScore > 30) {
              voiceStatus.textContent = 'Low Voice';
              voiceStatus.parentElement.parentElement.classList.add('warning');
              voiceStatus.parentElement.parentElement.classList.remove('success', 'danger');
            } else {
              voiceStatus.textContent = 'No Voice';
              voiceStatus.parentElement.parentElement.classList.add('danger');
              voiceStatus.parentElement.parentElement.classList.remove('success', 'warning');
            }
            
            // Draw the visualization bars
            for (let i = 0; i < bufferLength; i++) {
              barHeight = dataArray[i] / 2;
              
              canvasCtx.fillStyle = `rgb(${Math.min(255, barHeight + 100)}, ${Math.min(255, barHeight * 2)}, 255)`;
              canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
              
              x += barWidth + 1;
            }
          }
          
          drawVoiceVisualization();
          
          voiceAuthActive = true;
          voiceStatus.textContent = 'Listening...';
          voiceStatus.parentElement.parentElement.classList.add('active');
          startVoiceAuthButton.innerHTML = '<i class="fas fa-stop"></i> Stop';
        } catch (error) {
          console.error('Error accessing the microphone:', error);
          alert('Unable to access the microphone. Please make sure you have granted microphone permissions.');
        }
      }
    });
  }
  
  // "Run Verification" button
  const runVerificationButton = document.getElementById('runVerification');
  if (runVerificationButton) {
    runVerificationButton.addEventListener('click', function() {
      // Simulate a verification process
      runVerificationButton.disabled = true;
      runVerificationButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
      
      setTimeout(() => {
        // Update last verified time
        document.getElementById('last-verified-time').textContent = 'Just now';
        
        // Update UI
        runVerificationButton.disabled = false;
        runVerificationButton.innerHTML = '<i class="fas fa-sync-alt"></i> Verify Now';
        
        // Show a toast notification
        showNotification('Verification Complete', 'Your identity has been successfully verified.', 'success');
      }, 2000);
    });
  }
  
  // Auto logout settings panel toggle
  const sidebarAutoLogout = document.getElementById('sidebar-auto-logout');
  const autoLogoutSettings = document.getElementById('autoLogoutSettings');
  
  if (sidebarAutoLogout && autoLogoutSettings) {
    sidebarAutoLogout.addEventListener('click', function(e) {
      e.preventDefault();
      autoLogoutSettings.classList.toggle('visible');
      
      // Scroll to settings if they're now visible
      if (autoLogoutSettings.classList.contains('visible')) {
        autoLogoutSettings.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

// Update date and time
function updateDateTime() {
  const now = new Date();
  
  // Update date
  const dateElement = document.getElementById('current-date');
  if (dateElement) {
    dateElement.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  // Update time
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    timeElement.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

// Show notification
function showNotification(title, message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}-notification`;
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-title">${title}</div>
      <div class="notification-message">${message}</div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Remove notification after a delay
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}
