function showMessage(message, type) {
  const msgBox = document.createElement("div");
  msgBox.className = `message-box ${type}`;
  msgBox.textContent = message;
  
  const formContainer = document.querySelector('.form-container');
  if (formContainer) {
    formContainer.appendChild(msgBox);
  } else {
    document.body.appendChild(msgBox);
  }
  
  setTimeout(() => {
    if (document.body.contains(msgBox)) msgBox.remove();
  }, 3000);
}

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPassword(password) {
  return password.length >= 6;
}

function checkAuthentication() {
  const isAuthenticated = localStorage.getItem("authenticated") === "true";
  const userName = localStorage.getItem("userName");
  
  const protectedContent = document.getElementById("protectedContent");
  const loginRequired = document.getElementById("loginRequired");
  
  if (protectedContent && loginRequired) {
    protectedContent.style.display = isAuthenticated ? "block" : "none";
    loginRequired.style.display = isAuthenticated ? "none" : "block";
  }
  
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  
  if ((loginForm || registerForm) && isAuthenticated) {
    window.location.href = "index.html";
  }
  
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.style.display = isAuthenticated ? "inline-block" : "none";
  }
  
  const userDisplay = document.getElementById("userDisplay");
  if (userDisplay && userName) {
    userDisplay.innerHTML = `<p>Welcome back, <strong>${userName}</strong>! 💕</p>`;
  }
}

function logout() {
  localStorage.removeItem("authenticated");
  localStorage.removeItem("userName");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userPassword");
  showMessage("Logged out successfully!", "success");
  checkAuthentication();
  
  if (window.location.pathname.includes("about.html") || 
      window.location.pathname.includes("projects.html") || 
      window.location.pathname.includes("contact.html")) {
    window.location.href = "index.html";
  }
}

