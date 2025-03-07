
document.addEventListener('DOMContentLoaded', function() {
  // Load the home tab component
  fetch('components/home-tab.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('home-tab-container').innerHTML = html;
      
      // Initialize face authentication
      const startFaceAuthBtn = document.getElementById('startFaceAuth');
      if (startFaceAuthBtn) {
        startFaceAuthBtn.addEventListener('click', function() {
          const faceVideo = document.getElementById('faceVideo');
          const faceStatus = document.getElementById('faceStatus');
          const faceConfidence = document.getElementById('faceConfidence');
          const faceConfidenceValue = document.getElementById('faceConfidenceValue');
          
          if (faceVideo && faceStatus) {
            if (faceVideo.paused || faceVideo.ended) {
              // Start face authentication
              startFaceAuth(faceVideo, faceStatus, faceConfidence, faceConfidenceValue);
              this.innerHTML = '<i class="fas fa-stop"></i> Stop';
            } else {
              // Stop face authentication
              stopFaceAuth(faceVideo, faceStatus);
              this.innerHTML = '<i class="fas fa-play"></i> Start';
            }
          }
        });
      }
      
      // Initialize voice authentication
      const startVoiceAuthBtn = document.getElementById('startVoiceAuth');
      if (startVoiceAuthBtn) {
        startVoiceAuthBtn.addEventListener('click', function() {
          const voiceCanvas = document.getElementById('voiceCanvas');
          const voiceStatus = document.getElementById('voiceStatus');
          const voiceConfidence = document.getElementById('voiceConfidence');
          const voiceConfidenceValue = document.getElementById('voiceConfidenceValue');
          
          if (this.classList.contains('recording')) {
            // Stop voice recording
            stopVoiceAuth(voiceStatus);
            this.innerHTML = '<i class="fas fa-microphone"></i> Start';
            this.classList.remove('recording');
            
            // Reset visualization
            if (window.voiceVisualization) {
              cancelAnimationFrame(window.voiceVisualization);
              window.voiceVisualization = null;
            }
          } else {
            // Start voice recording
            startVoiceAuth(voiceCanvas, voiceStatus, voiceConfidence, voiceConfidenceValue);
            this.innerHTML = '<i class="fas fa-stop"></i> Stop';
            this.classList.add('recording');
          }
        });
      }
    })
    .catch(error => {
      console.error('Error loading home tab component:', error);
    });
});

// Face authentication functions
function startFaceAuth(videoElement, statusElement, confidenceElement, confidenceValueElement) {
  // Request camera access
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
      videoElement.srcObject = stream;
      videoElement.play();
      statusElement.textContent = 'Authenticating...';
      statusElement.parentElement.classList.add('active');
      
      // Simulate face authentication with increasing confidence
      let confidence = 0;
      const confidenceInterval = setInterval(() => {
        confidence += 5;
        if (confidence > 95) {
          confidence = 95; // Cap at 95%
          clearInterval(confidenceInterval);
          
          // Show success after a moment
          setTimeout(() => {
            statusElement.textContent = 'Authenticated';
            statusElement.parentElement.classList.add('success');
          }, 1000);
        }
        
        // Update confidence display
        confidenceElement.style.width = `${confidence}%`;
        confidenceValueElement.textContent = `${confidence}%`;
      }, 200);
      
      // Store interval ID for cleanup
      videoElement.dataset.confidenceInterval = confidenceInterval;
    })
    .catch(function(error) {
      console.error('Error accessing camera:', error);
      statusElement.textContent = 'Camera access denied';
    });
}

function stopFaceAuth(videoElement, statusElement) {
  // Stop camera stream
  if (videoElement.srcObject) {
    const tracks = videoElement.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElement.srcObject = null;
  }
  
  // Clear confidence interval if running
  if (videoElement.dataset.confidenceInterval) {
    clearInterval(videoElement.dataset.confidenceInterval);
    delete videoElement.dataset.confidenceInterval;
  }
  
  // Reset status
  statusElement.textContent = 'Camera Off';
  statusElement.parentElement.classList.remove('active', 'success');
}

// Voice authentication functions
function startVoiceAuth(canvasElement, statusElement, confidenceElement, confidenceValueElement) {
  // Set up canvas for visualization
  const ctx = canvasElement.getContext('2d');
  canvasElement.width = canvasElement.offsetWidth;
  canvasElement.height = canvasElement.offsetHeight;
  
  // Simulate microphone recording
  statusElement.textContent = 'Listening...';
  statusElement.parentElement.classList.add('active');
  
  // Simulate voice authentication with increasing confidence
  let confidence = 0;
  const confidenceInterval = setInterval(() => {
    confidence += 3;
    if (confidence > 85) {
      confidence = 85; // Cap at 85%
      clearInterval(confidenceInterval);
      
      // Show success after a moment
      setTimeout(() => {
        statusElement.textContent = 'Voice Verified';
        statusElement.parentElement.classList.add('success');
      }, 1500);
    }
    
    // Update confidence display
    confidenceElement.style.width = `${confidence}%`;
    confidenceValueElement.textContent = `${confidence}%`;
  }, 300);
  
  // Store interval ID
  window.voiceConfidenceInterval = confidenceInterval;
  
  // Animate voice waves
  function drawVoiceWaves() {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.5)';
    
    const centerY = canvasElement.height / 2;
    const numBars = 40;
    const barWidth = canvasElement.width / numBars;
    
    for (let i = 0; i < numBars; i++) {
      // Generate random height for each bar
      const height = Math.random() * 30 + 5;
      const x = i * barWidth;
      
      ctx.beginPath();
      ctx.roundRect(x, centerY - height/2, barWidth - 2, height, 2);
      ctx.fill();
    }
    
    window.voiceVisualization = requestAnimationFrame(drawVoiceWaves);
  }
  
  // Start visualization
  drawVoiceWaves();
}

function stopVoiceAuth(statusElement) {
  // Clear confidence interval
  if (window.voiceConfidenceInterval) {
    clearInterval(window.voiceConfidenceInterval);
    window.voiceConfidenceInterval = null;
  }
  
  // Reset status
  statusElement.textContent = 'Microphone Off';
  statusElement.parentElement.classList.remove('active', 'success');
}
