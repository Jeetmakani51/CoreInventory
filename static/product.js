document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.product-form');

  form.addEventListener('submit', (e) => {
    // Prevent the page from reloading on submit
    e.preventDefault();

    // Select all inputs and dropdowns from the form
    const inputs = form.querySelectorAll('input');
    const selects = form.querySelectorAll('select');

    // Extract values based on their order in your HTML
    const productName = inputs[0].value.trim();
    const sku = inputs[1].value.trim();
    const category = selects[0].value;
    const uom = selects[1].value;
    const initialStock = inputs[2].value.trim() || 0; // Default to 0 if left blank

    // Basic Validation: Ensure required fields aren't empty or left on default options
    if (!productName) {
      alert('Please enter a Product Name.');
      return;
    }
    if (!sku) {
      alert('Please enter an SKU / Code.');
      return;
    }
    if (category === 'Select category') {
      alert('Please select a valid Category.');
      return;
    }

    // Construct the data object to send to your Flask backend
    const newProduct = {
      name: productName,
      sku: sku,
      category: category,
      uom: uom,
      stock: parseInt(initialStock)
    };

    // Simulate backend API call
    console.log("Saving New Product to database:", newProduct);
    
    // Show success message
    alert(`Product "${newProduct.name}" (${newProduct.sku}) created successfully!`);

    // Reset the form so the user can add another product
    form.reset();
  });
});