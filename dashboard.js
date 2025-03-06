
document.addEventListener('DOMContentLoaded', () => {
  // API URL (update this with your actual backend URL)
  const API_URL = 'http://localhost:5000';
  
  // DOM Elements
  const faceVideo = document.getElementById('faceVideo');
  const voiceCanvas = document.getElementById('voiceCanvas');
  const startFaceAuth = document.getElementById('startFaceAuth');
  const startVoiceAuth = document.getElementById('startVoiceAuth');
  const faceStatus = document.getElementById('faceStatus');
  const voiceStatus = document.getElementById('voiceStatus');
  const faceConfidence = document.getElementById('faceConfidence');
  const faceConfidenceValue = document.getElementById('faceConfidenceValue');
  const voiceConfidence = document.getElementById('voiceConfidence');
  const voiceConfidenceValue = document.getElementById('voiceConfidenceValue');
  const runVerification = document.getElementById('runVerification');
  const autoLogoutSettings = document.getElementById('autoLogoutSettings');
  const enableAutoLogout = document.getElementById('enableAutoLogout');
  const autoLogoutDuration = document.getElementById('autoLogoutDuration');
  const enableLogoutWarning = document.getElementById('enableLogoutWarning');
  const currentDate = document.getElementById('current-date');
  const currentTime = document.getElementById('current-time');
  const logoutButton = document.getElementById('logoutButton');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  const lastVerifiedTime = document.getElementById('last-verified-time');
  const sidebarAutoLogout = document.getElementById('sidebar-auto-logout');
  
  // State variables
  let stream = null;
  let faceInterval = null;
  let audioContext = null;
  let audioStream = null;
  let analyzer = null;
  let canvasContext = null;
  let sessionId = localStorage.getItem('sessionId');
  let username = localStorage.getItem('username');
  let autoLogout = null;
  
  // Initialize date and time
  updateDateTime();
  setInterval(updateDateTime, 1000);
  
  // Set the year in the footer
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  
  // Initialize AutoLogout
  initAutoLogout();
  
  // Check if we have session info
  if (!sessionId || !username) {
    // Redirect to login
    window.location.href = 'index.html';
  }
  
  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
  
  // Logout button
  logoutButton.addEventListener('click', () => {
    logout();
  });
  
  // Auto Logout Settings
  sidebarAutoLogout.addEventListener('click', (e) => {
    e.preventDefault();
    autoLogoutSettings.scrollIntoView({ behavior: 'smooth' });
  });
  
  enableAutoLogout.addEventListener('change', () => {
    autoLogout.setEnabled(enableAutoLogout.checked);
  });
  
  autoLogoutDuration.addEventListener('change', () => {
    autoLogout.setTimeout(parseInt(autoLogoutDuration.value));
  });
  
  enableLogoutWarning.addEventListener('change', () => {
    autoLogout.setWarning(enableLogoutWarning.checked);
  });
  
  // Start Face Authentication
  startFaceAuth.addEventListener('click', async () => {
    if (stream) {
      stopFaceAuth();
      return;
    }
    
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      faceVideo.srcObject = stream;
      startFaceAuth.innerHTML = '<i class="fas fa-stop"></i> Stop';
      faceStatus.textContent = 'Active';
      faceStatus.parentElement.querySelector('.indicator-dot').classList.add('active');
      
      // Start periodic face verification
      faceInterval = setInterval(captureAndVerifyFace, 2000);
    } catch (error) {
      console.error('Error accessing camera:', error);
      faceStatus.textContent = 'Camera Error';
    }
  });
  
  // Start Voice Authentication
  startVoiceAuth.addEventListener('click', async () => {
    if (audioContext) {
      stopVoiceAuth();
      return;
    }
    
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio visualization
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(audioStream);
      analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      
      canvasContext = voiceCanvas.getContext('2d');
      voiceCanvas.width = voiceCanvas.clientWidth;
      voiceCanvas.height = voiceCanvas.clientHeight;
      
      startVoiceAuth.innerHTML = '<i class="fas fa-stop"></i> Stop';
      voiceStatus.textContent = 'Active';
      voiceStatus.parentElement.querySelector('.indicator-dot').classList.add('active');
      
      // Start audio visualization
      visualizeAudio();
      
      // Simulate voice verification
      setTimeout(() => {
        const confidence = Math.random() * 0.3 + 0.7; // Random between 70% and 100%
        updateVoiceConfidence(confidence);
      }, 1500);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      voiceStatus.textContent = 'Microphone Error';
    }
  });
  
  // Run manual verification
  runVerification.addEventListener('click', () => {
    if (!stream) {
      startFaceAuth.click();
    } else {
      captureAndVerifyFace();
    }
    
    lastVerifiedTime.textContent = 'Just now';
  });
  
  // Capture and verify face
  async function captureAndVerifyFace() {
    if (!stream) return;
    
    // Create a canvas to capture the video frame
    const canvas = document.createElement('canvas');
    canvas.width = faceVideo.videoWidth;
    canvas.height = faceVideo.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(faceVideo, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to base64 image
    const imageBase64 = canvas.toDataURL('image/jpeg');
    
    try {
      const response = await fetch(`${API_URL}/verify_face`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          faceData: imageBase64
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Authentication successful
        const confidence = 1 - data.confidence; // Convert distance to confidence
        updateFaceConfidence(confidence);
        
        // Update session ID if provided
        if (data.session_id) {
          sessionId = data.session_id;
          localStorage.setItem('sessionId', sessionId);
          
          // Update AutoLogout with new session info
          autoLogout.setSessionInfo(sessionId, username);
          autoLogout.resetTimer();
        }
        
        // Update last verified time
        lastVerifiedTime.textContent = 'Just now';
      } else {
        // Authentication failed
        updateFaceConfidence(0.2); // Low confidence
        console.error('Face verification failed:', data.message);
      }
    } catch (error) {
      console.error('Error verifying face:', error);
      updateFaceConfidence(0);
    }
  }
  
  // Update face confidence display
  function updateFaceConfidence(value) {
    // Ensure value is between 0 and 1
    value = Math.max(0, Math.min(1, value));
    
    // Update UI
    const percentage = Math.round(value * 100);
    faceConfidence.style.width = `${percentage}%`;
    faceConfidenceValue.textContent = `${percentage}%`;
    
    // Update face confidence color
    if (percentage < 40) {
      faceConfidence.className = 'confidence-fill danger';
    } else if (percentage < 70) {
      faceConfidence.className = 'confidence-fill warning';
    } else {
      faceConfidence.className = 'confidence-fill success';
    }
  }
  
  // Update voice confidence display
  function updateVoiceConfidence(value) {
    // Ensure value is between 0 and 1
    value = Math.max(0, Math.min(1, value));
    
    // Update UI
    const percentage = Math.round(value * 100);
    voiceConfidence.style.width = `${percentage}%`;
    voiceConfidenceValue.textContent = `${percentage}%`;
    
    // Update voice confidence color
    if (percentage < 40) {
      voiceConfidence.className = 'confidence-fill danger';
    } else if (percentage < 70) {
      voiceConfidence.className = 'confidence-fill warning';
    } else {
      voiceConfidence.className = 'confidence-fill success';
    }
  }
  
  // Stop face authentication
  function stopFaceAuth() {
    if (faceInterval) {
      clearInterval(faceInterval);
      faceInterval = null;
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    
    faceVideo.srcObject = null;
    startFaceAuth.innerHTML = '<i class="fas fa-play"></i> Start';
    faceStatus.textContent = 'Camera Off';
    faceStatus.parentElement.querySelector('.indicator-dot').classList.remove('active');
    updateFaceConfidence(0);
  }
  
  // Stop voice authentication
  function stopVoiceAuth() {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      audioStream = null;
    }
    
    if (audioContext) {
      audioContext.close();
      audioContext = null;
      analyzer = null;
    }
    
    startVoiceAuth.innerHTML = '<i class="fas fa-microphone"></i> Start';
    voiceStatus.textContent = 'Microphone Off';
    voiceStatus.parentElement.querySelector('.indicator-dot').classList.remove('active');
    
    // Clear canvas
    if (canvasContext) {
      canvasContext.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);
    }
  }
  
  // Visualize audio for voice authentication
  function visualizeAudio() {
    if (!analyzer || !canvasContext) return;
    
    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    function draw() {
      if (!analyzer) return;
      
      requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);
      
      canvasContext.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);
      
      const barWidth = (voiceCanvas.width / bufferLength) * 2.5;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 255 * voiceCanvas.height;
        
        // Set color based on frequency
        const hue = i / bufferLength * 360;
        canvasContext.fillStyle = `hsl(${hue}, 100%, 50%)`;
        
        canvasContext.fillRect(x, voiceCanvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
      }
    }
    
    draw();
  }
  
  // Update date and time
  function updateDateTime() {
    const now = new Date();
    currentDate.textContent = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    currentTime.textContent = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  }
  
  // Initialize AutoLogout
  function initAutoLogout() {
    autoLogout = new AutoLogout({
      timeout: parseInt(autoLogoutDuration.value),
      warningTime: 3000,
      showWarning: enableLogoutWarning.checked,
      enabled: enableAutoLogout.checked,
      apiUrl: API_URL,
      sessionId: sessionId,
      username: username,
      onWarning: showLogoutWarning,
      onLogout: logout,
      onReset: hideLogoutWarning
    });
  }
  
  // Show logout warning
  function showLogoutWarning() {
    // Create warning element if it doesn't exist
    if (!document.getElementById('logoutWarning')) {
      const warning = document.createElement('div');
      warning.id = 'logoutWarning';
      warning.className = 'logout-warning';
      warning.innerHTML = `
        <div class="logout-warning-content">
          <i class="fas fa-exclamation-triangle"></i>
          <p>You will be logged out due to inactivity</p>
          <button id="stayLoggedIn" class="btn btn-primary">Stay Logged In</button>
        </div>
      `;
      document.body.appendChild(warning);
      
      // Add event listener to stay logged in button
      document.getElementById('stayLoggedIn').addEventListener('click', () => {
        autoLogout.resetTimer();
      });
    }
    
    // Show warning
    document.getElementById('logoutWarning').classList.add('active');
  }
  
  // Hide logout warning
  function hideLogoutWarning() {
    const warning = document.getElementById('logoutWarning');
    if (warning) {
      warning.classList.remove('active');
    }
  }
  
  // Logout function
  function logout() {
    // Clear local storage
    localStorage.removeItem('sessionId');
    localStorage.removeItem('username');
    
    // Stop all streams
    stopFaceAuth();
    stopVoiceAuth();
    
    // Redirect to login page
    window.location.href = 'index.html';
  }
});
