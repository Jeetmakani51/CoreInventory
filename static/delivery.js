document.addEventListener('DOMContentLoaded', () => {
  // --- Simulated Database ---
  let deliveries = [
    { ref: 'WH/OUT/0001', from: 'WH/Stock1', to: 'Vendor', contact: 'Azure Interior', date: '—', status: 'Ready' },
    { ref: 'WH/OUT/0002', from: 'WH/Stock1', to: 'Vendor', contact: 'Azure Interior', date: '—', status: 'Ready' }
  ];

  let currentEditingRef = null;
  let isGridView = false;

  // --- UI Elements ---
  const listView = document.getElementById('list-view');
  const detailsView = document.getElementById('details-view');
  const tableBody = document.getElementById('table-body');
  const dataTable = document.getElementById('data-table');
  const gridContainer = document.getElementById('grid-container');
  const recordCount = document.querySelector('.record-count');
  
  // Controls
  const searchInput = document.getElementById('search-bar');
  const toggleFilterBtn = document.getElementById('toggle-filter');
  const filterPanel = document.getElementById('filter-panel');
  const toggleGridBtn = document.getElementById('toggle-grid');
  const btnNew = document.getElementById('btn-new');
  const validateBtn = document.getElementById('validate-btn');
  const checkboxes = document.querySelectorAll('.status-filter');

  // --- Render Functions ---
  const renderUI = () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    // Get active filters
    const activeFilters = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value.toLowerCase());

    // Filter the data
    const filteredData = deliveries.filter(item => {
      const matchesSearch = item.ref.toLowerCase().includes(searchTerm) || item.contact.toLowerCase().includes(searchTerm);
      const matchesFilter = activeFilters.includes(item.status.toLowerCase());
      return matchesSearch && matchesFilter;
    });

    recordCount.textContent = `${filteredData.length} records`;
    tableBody.innerHTML = '';
    gridContainer.innerHTML = '';

    filteredData.forEach(item => {
      // Create Table Row
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="ref-badge ref-link" onclick="editRecord('${item.ref}')">${item.ref}</span></td>
        <td>${item.from}</td>
        <td>${item.to}</td>
        <td>${item.contact}</td>
        <td>${item.date}</td>
        <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
      `;
      tableBody.appendChild(tr);

      // Create Kanban Card
      const card = document.createElement('div');
      card.className = 'kanban-card';
      card.innerHTML = `
        <div class="kanban-card-header">
          <span class="ref-badge ref-link" onclick="editRecord('${item.ref}')">${item.ref}</span>
          <span class="status-badge ${item.status.toLowerCase()}">${item.status}</span>
        </div>
        <p style="font-size:14px; margin-bottom:8px;"><strong>To:</strong> ${item.contact}</p>
        <p style="font-size:13px; color:var(--text-muted);">${item.from} &rarr; ${item.to}</p>
      `;
      gridContainer.appendChild(card);
    });

    // Handle View State
    if (isGridView) {
      dataTable.style.display = 'none';
      gridContainer.style.display = 'grid';
      toggleGridBtn.classList.add('active');
    } else {
      dataTable.style.display = 'table';
      gridContainer.style.display = 'none';
      toggleGridBtn.classList.remove('active');
    }
  };

  // Make editRecord globally available for inline onclick attributes
  window.editRecord = (ref) => {
    currentEditingRef = ref;
    const record = deliveries.find(d => d.ref === ref);
    
    document.querySelector('.current-ref').textContent = ref;
    document.querySelector('.ref-title').textContent = ref;
    
    // Populate form
    document.getElementById('input-contact').value = record.contact;
    document.getElementById('input-from').value = record.from;
    document.getElementById('input-to').value = record.to;
    document.getElementById('input-date').value = record.date === '—' ? '' : record.date;
    
    updateStatusVisuals(record.status);
    
    listView.style.display = 'none';
    detailsView.style.display = 'block';
  };

  const closeDetails = () => {
    listView.style.display = 'block';
    detailsView.style.display = 'none';
    renderUI();
  };

  // --- Event Listeners ---
  
  // Search & Filter
  searchInput.addEventListener('input', renderUI);
  checkboxes.forEach(cb => cb.addEventListener('change', renderUI));

  toggleFilterBtn.addEventListener('click', () => {
    filterPanel.style.display = filterPanel.style.display === 'none' ? 'flex' : 'none';
  });

  toggleGridBtn.addEventListener('click', () => {
    isGridView = !isGridView;
    renderUI();
  });

  // Add New Record Flow
  btnNew.addEventListener('click', () => {
    currentEditingRef = 'NEW';
    document.querySelector('.current-ref').textContent = 'New Delivery';
    document.querySelector('.ref-title').textContent = 'Draft Delivery';
    
    // Clear form
    document.querySelectorAll('.form-card input').forEach(input => input.value = '');
    updateStatusVisuals('Draft');
    
    listView.style.display = 'none';
    detailsView.style.display = 'block';
  });

  // Validate / Save Button
  validateBtn.addEventListener('click', () => {
    const contact = document.getElementById('input-contact').value || 'Unknown Contact';
    const from = document.getElementById('input-from').value || 'WH/Stock';
    const to = document.getElementById('input-to').value || 'Customer';
    const date = document.getElementById('input-date').value || '—';
    const activeStatusNode = document.querySelector('.status-step.active');
    const status = activeStatusNode ? activeStatusNode.dataset.status : 'Ready';

    if (currentEditingRef === 'NEW') {
      // Generate ID and push to array
      const newId = `WH/OUT/000${deliveries.length + 1}`;
      deliveries.unshift({ ref: newId, from, to, contact, date, status });
    } else {
      // Update existing record
      const recordIndex = deliveries.findIndex(d => d.ref === currentEditingRef);
      if (recordIndex > -1) {
        deliveries[recordIndex] = { ...deliveries[recordIndex], contact, from, to, date, status };
      }
    }
    closeDetails();
  });

  // Print & Cancel
  document.getElementById('print-btn').addEventListener('click', () => window.print());
  document.getElementById('cancel-btn').addEventListener('click', closeDetails);
  document.querySelectorAll('.back-link').forEach(link => link.addEventListener('click', (e) => {
    e.preventDefault();
    closeDetails();
  }));

  // Status Segments Logic
  function updateStatusVisuals(statusName) {
    const steps = document.querySelectorAll('.status-step');
    steps.forEach(step => {
      step.classList.remove('active');
      if(step.dataset.status.toLowerCase() === statusName.toLowerCase()) {
        step.classList.add('active');
      }
    });
  }

  document.querySelectorAll('.status-step').forEach(step => {
    step.addEventListener('click', () => updateStatusVisuals(step.dataset.status));
  });

  // Add Product Button
  document.getElementById('add-product-btn').addEventListener('click', () => {
    const tbody = document.querySelector('.products-table tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" placeholder="Product Code" style="border:none; outline:none; background:transparent;"></td>
      <td><input type="text" placeholder="Description" style="border:none; outline:none; background:transparent;"></td>
      <td><input type="number" value="1" style="width:50px; background:#e0e0e0; border:none; border-radius:4px; padding:2px 8px;"></td>
      <td>—</td>
    `;
    tbody.appendChild(tr);
  });

  // Initialize
  filterPanel.style.display = 'none';
  renderUI();
});