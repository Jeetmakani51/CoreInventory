document.addEventListener('DOMContentLoaded', () => {
  let deliveries = [];
  let currentEditingRef = null;
  let isGridView = false;

  const listView = document.getElementById('list-view');
  const detailsView = document.getElementById('details-view');
  const tableBody = document.getElementById('table-body');
  const dataTable = document.getElementById('data-table');
  const gridContainer = document.getElementById('grid-container');
  const recordCount = document.querySelector('.record-count');
  
  const searchInput = document.getElementById('search-bar');
  const toggleFilterBtn = document.getElementById('toggle-filter');
  const filterPanel = document.getElementById('filter-panel');
  const toggleGridBtn = document.getElementById('toggle-grid');
  const btnNew = document.getElementById('btn-new');
  const validateBtn = document.getElementById('validate-btn');
  const checkboxes = document.querySelectorAll('.status-filter');

  // --- Backend API Integration ---
  async function loadDeliveries() {
    try {
      const response = await fetch('/api/deliveries');
      const data = await response.json();
      deliveries = data.map(d => ({
        id: d.id,
        ref: d.reference,
        from: d.from_location,
        to: d.to_location,
        contact: d.contact,
        date: d.scheduled_date,
        status: d.status
      }));
      renderUI();
    } catch (error) {
      console.error("Failed to load deliveries:", error);
    }
  }

  // --- Render Functions ---
  const renderUI = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilters = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value.toLowerCase());

    const filteredData = deliveries.filter(item => {
      const matchesSearch = item.ref.toLowerCase().includes(searchTerm) || item.contact.toLowerCase().includes(searchTerm);
      const matchesFilter = activeFilters.includes(item.status.toLowerCase());
      return matchesSearch && matchesFilter;
    });

    recordCount.textContent = `${filteredData.length} records`;
    tableBody.innerHTML = '';
    gridContainer.innerHTML = '';

    filteredData.forEach(item => {
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

  // --- Edit Delivery ---
  window.editRecord = (ref) => {
    currentEditingRef = ref;
    const record = deliveries.find(d => d.ref === ref);
    
    document.querySelector('.current-ref').textContent = ref;
    document.querySelector('.ref-title').textContent = ref;
    
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
    loadDeliveries();
  };

  // --- Event Listeners ---
  searchInput.addEventListener('input', renderUI);
  checkboxes.forEach(cb => cb.addEventListener('change', renderUI));

  toggleFilterBtn.addEventListener('click', () => {
    filterPanel.style.display = filterPanel.style.display === 'none' ? 'flex' : 'none';
  });

  toggleGridBtn.addEventListener('click', () => {
    isGridView = !isGridView;
    renderUI();
  });

  btnNew.addEventListener('click', () => {
    currentEditingRef = 'NEW';
    document.querySelector('.current-ref').textContent = 'New Delivery';
    document.querySelector('.ref-title').textContent = 'Draft Delivery';
    
    document.querySelectorAll('.form-card input').forEach(input => input.value = '');
    updateStatusVisuals('Draft');
    listView.style.display = 'none';
    detailsView.style.display = 'block';
  });

  // --- Backend API Integration (Save) ---
  validateBtn.addEventListener('click', () => {
    const contact = document.getElementById('input-contact').value || 'Unknown Contact';
    const from = document.getElementById('input-from').value || 'WH/Stock';
    const to = document.getElementById('input-to').value || 'Customer';
    const date = document.getElementById('input-date').value || '—';

    if (currentEditingRef === 'NEW') {
      fetch('/api/delivery/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: 'WH/OUT/' + Date.now(),
          from: from,
          to: to,
          contact: contact,
          date: date,
          items: []
        })
      })
      .then(res => res.json())
      .then(() => {
        closeDetails();
      });
    } else {
       closeDetails();
    }
  });

  document.getElementById('print-btn').addEventListener('click', () => window.print());
  document.getElementById('cancel-btn').addEventListener('click', closeDetails);
  document.querySelectorAll('.back-link').forEach(link => link.addEventListener('click', (e) => {
    e.preventDefault();
    closeDetails();
  }));

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

  document.getElementById('add-product-btn').addEventListener('click', () => {
    const tbody = document.querySelector('.products-table tbody');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" placeholder="Product Code" style="border:none; outline:none; background:transparent; color:white;"></td>
      <td><input type="text" placeholder="Description" style="border:none; outline:none; background:transparent; color:white;"></td>
      <td><input type="number" value="1" style="width:50px; background:rgba(255,255,255,0.1); border:none; border-radius:4px; padding:2px 8px; color:white;"></td>
      <td>—</td>
    `;
    tbody.appendChild(tr);
  });

  // Initialize
  filterPanel.style.display = 'none';
  loadDeliveries();
});