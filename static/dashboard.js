document.addEventListener('DOMContentLoaded', () => {
  
  // Simulated data payload from your Flask backend
  const dashboardData = {
    totalProducts: 1254,
    lowStock: 18,
    pendingReceipts: 7,
    pendingDeliveries: 12,
    internalTransfers: 3
  };

  // Function to populate the dashboard KPIs
  const populateKPIs = (data) => {
    document.getElementById('kpi-total-products').textContent = data.totalProducts;
    document.getElementById('kpi-low-stock').textContent = data.lowStock;
    document.getElementById('kpi-receipts').textContent = data.pendingReceipts;
    document.getElementById('kpi-deliveries').textContent = data.pendingDeliveries;
    document.getElementById('kpi-transfers').textContent = data.internalTransfers;
  };

  // Initial Load
  populateKPIs(dashboardData);

  // Dynamic Filters Logic
  const filterSelects = document.querySelectorAll('.filter-select');
  
  filterSelects.forEach(select => {
    select.addEventListener('change', () => {
      // Collect all current filter values
      const filters = {
        docType: document.getElementById('filter-doc').value,
        status: document.getElementById('filter-status').value,
        location: document.getElementById('filter-location').value,
        category: document.getElementById('filter-category').value
      };

      console.log("Filters updated. Fetching new data...", filters);

      // Simulate an API call fetching new filtered data
      // In production, this will be: fetch(`/api/dashboard?location=${filters.location}...`)
      const simulatedFilteredData = {
        totalProducts: Math.floor(Math.random() * 1000) + 100,
        lowStock: Math.floor(Math.random() * 20),
        pendingReceipts: Math.floor(Math.random() * 10),
        pendingDeliveries: Math.floor(Math.random() * 15),
        internalTransfers: Math.floor(Math.random() * 5)
      };

      populateKPIs(simulatedFilteredData);
    });
  });

});