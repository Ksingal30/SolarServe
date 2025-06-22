// Data storage using localStorage
        const DB = {
            requests: JSON.parse(localStorage.getItem('customerRequests')) || [],
            addRequest(request) {
                request.id = 'REQ-' + Date.now().toString().slice(-6);
                request.created = new Date().toISOString().split('T')[0];
                request.updated = request.created;
                request.status = 'Open';
                this.requests.push(request);
                localStorage.setItem('customerRequests', JSON.stringify(this.requests));
                return request;
            },
            getCustomerRequests() {
                return this.requests;
            }
        };

        // DOM elements
        const elements = {
            requestsTable: document.querySelector('#requestsTable tbody'),
            emptyState: document.getElementById('emptyState'),
            requestModal: document.getElementById('requestModal'),
            requestForm: document.getElementById('requestForm'),
            newRequestBtn: document.getElementById('newRequestBtn'),
            cancelRequestBtn: document.getElementById('cancelRequestBtn')
        };

        // Render customer requests
        function renderRequests() {
            elements.requestsTable.innerHTML = '';
            const requests = DB.getCustomerRequests();
            if (requests.length === 0) {
                elements.emptyState.style.display = 'block';
                return;
            }
            elements.emptyState.style.display = 'none';
            requests.forEach(request => {
                const statusClass = `badge-${request.status.toLowerCase().replace(' ', '-')}`;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${request.id}</td>
                    <td>${request.title}</td>
                    <td><span class="badge ${statusClass}">${request.status}</span></td>
                    <td>${request.created}</td>
                    <td>${request.updated || request.created}</td>
                    <td>
                        <button class="action-btn view-request" data-id="${request.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                `;
                elements.requestsTable.appendChild(row);
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            elements.newRequestBtn.addEventListener('click', () => {
                elements.requestModal.style.display = 'flex';
            });
            elements.cancelRequestBtn.addEventListener('click', () => {
                elements.requestModal.style.display = 'none';
            });
            document.querySelector('.close-btn').addEventListener('click', () => {
                elements.requestModal.style.display = 'none';
            });
            elements.requestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const requestData = {
                    title: document.getElementById('requestTitle').value,
                    description: document.getElementById('requestDescription').value,
                    category: document.getElementById('requestCategory').value
                };
                DB.addRequest(requestData);
                elements.requestModal.style.display = 'none';
                renderRequests();
            });
            elements.requestsTable.addEventListener('click', (e) => {
                if (e.target.closest('.view-request')) {
                    const id = e.target.closest('.view-request').dataset.id;
                    const request = DB.requests.find(r => r.id === id);
                    if (request) {
                        alert(`Request Details:\n\nID: ${request.id}\nTitle: ${request.title}\nDescription: ${request.description}\nStatus: ${request.status}\nCreated: ${request.created}`);
                    }
                }
            });
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', () => {
            renderRequests();
            setupEventListeners();
        });