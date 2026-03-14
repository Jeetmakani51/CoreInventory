document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('warehouse-form');
  const codeInput = document.getElementById('wh-code');
  const discardBtn = document.getElementById('btn-discard');
  const deleteBtn = document.getElementById('btn-delete');

  // Enforce uppercase and length on Short Code
  codeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 5);
  });

  // Handle Form Submission (Save)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const warehouseData = {
      name: document.getElementById('wh-name').value,
      code: document.getElementById('wh-code').value,
      address: document.getElementById('wh-address').value,
      company: document.getElementById('wh-company').value,
      inbound: document.getElementById('wh-inbound').value,
      outbound: document.getElementById('wh-outbound').value
    };

    // To be replaced with a fetch() POST/PUT to Flask backend
    console.log("Saving Warehouse Data:", warehouseData);
    alert("Warehouse configuration saved successfully.");
  });

  // Handle Discard
  discardBtn.addEventListener('click', () => {
    if (confirm("Discard unsaved changes?")) {
      form.reset();
    }
  });

  // Handle Delete
  deleteBtn.addEventListener('click', () => {
    const whName = document.getElementById('wh-name').value || "this warehouse";
    if (confirm(`Are you sure you want to permanently delete ${whName}?`)) {
      // To be replaced with a fetch() DELETE to Flask backend
      alert("Warehouse deleted.");
      window.location.href = './dashboard.html';
    }
  });
});