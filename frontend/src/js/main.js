// Main content for the homepage
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.innerHTML = `
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to StudentCollab</h1>
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

    // Handle user menu dropdown
    const userMenuButton = document.getElementById('user-menu-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userMenuButton && userDropdown) {
        userMenuButton.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuButton.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }
}); 