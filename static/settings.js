document.addEventListener('DOMContentLoaded', () => {
  
  // Navigate to Warehouse Configuration
  document.getElementById('nav-warehouse').addEventListener('click', () => {
    window.location.href = './warehouse.html';
  });

  // Navigate to Location Configuration
  document.getElementById('nav-location').addEventListener('click', () => {
    window.location.href = './location.html';
  });

  // Navigate to General Settings
  document.getElementById('nav-general').addEventListener('click', () => {
    window.location.href = './general.html';
  });

});