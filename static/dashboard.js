document.addEventListener('DOMContentLoaded', () => {
  
  // Simulated data payload from your Flask backend
  const dashboardData = {
    receipts: {
      pending: 4,
      late: 1,
      totalOperations: 6
    },
    deliveries: {
      pending: 4,
      late: 1,
      waiting: 2,
      totalOperations: 6
    }
  };

  // 1. Populate Receipt Data
  document.getElementById('btn-receipts').textContent = `${dashboardData.receipts.pending} To Receive`;
  document.getElementById('stat-receipt-late').textContent = dashboardData.receipts.late;
  document.getElementById('stat-receipt-ops').textContent = dashboardData.receipts.totalOperations;

  // 2. Populate Delivery Data
  document.getElementById('btn-deliveries').textContent = `${dashboardData.deliveries.pending} To Deliver`;
  document.getElementById('stat-delivery-late').textContent = dashboardData.deliveries.late;
  document.getElementById('stat-delivery-waiting').textContent = dashboardData.deliveries.waiting;
  document.getElementById('stat-delivery-ops').textContent = dashboardData.deliveries.totalOperations;

  // 3. Navigation Actions
  document.getElementById('btn-receipts').addEventListener('click', () => {
    // Redirects to operations page (you can pass URL parameters later to auto-filter)
    window.location.href = './operations.html?view=receipts';
  });

  document.getElementById('btn-deliveries').addEventListener('click', () => {
    // Redirects to the delivery page we built earlier
    window.location.href = './delivery.html';
  });

});