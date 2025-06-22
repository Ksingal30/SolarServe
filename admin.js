// Data storage using localStorage
        const DB = {
            customers: JSON.parse(localStorage.getItem('customers')) || [],
            requests: JSON.parse(localStorage.getItem('requests')) || [],
            
            saveCustomers() {
                localStorage.setItem('customers', JSON.stringify(this.customers));
            },
            
            saveRequests() {
                localStorage.setItem('requests', JSON.stringify(this.requests));
            },
            
            addCustomer(customer) {
                customer.id = Date.now().toString();
                this.customers.push(customer);
                this.saveCustomers();
                return customer;
            },
            
            updateCustomer(id, data) {
                const index = this.customers.findIndex(c => c.id === id);
                if (index !== -1) {
                    this.customers[index] = {...this.customers[index], ...data};
                    this.saveCustomers();
                    return this.customers[index];
                }
                return null;
            },
            
            deleteCustomer(id) {
                this.customers = this.customers.filter(c => c.id !== id);
                this.saveCustomers();
            },
            
            addRequest(request) {
                request.id = 'REQ-' + Date.now().toString().slice(-6);
                request.created = new Date().toISOString().split('T')[0];
                this.requests.push(request);
                this.saveRequests();
                return request;
            },
            
            updateRequest(id, data) {
                const index = this.requests.findIndex(r => r.id === id);
                if (index !== -1) {
                    this.requests[index] = {...this.requests[index], ...data};
                    this.saveRequests();
                    return this.requests[index];
                }
                return null;
            },
            
            deleteRequest(id) {
                this.requests = this.requests.filter(r => r.id !== id);
                this.saveRequests();
            }
        };

        // DOM elements
        const elements = {
            totalCustomers: document.getElementById('totalCustomers'),
            openRequests: document.getElementById('openRequests'),
            customersTable: document.querySelector('#customersTable tbody'),
            requestsTable: document.querySelector('#requestsTable tbody'),
            customerModal: document.getElementById('customerModal'),
            requestModal: document.getElementById('requestModal'),
            customerForm: document.getElementById('customerForm'),
            requestForm: document.getElementById('requestForm'),
            requestCustomer: document.getElementById('requestCustomer'),
            addCustomerBtn: document.getElementById('addCustomerBtn'),
            addRequestBtn: document.getElementById('addRequestBtn'),
            modalCustomerTitle: document.getElementById('modalCustomerTitle'),
            modalRequestTitle: document.getElementById('modalRequestTitle')
        };

        // Current edited items
        let currentCustomerId = null;
        let currentRequestId = null;

        // Initialize the app
        function initApp() {
            updateStats();
            renderCustomers();
            renderRequests();
            setupEventListeners();
        }

        // Update dashboard stats
        function updateStats() {
            elements.totalCustomers.textContent = DB.customers.length;
            elements.openRequests.textContent = DB.requests.filter(r => 
                r.status === 'Open' || r.status === 'In Progress').length;
        }

        // Render customers table
        function renderCustomers() {
            elements.customersTable.innerHTML = '';
            
            DB.customers.forEach(customer => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone || '-'}</td>
                    <td>${customer.company || '-'}</td>
                    <td>${new Date().toLocaleDateString()}</td>
                    <td>
                        <button class="action-btn edit-customer" data-id="${customer.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-customer" data-id="${customer.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                elements.customersTable.appendChild(row);
            });
        }

        // Render service requests table
        function renderRequests() {
            elements.requestsTable.innerHTML = '';
            
            DB.requests.forEach(request => {
                const customer = DB.customers.find(c => c.id === request.customerId) || {};
                const statusClass = `badge-${request.status.toLowerCase().replace(' ', '-')}`;
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${request.id}</td>
                    <td>${customer.name || 'Deleted Customer'}</td>
                    <td>${request.title}</td>
                    <td><span class="badge ${statusClass}">${request.status}</span></td>
                    <td>${request.created}</td>
                    <td>${request.priority}</td>
                    <td>
                        <button class="action-btn edit-request" data-id="${request.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-request" data-id="${request.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                elements.requestsTable.appendChild(row);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Customer modal
            elements.addCustomerBtn.addEventListener('click', () => {
                currentCustomerId = null;
                elements.modalCustomerTitle.textContent = 'Add New Customer';
                elements.customerForm.reset();
                elements.customerModal.style.display = 'flex';
            });
            
            // Request modal
            elements.addRequestBtn.addEventListener('click', () => {
                currentRequestId = null;
                elements.modalRequestTitle.textContent = 'Create Service Request';
                populateCustomerDropdown();
                elements.requestForm.reset();
                elements.requestModal.style.display = 'flex';
            });
            
            // Close modals
            document.querySelectorAll('.close-btn, #cancelCustomerBtn, #cancelRequestBtn').forEach(btn => {
                btn.addEventListener('click', () => {
                    elements.customerModal.style.display = 'none';
                    elements.requestModal.style.display = 'none';
                });
            });
            
            // Customer form submission
            elements.customerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const customerData = {
                    name: document.getElementById('customerName').value,
                    email: document.getElementById('customerEmail').value,
                    phone: document.getElementById('customerPhone').value,
                    company: document.getElementById('customerCompany').value,
                    address: document.getElementById('customerAddress').value
                };
                
                if (currentCustomerId) {
                    DB.updateCustomer(currentCustomerId, customerData);
                } else {
                    DB.addCustomer(customerData);
                }
                
                elements.customerModal.style.display = 'none';
                renderCustomers();
                updateStats();
            });
            
            // Request form submission
            elements.requestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const requestData = {
                    customerId: document.getElementById('requestCustomer').value,
                    title: document.getElementById('requestTitle').value,
                    description: document.getElementById('requestDescription').value,
                    status: document.getElementById('requestStatus').value,
                    priority: document.getElementById('requestPriority').value
                };
                
                if (currentRequestId) {
                    DB.updateRequest(currentRequestId, requestData);
                } else {
                    DB.addRequest(requestData);
                }
                
                elements.requestModal.style.display = 'none';
                renderRequests();
                updateStats();
            });
            
            // Edit customer
            elements.customersTable.addEventListener('click', (e) => {
                if (e.target.closest('.edit-customer')) {
                    const id = e.target.closest('.edit-customer').dataset.id;
                    const customer = DB.customers.find(c => c.id === id);
                    if (customer) {
                        currentCustomerId = id;
                        elements.modalCustomerTitle.textContent = 'Edit Customer';
                        document.getElementById('customerName').value = customer.name;
                        document.getElementById('customerEmail').value = customer.email;
                        document.getElementById('customerPhone').value = customer.phone || '';
                        document.getElementById('customerCompany').value = customer.company || '';
                        document.getElementById('customerAddress').value = customer.address || '';
                        elements.customerModal.style.display = 'flex';
                    }
                }
                
                // Delete customer
                if (e.target.closest('.delete-customer')) {
                    const id = e.target.closest('.delete-customer').dataset.id;
                    if (confirm('Are you sure you want to delete this customer?')) {
                        DB.deleteCustomer(id);
                        renderCustomers();
                        updateStats();
                    }
                }
            });
            
            // Edit request
            elements.requestsTable.addEventListener('click', (e) => {
                if (e.target.closest('.edit-request')) {
                    const id = e.target.closest('.edit-request').dataset.id;
                    const request = DB.requests.find(r => r.id === id);
                    if (request) {
                        currentRequestId = id;
                        elements.modalRequestTitle.textContent = 'Edit Service Request';
                        populateCustomerDropdown();
                        document.getElementById('requestCustomer').value = request.customerId;
                        document.getElementById('requestTitle').value = request.title;
                        document.getElementById('requestDescription').value = request.description;
                        document.getElementById('requestStatus').value = request.status;
                        document.getElementById('requestPriority').value = request.priority;
                        elements.requestModal.style.display = 'flex';
                    }
                }
                
                // Delete request
                if (e.target.closest('.delete-request')) {
                    const id = e.target.closest('.delete-request').dataset.id;
                    if (confirm('Are you sure you want to delete this request?')) {
                        DB.deleteRequest(id);
                        renderRequests();
                        updateStats();
                    }
                }
            });
        }

        // Populate customer dropdown
        function populateCustomerDropdown() {
            elements.requestCustomer.innerHTML = '<option value="">Select Customer</option>';
            DB.customers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = customer.name;
                elements.requestCustomer.appendChild(option);
            });
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', initApp);
