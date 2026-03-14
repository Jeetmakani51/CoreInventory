document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('general-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const settingsData = {
      companyName: document.getElementById('comp-name').value,
      contactEmail: document.getElementById('comp-email').value,
      currency: document.getElementById('comp-currency').value,
      weightUnit: document.getElementById('pref-weight').value,
      dimensionUnit: document.getElementById('pref-dim').value,
      lowStockAlerts: document.getElementById('pref-alerts').value === 'true'
    };

    console.log("Saving General Settings:", settingsData);
    alert("General settings saved successfully.");
  });
});