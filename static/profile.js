document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    // If no token exists, redirect back to login page
    window.location.href = './auth.html';
    return;
  }

  // Decode JWT (Basic simulation - in real app use jwt-decode library or backend fetch)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    document.getElementById('user-email').textContent = payload.email || 'user@company.com';
    document.getElementById('avatar-initials').textContent = (payload.email || 'U')[0].toUpperCase();
    
    // If it's a google token vs manual
    document.getElementById('auth-type').textContent = payload.email.includes('gmail') ? 'Google OAuth' : 'Standard Auth';
  } catch (e) {
    // Fallback if token is just a dummy string during testing
    document.getElementById('user-email').textContent = 'admin@coreinventory.com';
    document.getElementById('avatar-initials').textContent = 'A';
  }

  // Handle Logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('authToken');
    alert("You have been logged out successfully.");
    window.location.href = './auth.html';
  });
});