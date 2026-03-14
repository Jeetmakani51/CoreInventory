document.addEventListener('DOMContentLoaded', () => {
  const productSelect = document.getElementById('adj-product');
  const recordedInput = document.getElementById('adj-recorded');
  const actualInput = document.getElementById('adj-actual');
  const diffSpan = document.getElementById('adj-diff');
  const form = document.getElementById('adjustment-form');
  const historyBody = document.getElementById('adj-history-body');

  // Auto-fill recorded stock when a product is selected
  productSelect.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const stock = selectedOption.dataset.stock;
    recordedInput.value = stock;
    calculateDifference();
  });

  // Calculate difference dynamically
  actualInput.addEventListener('input', calculateDifference);

  function calculateDifference() {
    const recorded = parseInt(recordedInput.value) || 0;
    const actual = parseInt(actualInput.value) || 0;
    const diff = actual - recorded;
    
    diffSpan.textContent = diff > 0 ? `+${diff}` : diff;
    diffSpan.className = diff < 0 ? 'text-red' : (diff > 0 ? 'text-green' : '');
  }

  // Handle Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const date = new Date().toLocaleDateString();
    const product = productSelect.options[productSelect.selectedIndex].text;
    const location = document.getElementById('adj-location').options[document.getElementById('adj-location').selectedIndex].text;
    const recorded = recordedInput.value;
    const actual = actualInput.value;
    const diff = diffSpan.textContent;
    const diffClass = diffSpan.className;

    // Add to History Table visually
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color: var(--text-muted);">${date}</td>
      <td><strong>${product}</strong></td>
      <td>${location}</td>
      <td>${recorded}</td>
      <td>${actual}</td>
      <td class="${diffClass}"><strong>${diff}</strong></td>
    `;
    
    historyBody.prepend(tr); // Add to top of list
    
    alert('Stock adjusted successfully!');
    form.reset();
    diffSpan.textContent = '0';
    diffSpan.className = '';
  });
});