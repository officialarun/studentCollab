(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&e(a)}).observe(document,{childList:!0,subtree:!0});function n(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(t){if(t.ep)return;t.ep=!0;const i=n(t);fetch(t.href,i)}})();document.addEventListener("DOMContentLoaded",()=>{const s=document.getElementById("main-content");s&&(s.innerHTML=`
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
        `),c();const o=document.getElementById("user-menu-button"),n=document.getElementById("user-dropdown"),e=document.getElementById("logout-button");o&&n&&(o.addEventListener("click",()=>{n.classList.toggle("hidden")}),document.addEventListener("click",t=>{!o.contains(t.target)&&!n.contains(t.target)&&n.classList.add("hidden")})),e&&e.addEventListener("click",u)});async function c(){try{const s=await fetch("/api/auth/status",{credentials:"include"});if(s.ok){const o=await s.json();o.authenticated?d(o.user):r()}else r()}catch(s){console.error("Error checking auth status:",s),r()}}function d(s){const o=document.getElementById("auth-buttons"),n=document.getElementById("user-menu"),e=document.getElementById("user-name");o&&o.classList.add("hidden"),n&&n.classList.remove("hidden"),e&&(e.textContent=s.name||s.email)}function r(){const s=document.getElementById("auth-buttons"),o=document.getElementById("user-menu");s&&s.classList.remove("hidden"),o&&o.classList.add("hidden")}async function u(){try{(await fetch("/api/auth/logout",{method:"POST",credentials:"include"})).ok?window.location.href="/":console.error("Logout failed")}catch(s){console.error("Error during logout:",s)}}class m{constructor(){this.isOpen=!1,this.messages=[],this.initializeChatbot()}initializeChatbot(){const o=document.createElement("div");o.id="chatbot-container";const n=document.createElement("button");n.id="chat-button",n.innerHTML=`
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
        `,n.addEventListener("click",()=>this.toggleChat());const e=document.createElement("div");e.id="chat-window",e.style.display="none";const t=document.createElement("div");t.className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center",t.innerHTML=`
            <h3 class="text-lg font-semibold">Chat Support</h3>
            <button id="close-chat" class="text-white hover:text-gray-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;const i=document.createElement("div");i.id="chat-messages",i.className="flex-1 overflow-y-auto p-4 space-y-4";const a=document.createElement("div");a.className="p-4 border-t border-gray-200",a.innerHTML=`
            <div class="flex space-x-2">
                <input type="text" id="chat-input" placeholder="Type your message..." 
                    class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <button id="send-message" class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                    Send
                </button>
            </div>
        `,e.appendChild(t),e.appendChild(i),e.appendChild(a),o.appendChild(n),o.appendChild(e),document.body.appendChild(o),document.getElementById("close-chat").addEventListener("click",()=>this.toggleChat()),document.getElementById("send-message").addEventListener("click",()=>this.sendMessage()),document.getElementById("chat-input").addEventListener("keypress",l=>{l.key==="Enter"&&this.sendMessage()}),this.addMessage("bot","Hello! How can I help you today?")}toggleChat(){const o=document.getElementById("chat-window"),n=document.getElementById("chat-button");this.isOpen=!this.isOpen,this.isOpen?(o.style.display="flex",n.style.display="none"):(o.style.display="none",n.style.display="flex")}addMessage(o,n){const e=document.getElementById("chat-messages"),t=document.createElement("div");t.className=`flex ${o==="user"?"justify-end":"justify-start"}`,t.innerHTML=`
            <div class="max-w-xs ${o==="user"?"bg-primary-600 text-white":"bg-gray-100 text-gray-800"} 
                rounded-lg px-4 py-2">
                ${n}
            </div>
        `,e.appendChild(t),e.scrollTop=e.scrollHeight,this.messages.push({sender:o,text:n})}async sendMessage(){const o=document.getElementById("chat-input"),n=o.value.trim();n&&(this.addMessage("user",n),o.value="",setTimeout(()=>{this.handleBotResponse(n)},1e3))}async handleBotResponse(o){const n={hello:"Hi there! Welcome to Student Collaboration Platform. How can I help you today?",help:`I can help you with:
- Finding collaborators
- Creating projects
- Managing teams
- Technical support
- Platform features
- Account settings
- Project management
What would you like to know more about?`,project:`To create a project:
1. Go to your dashboard
2. Click "Create New Project"
3. Fill in the details
4. Click "Create"
Would you like more specific information?`,team:`To join a team:
1. Browse available teams
2. Click "Request to Join"
3. Wait for approval
4. Start collaborating!
Need more details?`,account:`For account-related queries:
- Update profile: Go to Profile Settings
- Change password: Security Settings
- Update skills: Edit Profile
- Manage notifications: Notification Settings`,features:`Our platform offers:
- Project creation and management
- Team collaboration tools
- Skill-based matching
- Real-time chat
- File sharing
- Progress tracking
- Feedback system`,collaborate:`To find collaborators:
1. Browse projects
2. Use the search filter
3. Check required skills
4. Send collaboration request
5. Wait for approval`,skills:`You can:
1. Add skills in your profile
2. Search projects by skills
3. Find team members by skills
4. Get skill recommendations
5. Track skill development`,dashboard:`Your dashboard includes:
- Active projects
- Team members
- Collaboration requests
- Project updates
- Recent activities
- Quick actions`,profile:`Your profile helps you:
- Showcase your skills
- Display your projects
- Get collaboration requests
- Build your portfolio
- Connect with others`,support:`For technical support:
1. Check our FAQ section
2. Contact support team
3. Report issues
4. Get help documentation
5. Join community forums`,default:`I'm here to help! You can ask about:
- Creating/joining projects
- Finding team members
- Managing your profile
- Platform features
- Account settings
- Technical support
- Skill development
- Collaboration tools`},e=o.toLowerCase();let t=n.default;e.includes("hello")||e.includes("hi")?t=n.hello:e.includes("help")?t=n.help:e.includes("project")?t=n.project:e.includes("team")?t=n.team:e.includes("account")||e.includes("profile")||e.includes("settings")?t=n.account:e.includes("feature")||e.includes("tool")?t=n.features:e.includes("collaborat")||e.includes("find team")||e.includes("find member")?t=n.collaborate:e.includes("skill")?t=n.skills:e.includes("dashboard")?t=n.dashboard:e.includes("profile")?t=n.profile:(e.includes("support")||e.includes("help")||e.includes("issue"))&&(t=n.support),this.addMessage("bot",t)}}document.addEventListener("DOMContentLoaded",()=>{new m});
