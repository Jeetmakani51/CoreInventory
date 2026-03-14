document.addEventListener('DOMContentLoaded', () => {

  // Function to populate the dashboard KPIs in the HTML
  const populateKPIs = (data) => {
    document.getElementById('kpi-total-products').textContent = data.totalProducts || 0;
    document.getElementById('kpi-low-stock').textContent = data.lowStock || 0;
    document.getElementById('kpi-receipts').textContent = data.pendingReceipts || 0;
    document.getElementById('kpi-deliveries').textContent = data.pendingDeliveries || 0;
    document.getElementById('kpi-transfers').textContent = data.internalTransfers || 0;
  };

  // --- Backend API Integration ---
  // Fetch real data from your Flask app
  fetch('/api/dashboard')
    .then(response => response.json())
    .then(data => {
      populateKPIs(data);
    })
    .catch(error => {
      console.error("Error fetching dashboard stats:", error);
    });

  // --- Dynamic Filters Logic ---
  const filterSelects = document.querySelectorAll('.filter-select');
  
  filterSelects.forEach(select => {
    select.addEventListener('change', () => {
      // In the future, you can attach these filter values to the fetch URL 
      // e.g., fetch(`/api/dashboard?location=${locationValue}`)
      const filters = {
        docType: document.getElementById('filter-doc').value,
        status: document.getElementById('filter-status').value,
        location: document.getElementById('filter-location').value,
        category: document.getElementById('filter-category').value
      };

      console.log("Filters changed, ready to fetch new data...", filters);
    });
  });

});