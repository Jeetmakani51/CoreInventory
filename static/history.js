document.addEventListener('DOMContentLoaded', () => {
  
  // Array based on the data you provided
  const historyData = [
    { ref: 'WH/IN/0001', date: '12/1/2001', contact: 'Azure Interior', from: 'Vendor', to: 'WH/Stock1', qty: 10, status: 'Ready' },
    { ref: 'WH/OUT/0002', date: '12/1/2001', contact: 'Azure Interior', from: 'WH/Stock1', to: 'Vendor', qty: 6, status: 'Ready' },
    { ref: 'WH/OUT/0003', date: '12/1/2001', contact: 'Azure Interior', from: 'WH/Stock2', to: 'Vendor', qty: 8, status: 'Ready' }
  ];

  const tableBody = document.getElementById('table-body');
  const searchInput = document.getElementById('search-bar');
  const recordCount = document.querySelector('.record-count');

  // Render Table Function
  const renderTable = () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filter data based on search input
    const filteredData = historyData.filter(item => {
      return item.ref.toLowerCase().includes(searchTerm) || 
             item.contact.toLowerCase().includes(searchTerm) ||
             item.from.toLowerCase().includes(searchTerm) ||
             item.to.toLowerCase().includes(searchTerm);
    });

    recordCount.textContent = `${filteredData.length} records`;
    tableBody.innerHTML = '';

    filteredData.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="ref-badge">${item.ref}</span></td>
        <td><span class="text-muted">${item.date}</span></td>
        <td>${item.contact}</td>
        <td>${item.from}</td>
        <td>${item.to}</td>
        <td><span class="qty-badge">${item.qty}</span></td>
        <td><span class="status-badge">${item.status}</span></td>
      `;
      tableBody.appendChild(tr);
    });
  };

  // Event Listeners
  searchInput.addEventListener('input', renderTable);
  
  document.getElementById('btn-new').addEventListener('click', () => {
    alert("Redirecting to create new movement...");
    // window.location.href = './operations.html';
  });

  document.getElementById('btn-export').addEventListener('click', () => {
    alert("Exporting move history to CSV...");
  });

  // Initial render
  renderTable();
});