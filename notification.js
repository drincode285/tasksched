class Notifications {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        console.log('Notif Initialized');
        this.dropdown = document.getElementById('notification-dropdown');
        this.btn = document.getElementById('notification-btn');
        this.list = document.getElementById('notification-list');
        this.count = document.getElementById('notification-count');
        this.noNotifications = document.getElementById('no-notifications');

        this.btn.addEventListener('click', () => this.toggleDropdown());
        this.loadUpcomingNotifications();
        this.updateUI();
    }

    loadUpcomingNotifications() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const upcoming = [];
        const now = new Date();
        const sevenDays = 7 * 86400000;

        tasks.forEach(task => {
            const due = new Date(task.dueDate);
            if (due - now < sevenDays && due > now && !task.completed) {
                upcoming.push({
                    id: `task-${task.id}`,
                    message: `Task: ${task.title} is due on ${due.toLocaleDateString()}`,
                    read: false,
                    date: due,
                    type: 'task'
                });
            }
        });

        events.forEach(event => {
            const date = new Date(event.date);
            if (date - now < sevenDays && date > now) {
                upcoming.push({
                    id: `event-${event.id}`,
                    message: `Event: ${event.title} is on ${date.toLocaleDateString()}`,
                    read: false,
                    date: date,
                    type: 'event'
                });
            }
        });

        upcoming.sort((a, b) => a.date - b.date);
        this.notifications = upcoming;
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    addNotification(message) {
        const notification = {
            id: Date.now(),
            message,
            read: false,
            date: new Date()
        };
        this.notifications.push(notification);
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        this.updateUI();
    }

    markAsRead(id) {
        this.notifications = this.notifications.map(n => n.id === id ? { ...n, read: true } : n);
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        this.updateUI();
    }

    markAllAsRead() {
        this.notifications = this.notifications.map(n => ({ ...n, read: true }));
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        this.updateUI();
    }

    updateUI() {
        const unread = this.notifications.filter(n => !n.read).length;
        if (unread > 0) {
            this.count.textContent = unread;
            this.count.style.display = 'block';
        } else {
            this.count.style.display = 'none';
        }
        this.list.innerHTML = '';
        if (this.notifications.length === 0) {
            this.noNotifications.style.display = 'block';
        } else {
            this.noNotifications.style.display = 'none';
            this.notifications.forEach(n => {
                const li = document.createElement('li');
                li.textContent = n.message;
                if (n.read) li.classList.add('read');
                li.onclick = () => this.markAsRead(n.id);
                this.list.appendChild(li);
            });
        }
    }

    toggleDropdown() {
        const isOpen = this.dropdown.style.display === 'block';
        this.dropdown.style.display = isOpen ? 'none' : 'block';
        if (!isOpen) {
            this.markAllAsRead();
        }
    }
}

// Usage
const notifications = new Notifications();


