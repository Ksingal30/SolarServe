document.addEventListener('DOMContentLoaded', () => {
  loadCustomers();

  document.getElementById('logoutBtn').addEventListener('click', () => {
    alert("Logged out (not functional yet)");
    window.location.href = 'index.html';
  });
});

// Load customers from localStorage and populate the table
function loadCustomers() {
  const tableBody = document.querySelector('#customerTable tbody');
  tableBody.innerHTML = '';

  const customers = JSON.parse(localStorage.getItem('customers')) || [];

  customers.forEach(customer => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${customer.name}</td>
      <td>${customer.email}</td>
      <td>${customer.phone}</td>
      <td>
        <button onclick="editCustomer(${customer.id})" class="btn">Edit</button>
        <button onclick="deleteCustomer(${customer.id})" class="btn red">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Delete a customer by ID
function deleteCustomer(id) {
  if (!confirm("Are you sure you want to delete this customer?")) return;

  let customers = JSON.parse(localStorage.getItem('customers')) || [];
  customers = customers.filter(c => c.id !== id);
  localStorage.setItem('customers', JSON.stringify(customers));
  loadCustomers();
}

// Store ID and redirect to edit page
function editCustomer(id) {
  localStorage.setItem('editCustomerId', id);
  window.location.href = 'add-customer.html';
}
