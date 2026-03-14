document.addEventListener('DOMContentLoaded', () => {
  let stockData = [
    { id: 'PROD-001', name: 'Desk', cost: 3000, onHand: 50, freeToUse: 45 },
    { id: 'PROD-002', name: 'Table', cost: 3000, onHand: 50, freeToUse: 50 }
  ];

  const tableBody = document.getElementById('table-body');
  const searchInput = document.getElementById('search-bar');
  const recordCount = document.querySelector('.record-count');
  const saveAllBtn = document.getElementById('btn-save-all');
  
  let modifiedRecords = new Set();

  const renderTable = () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredData = stockData.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );

    recordCount.textContent = `${filteredData.length} products`;
    tableBody.innerHTML = '';

    filteredData.forEach((item, index) => {
      const tr = document.createElement('tr');

      if (modifiedRecords.has(item.id)) {
        tr.classList.add('row-modified');
      }

      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.cost} Rs</td>
        <td>
          <input type="number" class="editable-input" data-id="${item.id}" data-field="onHand" value="${item.onHand}">
        </td>
        <td>
          <input type="number" class="editable-input" data-id="${item.id}" data-field="freeToUse" value="${item.freeToUse}">
        </td>
      `;
      tableBody.appendChild(tr);
    });

    attachInputListeners();
  };

  const attachInputListeners = () => {
    const inputs = document.querySelectorAll('.editable-input');
    
    inputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const id = e.target.dataset.id;
        const field = e.target.dataset.field;
        const newValue = parseInt(e.target.value) || 0;

        const recordIndex = stockData.findIndex(item => item.id === id);
        if (recordIndex > -1) {
          stockData[recordIndex][field] = newValue;
          
          modifiedRecords.add(id);
          e.target.closest('tr').classList.add('row-modified');
          
          saveAllBtn.style.display = 'block';
        }
      });
    });
  };

  searchInput.addEventListener('input', renderTable);

  saveAllBtn.addEventListener('click', () => {
    
    alert(`Successfully updated ${modifiedRecords.size} stock records in the database.`);
    
    modifiedRecords.clear();
    saveAllBtn.style.display = 'none';
    
    document.querySelectorAll('.row-modified').forEach(row => {
      row.classList.remove('row-modified');
    });
  });

  renderTable();
});