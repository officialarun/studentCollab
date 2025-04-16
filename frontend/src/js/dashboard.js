// API configuration
const API_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
async function handleResponse(response) {
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Something went wrong');
    }
    return response.json();
}

// Format date helper
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Create project card HTML
function createProjectCard(project) {
    return `
        <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">${project.title}</h3>
                <p class="mt-2 text-sm text-gray-500">${project.description}</p>
                <div class="mt-4">
                    <h4 class="text-sm font-medium text-gray-900">Tech Stack:</h4>
                    <div class="mt-2 flex flex-wrap gap-2">
                        ${project.techStack.map(tech => `
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                </div>
                ${project.lookingFor && project.lookingFor.length > 0 ? `
                    <div class="mt-4">
                        <h4 class="text-sm font-medium text-gray-900">Looking For:</h4>
                        <div class="mt-2 flex flex-wrap gap-2">
                            ${project.lookingFor.map(tech => `
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    ${tech}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                <div class="mt-4 flex justify-between items-center">
                    <span class="text-sm text-gray-500">Created ${formatDate(project.createdAt)}</span>
                    <div class="flex space-x-2">
                        <button onclick="editProject('${project._id}')" class="text-primary-600 hover:text-primary-900">
                            Edit
                        </button>
                        <button onclick="deleteProject('${project._id}')" class="text-red-600 hover:text-red-900">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Create collaboration card HTML
function createCollaborationCard(project) {
    return `
        <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900">${project.title}</h3>
                <p class="mt-2 text-sm text-gray-500">${project.description}</p>
                <div class="mt-4">
                    <h4 class="text-sm font-medium text-gray-900">Owner:</h4>
                    <p class="mt-1 text-sm text-gray-500">${project.owner.name}</p>
                </div>
                <div class="mt-4">
                    <h4 class="text-sm font-medium text-gray-900">Tech Stack:</h4>
                    <div class="mt-2 flex flex-wrap gap-2">
                        ${project.techStack.map(tech => `
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div class="mt-4">
                    <span class="text-sm text-gray-500">Joined ${formatDate(project.collaborators.find(c => c.user._id === localStorage.getItem('user').id).joinedAt)}</span>
                </div>
            </div>
        </div>
    `;
}

// Create notification item HTML
function createNotificationItem(notification) {
    return `
        <div class="flex items-start space-x-3 ${notification.read ? 'opacity-75' : ''}">
            <div class="flex-shrink-0">
                ${notification.type === 'collaboration_request' ? `
                    <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                ` : `
                    <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                `}
            </div>
            <div class="flex-1">
                <p class="text-sm text-gray-900">${notification.message}</p>
                <p class="text-xs text-gray-500">${formatDate(notification.createdAt)}</p>
            </div>
            ${!notification.read ? `
                <button onclick="markNotificationAsRead('${notification._id}')" class="text-sm text-primary-600 hover:text-primary-900">
                    Mark as read
                </button>
            ` : ''}
        </div>
    `;
}

// Load user data
async function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('welcome-name').textContent = user.name;
    }
}

// Load notifications
async function loadNotifications() {
    try {
        const response = await fetch(`${API_URL}/users/notifications`, {
            credentials: 'include',
        });
        const notifications = await handleResponse(response);

        const notificationsList = document.getElementById('notifications-list');
        const notificationCount = document.getElementById('notification-count');

        notificationsList.innerHTML = notifications.map(createNotificationItem).join('');
        notificationCount.textContent = notifications.filter(n => !n.read).length;
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Load projects
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/users/projects`, {
            credentials: 'include',
        });
        const projects = await handleResponse(response);

        const projectsList = document.getElementById('projects-list');
        projectsList.innerHTML = projects.map(createProjectCard).join('');
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Load collaborations
async function loadCollaborations() {
    try {
        const response = await fetch(`${API_URL}/users/collaborations`, {
            credentials: 'include',
        });
        const collaborations = await handleResponse(response);

        const collaborationsList = document.getElementById('collaborations-list');
        collaborationsList.innerHTML = collaborations.map(createCollaborationCard).join('');
    } catch (error) {
        console.error('Error loading collaborations:', error);
    }
}

// Create project
async function createProject(projectData) {
    try {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(projectData),
        });

        await handleResponse(response);
        
        // Close modal and reload data
        document.getElementById('create-project-modal').classList.add('hidden');
        document.getElementById('create-project-form').reset();
        loadProjects();
    } catch (error) {
        console.error('Error creating project:', error);
    }
}

// Delete project
async function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        const response = await fetch(`${API_URL}/projects/${projectId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        await handleResponse(response);
        loadProjects();
    } catch (error) {
        console.error('Error deleting project:', error);
    }
}

// Mark notification as read
async function markNotificationAsRead(notificationId) {
    try {
        const response = await fetch(`${API_URL}/users/notifications/${notificationId}/read`, {
            method: 'PUT',
            credentials: 'include',
        });

        await handleResponse(response);
        loadNotifications();
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const user = await handleProtectedRoute();
    if (!user) return;

    // Load initial data
    loadUserData();
    loadNotifications();
    loadProjects();
    loadCollaborations();

    // Setup create project modal
    const createProjectButton = document.getElementById('create-project-button');
    const createProjectModal = document.getElementById('create-project-modal');
    const createProjectForm = document.getElementById('create-project-form');
    const cancelProjectButton = document.getElementById('cancel-project-button');

    createProjectButton.addEventListener('click', () => {
        createProjectModal.classList.remove('hidden');
    });

    cancelProjectButton.addEventListener('click', () => {
        createProjectModal.classList.add('hidden');
        createProjectForm.reset();
    });

    createProjectForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(createProjectForm);
        const projectData = {
            title: formData.get('title'),
            description: formData.get('description'),
            techStack: formData.get('techStack').split(',').map(tech => tech.trim()),
            lookingFor: formData.get('lookingFor').split(',').map(tech => tech.trim()),
            githubLink: formData.get('githubLink'),
        };
        createProject(projectData);
    });

    // Setup user menu dropdown
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');

    userMenuButton.addEventListener('click', () => {
        userDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
            userDropdown.classList.add('hidden');
        }
    });
}); 