document.addEventListener("DOMContentLoaded", function() {
  checkAuthentication();
  
  const visitorCount = document.getElementById("visitorCount");
  if (visitorCount) {
    if (!sessionStorage.getItem("visited")) {
      let count = localStorage.getItem("visitorCount") || 0;
      count = parseInt(count) + 1;
      localStorage.setItem("visitorCount", count);
      visitorCount.textContent = count;
      sessionStorage.setItem("visited", "true");
    } else {
      visitorCount.textContent = localStorage.getItem("visitorCount") || 0;
    }
  }
  
  const currentDate = document.getElementById("currentDate");
  if (currentDate) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = `📅 ${now.toLocaleDateString('en-US', options)}`;
  }
  
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const target = document.getElementById(targetId);
      if (target) {
        if (target.style.display === 'none' || target.style.display === '') {
          target.style.display = 'block';
          this.textContent = 'Hide ' + this.textContent.replace('Show ', '');
        } else {
          target.style.display = 'none';
          this.textContent = 'Show ' + this.textContent.replace('Hide ', '');
        }
      }
    });
  });
  
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      
      if (!isValidEmail(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }
      
      if (!isValidPassword(password)) {
        showMessage("Password must be at least 6 characters long.", "error");
        return;
      }
      
      const storedEmail = localStorage.getItem("userEmail");
      const storedPassword = localStorage.getItem("userPassword");
      const storedName = localStorage.getItem("userName");
      
      if ((storedEmail && storedEmail === email && storedPassword === password) || 
          (email === "test@example.com" && password === "password123")) {
        
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("userEmail", email);
        if (storedName) {
          localStorage.setItem("userName", storedName);
        } else {
          localStorage.setItem("userName", "Gail");
        }
        
        showMessage("Login successful! Redirecting...", "success");
        
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } else {
        showMessage("Invalid email or password. Try test@example.com / password123", "error");
      }
    });
  }
  
  const googleAuthBtn = document.getElementById("googleAuthBtn");
  if (googleAuthBtn) {
    googleAuthBtn.addEventListener("click", function() {
      showMessage("Opening Google login...", "success");
      
      setTimeout(() => {
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("userName", "Gail (Google)");
        localStorage.setItem("userEmail", "gail.google@gmail.com");
        
        showMessage("Google login successful! Redirecting...", "success");
        
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      }, 1500);
    });
  }
  
  const otpAuthBtn = document.getElementById("otpAuthBtn");
  if (otpAuthBtn) {
    otpAuthBtn.addEventListener("click", function() {
      const modalHtml = `
        <div class="overlay" id="otpOverlay"></div>
        <div class="otp-modal" id="otpModal">
          <div class="otp-content">
            <h3>📱 Enter OTP</h3>
            <p>A 6-digit code has been sent to your phone</p>
            <input type="text" id="otpInput" maxlength="6" placeholder="Enter 6-digit OTP" pattern="[0-9]{6}">
            <div class="otp-buttons">
              <button id="submitOtpBtn" class="btn">Verify</button>
              <button id="closeOtpBtn" class="toggle-btn">Cancel</button>
            </div>
            <p class="demo-hint">Demo: Use any 6-digit number</p>
          </div>
        </div>
      `;
      
      document.getElementById('otpOverlay')?.remove();
      document.getElementById('otpModal')?.remove();
      
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      
      document.getElementById("submitOtpBtn").addEventListener("click", function() {
        const otp = document.getElementById("otpInput").value;
        
        if (otp && otp.length === 6 && /^\d+$/.test(otp)) {
          localStorage.setItem("authenticated", "true");
          localStorage.setItem("userName", "Gail (OTP)");
          localStorage.setItem("userEmail", "gail.otp@example.com");
          
          showMessage("OTP verification successful!", "success");
          
          document.getElementById('otpOverlay')?.remove();
          document.getElementById('otpModal')?.remove();
          
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1500);
        } else {
          showMessage("Please enter a valid 6-digit code.", "error");
        }
      });
      
      document.getElementById("closeOtpBtn").addEventListener("click", function() {
        document.getElementById('otpOverlay')?.remove();
        document.getElementById('otpModal')?.remove();
      });
      
      document.getElementById("otpOverlay").addEventListener("click", function() {
        document.getElementById('otpOverlay')?.remove();
        document.getElementById('otpModal')?.remove();
      });
    });
  }
  
  const quickLoginForm = document.getElementById("quickLoginForm");
  if (quickLoginForm) {
    quickLoginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const email = document.getElementById("quickEmail").value;
      const password = document.getElementById("quickPassword").value;
      
      if (!isValidEmail(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }
      
      if (!isValidPassword(password)) {
        showMessage("Password must be at least 6 characters long.", "error");
        return;
      }
      
      const storedEmail = localStorage.getItem("userEmail");
      const storedPassword = localStorage.getItem("userPassword");
      
      if ((storedEmail && storedEmail === email && storedPassword === password) || 
          (email === "test@example.com" && password === "password123")) {
        
        localStorage.setItem("authenticated", "true");
        localStorage.setItem("userEmail", email);
        
        showMessage("Login successful! Redirecting...", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showMessage("Invalid email or password.", "error");
      }
    });
  }
  
  const togglePassword = document.getElementById("togglePassword");
  if (togglePassword) {
    togglePassword.addEventListener("change", function() {
      const passwordInput = document.getElementById("loginPassword");
      passwordInput.type = this.checked ? "text" : "password";
    });
  }
  
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function(e) {
      e.preventDefault();
      logout();
    });
  }
  
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("regConfirmPassword").value;
      
      if (!name) {
        showMessage("Please enter your name.", "error");
        return;
      }
      
      if (!isValidEmail(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
      }
      
      if (password.length < 6) {
        showMessage("Password must be at least 6 characters long.", "error");
        return;
      }
      
      if (password !== confirmPassword) {
        showMessage("Passwords do not match.", "error");
        return;
      }
      
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userPassword", password);
      
      showMessage("Registration successful! Please login.", "success");
      
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    });
  }
});