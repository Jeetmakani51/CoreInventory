document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('location-form');
  const codeInput = document.getElementById('loc-code');
  
  const saveBtns = document.querySelectorAll('.top-save, #btn-save');
  const discardBtns = document.querySelectorAll('.top-discard, #btn-discard');
  const deleteBtn = document.getElementById('btn-delete');

  // Enforce uppercase and length on Short Code
  codeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 6);
  });

  const handleSave = (e) => {
    e.preventDefault();
    
    // Check HTML5 validity before processing
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const locationData = {
      name: document.getElementById('loc-name').value,
      code: document.getElementById('loc-code').value,
      warehouse: document.getElementById('loc-warehouse').value,
      type: document.getElementById('loc-type').value
    };

    console.log("Saving Location Data:", locationData);
    alert("Location configuration saved successfully.");
  };

  const handleDiscard = () => {
    if (confirm("Discard unsaved changes?")) {
      form.reset();
    }
  };

  // Bind Multiple Save/Discard Buttons (Top Header and Footer)
  saveBtns.forEach(btn => btn.addEventListener('click', handleSave));
  discardBtns.forEach(btn => btn.addEventListener('click', handleDiscard));

  // Handle Delete
  deleteBtn.addEventListener('click', () => {
    const locName = document.getElementById('loc-name').value || "this location";
    if (confirm(`Are you sure you want to permanently delete ${locName}?`)) {
      alert("Location deleted.");
      window.location.href = './dashboard.html';
    }
  });
});