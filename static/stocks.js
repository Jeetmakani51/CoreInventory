document.addEventListener('DOMContentLoaded', () => {
  let stockData = [];

  const tableBody = document.getElementById('table-body');
  const searchInput = document.getElementById('search-bar');
  const recordCount = document.querySelector('.record-count');
  const saveAllBtn = document.getElementById('btn-save-all');
  
  let modifiedRecords = new Set();

  // --- Backend API Integration ---
  async function loadStocks() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      stockData = data.map(p => ({
        id: p.id,
        name: p.name,
        cost: "N/A", 
        onHand: p.stock,
        freeToUse: p.stock
      }));
      renderTable();
    } catch (error) {
      console.error("Failed to load stocks:", error);
    }
  }

  const renderTable = () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredData = stockData.filter(item => 
      item.name.toLowerCase().includes(searchTerm)
    );

    recordCount.textContent = `${filteredData.length} products`;
    tableBody.innerHTML = '';

    filteredData.forEach((item) => {
      const tr = document.createElement('tr');

      if (modifiedRecords.has(item.id.toString())) {
        tr.classList.add('row-modified');
      }

      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td>${item.cost}</td>
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

        const recordIndex = stockData.findIndex(item => item.id == id);
        if (recordIndex > -1) {
          stockData[recordIndex][field] = newValue;
          
          modifiedRecords.add(id.toString());
          e.target.closest('tr').classList.add('row-modified');
          
          saveAllBtn.style.display = 'block';
        }
      });
    });
  };

  searchInput.addEventListener('input', renderTable);

  // --- Backend API Integration (Save) ---
  saveAllBtn.addEventListener('click', () => {
    const updates = Array.from(modifiedRecords).map(id => {
      const record = stockData.find(s => s.id == id);
      return { id: record.id, stock: record.onHand };
    });

    fetch('/api/products/update_stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    .then(res => res.json())
    .then(data => {
      alert(`Successfully updated ${modifiedRecords.size} stock records in the database.`);
      modifiedRecords.clear();
      saveAllBtn.style.display = 'none';
      document.querySelectorAll('.row-modified').forEach(row => {
        row.classList.remove('row-modified');
      });
    })
    .catch(err => console.error("Error updating stocks:", err));
  });

  loadStocks();
});