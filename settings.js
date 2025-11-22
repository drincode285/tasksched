class Settings {
    constructor() {
        this.notificationToggle = document.getElementById('notification-toggle');
        this.logoutBtn = document.getElementById('logout-btn');

        this.initSettings();
        this.addEventListeners();
    }

    initSettings() {
        if (this.notificationToggle) {
            // Load notification preference
            const notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
            this.notificationToggle.checked = notificationsEnabled;
        }
    }

    addEventListeners() {
        if (this.notificationToggle) {
            this.notificationToggle.addEventListener('change', (e) => this.toggleNotifications(e.target.checked));
        }
        if (this.logoutBtn) {
            this.logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    toggleNotifications(enabled) {
        localStorage.setItem('notificationsEnabled', enabled);
        window.dispatchEvent(new CustomEvent('notificationsToggled', { detail: enabled }));
        console.log(`Notifications ${enabled ? 'enabled' : 'disabled'}`);
    }

    logout() {
        // Clear any stored authentication tokens or user data
        localStorage.removeItem('userToken');
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Usage
const settings = new Settings();