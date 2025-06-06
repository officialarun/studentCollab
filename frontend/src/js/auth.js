// API Configuration
const API_URL = 'https://codespace-4bbx.onrender.com/api';

// Helper function to show error messages
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Helper function to hide error messages
function hideError() {
    const errorDiv = document.getElementById('error-message');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Helper function to handle API responses
async function handleResponse(response) {
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Something went wrong');
    }
    return response.json();
}

// Login form handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            console.log('Attempting login...');
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            console.log('Login response status:', response.status);
            const data = await handleResponse(response);
            console.log('Login response data:', data);
            
            if (data.user) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Verify session before redirecting
                const statusResponse = await fetch(`${API_URL}/auth/status`, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                const statusData = await statusResponse.json();
                console.log('Auth status after login:', statusData);
                
                if (statusData.isAuthenticated) {
                    // Wait a moment to ensure the session cookie is set
                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
                    }, 500);
                } else {
                    throw new Error('Session not established after login');
                }
            } else {
                throw new Error(data.message || 'Authentication failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.message === 'Failed to fetch') {
                showError('Unable to connect to the server. Please make sure the backend server is running.');
            } else {
                showError(error.message);
            }
        }
    });
}

// Signup form handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            enrollmentId: document.getElementById('enrollmentId').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            password: document.getElementById('password').value,
            techStack: document.getElementById('techStack').value
        };

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await handleResponse(response);
            
            if (data.user) {
                // Store user data in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Wait a moment to ensure the session cookie is set
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 100);
            } else {
                throw new Error(data.message || 'Signup failed');
            }
        } catch (error) {
            if (error.message === 'Failed to fetch') {
                showError('Unable to connect to the server. Please make sure the backend server is running.');
            } else {
                showError(error.message);
            }
        }
    });
}

// Logout handler
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            localStorage.removeItem('user');
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/status`, {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await handleResponse(response);
        
        if (data.isAuthenticated && data.user) {
            const user = data.user;
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update UI for authenticated user
            const authButtons = document.getElementById('auth-buttons');
            const userMenu = document.getElementById('user-menu');
            const userName = document.getElementById('user-name');
            
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) userMenu.style.display = 'block';
            if (userName) userName.textContent = user.name || user.email;
        } else {
            localStorage.removeItem('user');
            const authButtons = document.getElementById('auth-buttons');
            const userMenu = document.getElementById('user-menu');
            if (authButtons) authButtons.style.display = 'block';
            if (userMenu) userMenu.style.display = 'none';
        }
    } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('user');
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        if (authButtons) authButtons.style.display = 'block';
        if (userMenu) userMenu.style.display = 'none';
    }
}

// Run auth check when page loads
checkAuth(); 