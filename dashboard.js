const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const textColor = isDarkMode ? '#FFFFFF' : '#333333';

document.addEventListener('DOMContentLoaded', () => {
    updateUpcomingTasksEvents();
    drawChart(JSON.parse(localStorage.getItem('tasks')) || []);
    initCalendar();
});
function updateUpcomingTasksEvents() {
    const upcomingTasksEventsList = document.getElementById('upcoming-tasks-events');
    upcomingTasksEventsList.innerHTML = ''; // Clear the list

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const upcomingTasksEvents = tasks.filter(task => {
        if (task.type === 'task' && task.dueDate && task.status !== 'Done') {
            return new Date(task.dueDate) > new Date();
        } else if (task.type === 'event' && task.startDate && task.status !== 'ended') {
            return new Date(task.startDate) > new Date();
        }
        return false;
    })
    .sort((a, b) => {
        if (a.type === 'task' && b.type === 'task') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (a.type === 'event' && b.type === 'event') {
            return new Date(a.startDate) - new Date(b.startDate);
        } else if (a.type === 'task' && b.type === 'event') {
            return new Date(a.dueDate) - new Date(b.startDate);
        } else {
            return new Date(a.startDate) - new Date(b.dueDate);
        }
    })
    .slice(0, 3); // Limit to 3 items

    if (upcomingTasksEvents.length === 0) {
        upcomingTasksEventsList.innerHTML = '<li>No upcoming tasks or events.</li>';
    } else {
        upcomingTasksEvents.forEach(task => {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const taskElement = document.createElement('li');
            const date = task.type === 'task' ? task.dueDate : task.startDate;
            taskElement.innerHTML = `<span class="task-link">${task.title} - ${task.type}</span>`;
            taskElement.addEventListener('click', () => {
                alert(`Title: ${task.title}\nDescription: ${task.description}\nDate: ${task.dueDate || task.startDate}`);
            });
            upcomingTasksEventsList.appendChild(taskElement);
        });
    }
}

function drawChart(tasks) {
    // Get the canvas element
    const taskEventStatisticsCanvas = document.getElementById('task-event-statistics');
    const ctx = taskEventStatisticsCanvas.getContext('2d');

    // Display task and event statistics
    const taskStatusCounts = {
        pending: tasks.filter(task => task.status === 'pending').length,
        inProgress: tasks.filter(task => task.status === 'in-progress').length,
        done: tasks.filter(task => task.status === 'Done').length,
    };
    const eventStatusCounts = {
        upcoming: tasks.filter(task => task.type === 'event' && new Date(task.startDate) > new Date()).length,
        ongoing: tasks.filter(task => task.type === 'event' && new Date(task.startDate) <= new Date() && new Date(task.endDate) >= new Date()).length,
        ended: tasks.filter(task => task.type === 'event' && new Date(task.endDate) < new Date()).length,
    };

    // Pie chart data
    const labels = ['Pending Tasks', 'In Progress Tasks', 'Done Tasks', 'Upcoming Events', 'Ongoing Events', 'Ended Events'];
    const data = [taskStatusCounts.pending, taskStatusCounts.inProgress, taskStatusCounts.done, eventStatusCounts.upcoming, eventStatusCounts.ongoing, eventStatusCounts.ended];
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    // Draw the pie chart
    let total = data.reduce((a, b) => a + b, 0);
    let startAngle = 0;
    ctx.clearRect(0, 0, taskEventStatisticsCanvas.width, taskEventStatisticsCanvas.height);

    for (let i = 0; i < data.length; i++) {
        let sliceAngle = (data[i] / total) * 2 * Math.PI;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.moveTo(taskEventStatisticsCanvas.width / 2, taskEventStatisticsCanvas.height / 2);
        ctx.arc(taskEventStatisticsCanvas.width / 2, taskEventStatisticsCanvas.height / 2, Math.min(taskEventStatisticsCanvas.width, taskEventStatisticsCanvas.height) / 3, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        startAngle += sliceAngle;
    }

    // Draw legend
    let legendX = 10;
    let legendY = 10;
    for (let i = 0; i < labels.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(legendX, legendY, 10, 10);
        ctx.fillStyle = '#4c4c4c';
        ctx.fillStyle = textColor;
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`${labels[i]}: ${data[i]}`, legendX + 15, legendY);
        legendY += 20;
    }
}