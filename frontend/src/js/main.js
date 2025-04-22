// Main content for the homepage
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to Codespace</h1>
                <p class="text-xl text-gray-600 mb-8">Connect, collaborate, and create amazing projects with fellow students.</p>
                <div class="space-x-4">
                    <a href="/signup.html" class="inline-block bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700">
                        Get Started
                    </a>
                    <a href="/login.html" class="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50">
                        Sign In
                    </a>
                </div>
            </div>
        `;
    }

    // Check authentication status
    checkAuthStatus();

    // Add event listeners for user menu
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutButton = document.getElementById('logout-button');

    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (!userMenuButton.contains(event.target) && !userDropdown.contains(event.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
});

async function checkAuthStatus() {
    try {
        const response = await fetch('https://codespace-4bbx.onrender.com/api/auth/status', {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.authenticated) {
                showAuthenticatedUI(data.user);
            } else {
                showUnauthenticatedUI();
            }
        } else {
            showUnauthenticatedUI();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        showUnauthenticatedUI();
    }
}

function showAuthenticatedUI(user) {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');

    if (authButtons) authButtons.classList.add('hidden');
    if (userMenu) userMenu.classList.remove('hidden');
    if (userName) userName.textContent = user.name || user.email;
}

function showUnauthenticatedUI() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');

    if (authButtons) authButtons.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
}

async function handleLogout() {
    try {
        const response = await fetch('https://codespace-4bbx.onrender.com/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
} 