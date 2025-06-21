const customerId = localStorage.getItem('editCustomerId'); // used only for edit

const form = document.getElementById('customerForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const formTitle = document.getElementById('formTitle');

// Load data if editing
if (customerId) {
  formTitle.textContent = "Edit Customer";

  const customers = JSON.parse(localStorage.getItem("customers") || "[]");
  const customer = customers.find(c => c.id == customerId);

  if (customer) {
    nameInput.value = customer.name;
    emailInput.value = customer.email;
    phoneInput.value = customer.phone;
  } else {
    alert("Customer not found.");
  }
}

// Form submit
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !email || !phone) {
    alert("Please fill in all fields.");
    return;
  }

  let customers = JSON.parse(localStorage.getItem("customers") || "[]");

  if (customerId) {
    // EDIT
    customers = customers.map(c =>
      c.id == customerId ? { ...c, name, email, phone } : c
    );
    alert("Customer updated successfully!");
  } else {
    // ADD
    const newCustomer = {
      id: Date.now(),
      name,
      email,
      phone
    };
    customers.push(newCustomer);
    alert("Customer added successfully!");
  }

  localStorage.setItem("customers", JSON.stringify(customers));
  localStorage.removeItem("editCustomerId");
  window.location.href = "dashboard.html";
});
