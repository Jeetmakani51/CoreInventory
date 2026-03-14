document.addEventListener('DOMContentLoaded', () => {
  // --- Simulated Database based on your original HTML ---
  let receiptsData = [
    { ref: 'RCPT-101', supplier: 'Global Traders', warehouse: 'Main Storage', contact: 'Rahul Mehta', date: '12 Apr 2026', status: 'Completed' },
    { ref: 'RCPT-102', supplier: 'Skyline Imports', warehouse: 'Section B', contact: 'Anita Shah', date: '14 Apr 2026', status: 'Pending' },
    { ref: 'RCPT-103', supplier: 'Metro Supplies', warehouse: 'Warehouse 2', contact: 'Rohan Patel', date: '16 Apr 2026', status: 'Completed' }
  ];

  // --- Elements ---
  const tableBody = document.getElementById('table-body');
  const searchInput = document.getElementById('search-bar');
  const recordCount = document.querySelector('.record-count');
  const btnNew = document.getElementById('btn-new');

  // --- Render Function ---
  const renderUI = () => {
    const searchTerm = searchInput.value.toLowerCase();

    // Filter the data
    const filteredData = receiptsData.filter(item => {
      return item.ref.toLowerCase().includes(searchTerm) || 
             item.supplier.toLowerCase().includes(searchTerm) ||
             item.contact.toLowerCase().includes(searchTerm);
    });

    recordCount.textContent = `${filteredData.length} records`;
    tableBody.innerHTML = '';

    filteredData.forEach(item => {
      const tr = document.createElement('tr');
      
      // Determine CSS class based on status
      const statusClass = item.status.toLowerCase() === 'pending' ? 'pending' : 'completed';

      tr.innerHTML = `
        <td><span class="ref-badge" onclick="alert('Open details for ${item.ref}')">${item.ref}</span></td>
        <td>${item.supplier}</td>
        <td>${item.warehouse}</td>
        <td>${item.contact}</td>
        <td><span class="text-muted">${item.date}</span></td>
        <td><span class="status-badge ${statusClass}">${item.status}</span></td>
      `;
      tableBody.appendChild(tr);
    });
  };

  // --- Event Listeners ---
  searchInput.addEventListener('input', renderUI);

  btnNew.addEventListener('click', () => {
    alert('This will open the "New Receipt" form details view.');
  });

  // Initialize
  renderUI();
});