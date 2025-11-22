class Calendar {
  constructor() {
    this.currentDate = new Date();
    this.month = this.currentDate.getMonth();
    this.year = this.currentDate.getFullYear();
    this.prevMonthBtn = document.getElementById('prev-month-btn');
    this.nextMonthBtn = document.getElementById('next-month-btn');
    this.monthYearElement = document.getElementById('month-year');
    this.calendarBody = document.getElementById('calendar-body');
    this.prevMonthBtn.addEventListener('click', () => this.prevMonth());
    this.nextMonthBtn.addEventListener('click', () => this.nextMonth());
    this.renderCalendar();
  }

  renderCalendar() {
    this.monthYearElement.innerText = this.getMonthName(this.month) + ' ' + this.year;
    this.calendarBody.innerHTML = '';
    const firstDay = new Date(this.year, this.month, 1).getDay();
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < 7; j++) {
        const cell = document.createElement('td');
        if (i === 0 && j < firstDay) {
          cell.innerText = '';
        } else if (day > daysInMonth) {
          cell.innerText = '';
        } else {
          cell.innerText = day;
          if (this.year === this.currentDate.getFullYear() && this.month === this.currentDate.getMonth() && day === this.currentDate.getDate()) {
            cell.style.fontWeight = 'bold';
            cell.style.background = '#eff3fe';
            cell.style.color = '#80b2ff';
          }
          if (j === 0) { // Sunday
            cell.style.color = 'red';
          }
          // Check for deadlines
          const deadlines = tasks.filter(task => {
            if (task.status === 'Done') return false; // Skip done tasks and events
            if (task.type === 'task' && task.dueDate) {
              const dueDate = new Date(task.dueDate);
              return dueDate.getFullYear() === this.year && dueDate.getMonth() === this.month && dueDate.getDate() === day;
            } else if (task.type === 'event' && task.startDate) {
              const startDate = new Date(task.startDate);
              const endDate = new Date(task.endDate);
              return (startDate.getFullYear() === this.year && startDate.getMonth() === this.month && startDate.getDate() === day) || (endDate.getFullYear() === this.year && endDate.getMonth() === this.month && endDate.getDate() === day) || (startDate < new Date(this.year, this.month, day) && endDate > new Date(this.year, this.month, day));
            }
            return false;
          });
          const repeatingTasks = tasks.filter(task => {
            if (task.status === 'Done') return false; // Skip done tasks and events
            if (task.type === 'task' && task.dueDate && task.recurrence !== 'does-not-repeat') {
              const dueDate = new Date(task.dueDate);
              const recurrenceEndDate = task.recurrenceEndDate ? new Date(task.recurrenceEndDate) : null;
              if (recurrenceEndDate && recurrenceEndDate < new Date(this.year, this.month, day)) return false;
              switch (task.recurrence) {
                case 'every-day':
                  return new Date(this.year, this.month, day) >= new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
                case 'every-week':
                  return new Date(this.year, this.month, day) >= new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()) && dueDate.getDay() === new Date(this.year, this.month, day).getDay();
                case 'every-month':
                  return new Date(this.year, this.month, day) >= new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()) && dueDate.getDate() === day;
                case 'every-year':
                  return new Date(this.year, this.month, day) >= new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate()) && dueDate.getMonth() === this.month && dueDate.getDate() === day;
                default:
                  return false;
              }
            }
            return false;
          });
          if (deadlines.length > 0 || repeatingTasks.length > 0) {
            cell.innerText = day;
            deadlines.forEach(deadline => {
              const dotColor = deadline.type === 'task' ? '#FF6384' : '#4BC0C0'; // light red
              const dot = document.createElement('span');
              dot.style.width = '5px';
              dot.style.height = '5px';
              dot.style.background = dotColor;
              dot.style.borderRadius = '50%';
              dot.style.display = 'inline-block';
              dot.style.marginLeft = '5px';
              dot.style.padding = '0';
              dot.style.verticalAlign = 'middle';
              dot.style.cursor = 'pointer';
              dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskDetails = `Title: ${deadline.title}\nDescription: ${deadline.description || 'No description'}`;
                alert(`Task/Event \n\n${taskDetails}`);
              });
              cell.appendChild(dot);
            });
            repeatingTasks.forEach(repeatingTask => {
              const dot = document.createElement('span');
              dot.style.width = '5px';
              dot.style.height = '5px';
              dot.style.background = '#B2D1FF'; // light red
              dot.style.borderRadius = '50%';
              dot.style.display = 'inline-block';
              dot.style.marginLeft = '5px';
              dot.style.padding = '0';
              dot.style.verticalAlign = 'middle';
              dot.style.cursor = 'pointer';
              dot.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskDetails = `Title: ${repeatingTask.title}\nDescription: ${repeatingTask.description || 'No description'}`;
                alert(`Task/Event \n\n${taskDetails}`);
              });
              cell.appendChild(dot);
            });
            cell.style.cursor = 'pointer';
            cell.addEventListener('click', () => {
              const taskDetails = deadlines.map((deadline, index) => `${deadline.type === 'task' ? 'Task' : 'Event'} #${index + 1}:\nTitle: ${deadline.title}\nDescription: ${deadline.description || 'No description'}`).join('\n\n');
              const repeatingTaskDetails = repeatingTasks.map((repeatingTask, index) => `Repeating ${repeatingTask.type === 'task' ? 'Task' : 'Event'} #${index + 1}:\nTitle: ${repeatingTask.title}\nDescription: ${repeatingTask.description || 'No description'}`).join('\n\n');
              alert(`Tasks/Events \n\n${taskDetails}\n\n${repeatingTaskDetails}`);
            });
          } else {
            cell.innerText = day;
          }
          day++;
        }
        row.appendChild(cell);
      }
      this.calendarBody.appendChild(row);
    }
  }

  getMonthName(month) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
  }

  prevMonth() {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
    this.renderCalendar();
  }

  nextMonth() {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
    this.renderCalendar();
  }
}

function initCalendar() {
  const calendar = new Calendar();
}