document.addEventListener('DOMContentLoaded', () => {
  
  // Navigate to Receipts
  document.getElementById('nav-receipts').addEventListener('click', () => {
    window.location.href = './receipt.html';
  });

  // Navigate to Deliveries
  document.getElementById('nav-deliveries').addEventListener('click', () => {
    window.location.href = './delivery.html';
  });

  // Navigate to Adjustments
  document.getElementById('nav-adjustments').addEventListener('click', () => {
    window.location.href = './adjustments.html';
  });

});