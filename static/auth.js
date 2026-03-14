document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-form');

  // View Toggles
  document.getElementById('show-signup').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  });

  document.getElementById('show-login').addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  document.getElementById('forgot-pw-link').addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    forgotForm.style.display = 'block';
  });

  document.getElementById('back-to-login').addEventListener('click', (e) => {
    e.preventDefault();
    forgotForm.style.display = 'none';
    loginForm.style.display = 'block';
  });

  // Login Logic
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Simulate backend auth check
    const id = document.getElementById('login-id').value;
    if(id.length > 0) {
      window.location.href = './dashboard.html'; // Redirect to dashboard
    } else {
      alert("Invalid Login Id or Password");
    }
  });

  // Signup Validation Logic
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const loginId = document.getElementById('signup-id').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    let isValid = true;

    // 1. Login ID length check (6-12)
    if (loginId.length < 6 || loginId.length > 12) {
      document.getElementById('id-error').textContent = "Login ID must be 6-12 characters.";
      isValid = false;
    } else {
      document.getElementById('id-error').textContent = "";
    }

    // 2. Password complexity check (>8 chars, 1 lower, 1 upper, 1 special)
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{9,}$/;
    if (!pwRegex.test(password)) {
      document.getElementById('pw-error').textContent = "Must be >8 chars, contain lower, upper, and special char.";
      isValid = false;
    } else {
      document.getElementById('pw-error').textContent = "";
    }

    // 3. Password match check
    if (password !== confirm) {
      document.getElementById('confirm-error').textContent = "Passwords do not match.";
      isValid = false;
    } else {
      document.getElementById('confirm-error').textContent = "";
    }

    if (isValid) {
      alert("Account created successfully!");
      window.location.href = './dashboard.html';
    }
  });

  // Google Auth Simulation
  document.querySelectorAll('.google-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      alert("Redirecting to Google OAuth...");
      // window.location.href = '/api/auth/google';
    });
  });
});

window.onload = function () {
  google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
    callback: handleGoogleResponse
  });

  // Attach Google Auth to your custom buttons
  document.querySelectorAll('.google-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      google.accounts.id.prompt(); 
    });
  });
};

function handleGoogleResponse(response) {
  // Send the token to your backend
  fetch('http://localhost:3000/api/auth/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: response.credential })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      window.location.href = './dashboard.html';
    } else {
      alert("Google Login Failed");
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert("An error occurred during Google Login");
  });
}