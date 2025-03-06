
document.addEventListener('DOMContentLoaded', function() {
  // Step navigation handlers
  const accountForm = document.getElementById('accountForm');
  const faceAuthForm = document.getElementById('faceAuthForm');
  const voiceAuthForm = document.getElementById('voiceAuthForm');
  const completionForm = document.getElementById('completionForm');
  
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const step4 = document.getElementById('step4');
  
  const registerForm = document.getElementById('registerForm');
  const backToAccountBtn = document.getElementById('backToAccountBtn');
  const startFaceScanBtn = document.getElementById('startFaceScanBtn');
  const backToFaceBtn = document.getElementById('backToFaceBtn');
  const startVoiceRecordBtn = document.getElementById('startVoiceRecordBtn');
  const gotoDashboardBtn = document.getElementById('gotoDashboardBtn');
  
  // Password visibility toggle
  const togglePasswordButtons = document.querySelectorAll('.toggle-password');
  
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const input = this.previousElementSibling;
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
  
  // Form navigation
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Basic validation
      const fullName = document.getElementById('fullName').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const termsAgreement = document.getElementById('termsAgreement').checked;
      
      if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
      }
      
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      if (!termsAgreement) {
        alert('Please agree to the terms of service');
        return;
      }
      
      // Move to face auth step
      accountForm.classList.remove('active');
      faceAuthForm.classList.add('active');
      
      step1.classList.remove('active');
      step2.classList.add('active');
      
      // Start webcam for face auth
      setupFaceAuth();
    });
  }
  
  if (backToAccountBtn) {
    backToAccountBtn.addEventListener('click', function() {
      faceAuthForm.classList.remove('active');
      accountForm.classList.add('active');
      
      step2.classList.remove('active');
      step1.classList.add('active');
      
      // Stop webcam
      const video = document.getElementById('faceCam');
      if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    });
  }
  
  if (startFaceScanBtn) {
    startFaceScanBtn.addEventListener('click', function() {
      const faceStatus = document.getElementById('faceStatus');
      const button = this;
      
      if (button.innerText === 'Start Scan') {
        button.innerText = 'Scanning...';
        button.disabled = true;
        
        faceStatus.innerText = 'Scanning your face...';
        
        // Simulate face scanning process
        setTimeout(function() {
          faceStatus.innerText = 'Aligning facial features...';
        }, 1500);
        
        setTimeout(function() {
          faceStatus.innerText = 'Processing...';
        }, 3000);
        
        setTimeout(function() {
          faceStatus.innerText = 'Face scan complete!';
          button.innerText = 'Continue';
          button.disabled = false;
        }, 4500);
      } else {
        // Move to voice auth step
        faceAuthForm.classList.remove('active');
        voiceAuthForm.classList.add('active');
        
        step2.classList.remove('active');
        step3.classList.add('active');
        
        // Stop webcam
        const video = document.getElementById('faceCam');
        if (video && video.srcObject) {
          const tracks = video.srcObject.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    });
  }
  
  if (backToFaceBtn) {
    backToFaceBtn.addEventListener('click', function() {
      voiceAuthForm.classList.remove('active');
      faceAuthForm.classList.add('active');
      
      step3.classList.remove('active');
      step2.classList.add('active');
      
      // Reset voice recording UI
      const voiceWaves = document.getElementById('voiceWaves');
      const voiceStatus = document.getElementById('voiceStatus');
      const startVoiceRecordBtn = document.getElementById('startVoiceRecordBtn');
      
      voiceWaves.classList.remove('active');
      voiceStatus.innerText = 'Click to start recording';
      startVoiceRecordBtn.innerText = 'Start Recording';
      
      // Restart webcam for face auth
      setupFaceAuth();
    });
  }
  
  if (startVoiceRecordBtn) {
    startVoiceRecordBtn.addEventListener('click', function() {
      const voiceWaves = document.getElementById('voiceWaves');
      const voiceStatus = document.getElementById('voiceStatus');
      const button = this;
      
      if (button.innerText === 'Start Recording') {
        button.innerText = 'Recording...';
        button.disabled = true;
        
        voiceWaves.classList.add('active');
        voiceStatus.innerText = 'Recording in progress...';
        
        // Simulate voice recording process
        setTimeout(function() {
          voiceStatus.innerText = 'Analyzing voice patterns...';
        }, 2000);
        
        setTimeout(function() {
          voiceStatus.innerText = 'Verifying unique voice signature...';
        }, 4000);
        
        setTimeout(function() {
          voiceStatus.innerText = 'Voice authentication complete!';
          voiceWaves.classList.remove('active');
          button.innerText = 'Continue';
          button.disabled = false;
        }, 6000);
      } else {
        // Move to completion step
        voiceAuthForm.classList.remove('active');
        completionForm.classList.add('active');
        
        step3.classList.remove('active');
        step4.classList.add('active');
      }
    });
  }
  
  if (gotoDashboardBtn) {
    gotoDashboardBtn.addEventListener('click', function() {
      window.location.href = 'dashboard.html';
    });
  }
  
  // Login link handler
  const loginLink = document.getElementById('loginLink');
  
  if (loginLink) {
    loginLink.addEventListener('click', function(e) {
      e.preventDefault();
      alert('Login functionality will be implemented in the future');
    });
  }
  
  // Face authentication setup
  function setupFaceAuth() {
    const video = document.getElementById('faceCam');
    const faceStatus = document.getElementById('faceStatus');
    
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
          video.srcObject = stream;
          faceStatus.innerText = 'Camera ready. Click "Start Scan" to begin.';
        })
        .catch(function(error) {
          console.error('Cannot access webcam:', error);
          faceStatus.innerText = 'Camera access denied. Please enable camera permissions.';
        });
    } else {
      faceStatus.innerText = 'Your browser does not support webcam access.';
    }
  }
  
  // Set current year in footer
  const currentYearElements = document.querySelectorAll('#current-year');
  
  currentYearElements.forEach(function(element) {
    element.textContent = new Date().getFullYear();
  });
});
