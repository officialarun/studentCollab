class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.initializeChatbot();
    }

    initializeChatbot() {
        // Create chatbot container
        const chatbotContainer = document.createElement('div');
        chatbotContainer.id = 'chatbot-container';

        // Create chat button
        const chatButton = document.createElement('button');
        chatButton.id = 'chat-button';
        chatButton.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
        `;
        chatButton.addEventListener('click', () => this.toggleChat());

        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.id = 'chat-window';
        chatWindow.style.display = 'none';

        // Create chat header
        const chatHeader = document.createElement('div');
        chatHeader.className = 'bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center';
        chatHeader.innerHTML = `
            <h3 class="text-lg font-semibold">Chat Support</h3>
            <button id="close-chat" class="text-white hover:text-gray-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;

        // Create messages container
        const messagesContainer = document.createElement('div');
        messagesContainer.id = 'chat-messages';
        messagesContainer.className = 'flex-1 overflow-y-auto p-4 space-y-4';

        // Create input container
        const inputContainer = document.createElement('div');
        inputContainer.className = 'p-4 border-t border-gray-200';
        inputContainer.innerHTML = `
            <div class="flex space-x-2">
                <input type="text" id="chat-input" placeholder="Type your message..." 
                    class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <button id="send-message" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                    Send
                </button>
            </div>
        `;

        // Assemble chat window
        chatWindow.appendChild(chatHeader);
        chatWindow.appendChild(messagesContainer);
        chatWindow.appendChild(inputContainer);

        // Add elements to container
        chatbotContainer.appendChild(chatButton);
        chatbotContainer.appendChild(chatWindow);

        // Add to body
        document.body.appendChild(chatbotContainer);

        // Add event listeners
        document.getElementById('close-chat').addEventListener('click', () => this.toggleChat());
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Add welcome message
        this.addMessage('bot', 'Hello! How can I help you today?');
    }

    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');
        
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            chatWindow.style.display = 'flex';
            chatButton.style.display = 'none';
        } else {
            chatWindow.style.display = 'none';
            chatButton.style.display = 'flex';
        }
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        
        messageDiv.innerHTML = `
            <div class="max-w-xs ${sender === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'} 
                rounded-lg px-4 py-2">
                ${text}
            </div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        this.messages.push({ sender, text });
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage('user', message);
            input.value = '';
            
            // Simulate bot response (replace with actual API call)
            setTimeout(() => {
                this.handleBotResponse(message);
            }, 1000);
        }
    }

    async handleBotResponse(userMessage) {
        // Enhanced response system with more topics
        const responses = {
            'hello': 'Hi there! Welcome to Student Collaboration Platform. How can I help you today?',
            'help': 'I can help you with:\n- Finding collaborators\n- Creating projects\n- Managing teams\n- Technical support\n- Platform features\n- Account settings\n- Project management\nWhat would you like to know more about?',
            'project': 'To create a project:\n1. Go to your dashboard\n2. Click "Create New Project"\n3. Fill in the details\n4. Click "Create"\nWould you like more specific information?',
            'team': 'To join a team:\n1. Browse available teams\n2. Click "Request to Join"\n3. Wait for approval\n4. Start collaborating!\nNeed more details?',
            'account': 'For account-related queries:\n- Update profile: Go to Profile Settings\n- Change password: Security Settings\n- Update skills: Edit Profile\n- Manage notifications: Notification Settings',
            'features': 'Our platform offers:\n- Project creation and management\n- Team collaboration tools\n- Skill-based matching\n- Real-time chat\n- File sharing\n- Progress tracking\n- Feedback system',
            'collaborate': 'To find collaborators:\n1. Browse projects\n2. Use the search filter\n3. Check required skills\n4. Send collaboration request\n5. Wait for approval',
            'skills': 'You can:\n1. Add skills in your profile\n2. Search projects by skills\n3. Find team members by skills\n4. Get skill recommendations\n5. Track skill development',
            'dashboard': 'Your dashboard includes:\n- Active projects\n- Team members\n- Collaboration requests\n- Project updates\n- Recent activities\n- Quick actions',
            'profile': 'Your profile helps you:\n- Showcase your skills\n- Display your projects\n- Get collaboration requests\n- Build your portfolio\n- Connect with others',
            'support': 'For technical support:\n1. Check our FAQ section\n2. Contact support team\n3. Report issues\n4. Get help documentation\n5. Join community forums',
            'default': 'I\'m here to help! You can ask about:\n- Creating/joining projects\n- Finding team members\n- Managing your profile\n- Platform features\n- Account settings\n- Technical support\n- Skill development\n- Collaboration tools'
        };

        const lowerMessage = userMessage.toLowerCase();
        let response = responses.default;

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = responses.hello;
        } else if (lowerMessage.includes('help')) {
            response = responses.help;
        } else if (lowerMessage.includes('project')) {
            response = responses.project;
        } else if (lowerMessage.includes('team')) {
            response = responses.team;
        } else if (lowerMessage.includes('account') || lowerMessage.includes('profile') || lowerMessage.includes('settings')) {
            response = responses.account;
        } else if (lowerMessage.includes('feature') || lowerMessage.includes('tool')) {
            response = responses.features;
        } else if (lowerMessage.includes('collaborat') || lowerMessage.includes('find team') || lowerMessage.includes('find member')) {
            response = responses.collaborate;
        } else if (lowerMessage.includes('skill')) {
            response = responses.skills;
        } else if (lowerMessage.includes('dashboard')) {
            response = responses.dashboard;
        } else if (lowerMessage.includes('profile')) {
            response = responses.profile;
        } else if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('issue')) {
            response = responses.support;
        }

        this.addMessage('bot', response);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
}); 