let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTask;
let currentIndex;

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const leftHamburger = document.getElementById('left-hamburger');
const leftNavLinks = document.getElementById('left-nav-links');
const leftHeaderTitle = document.getElementById('left-header-title');
const navItems = document.querySelectorAll('.nav-item');
const addTaskButton = document.getElementById('add-task-button');
const taskFormContainer = document.getElementById('task-form-container');
const cancelButton = document.getElementById('cancel-button');
const typeSelect = document.getElementById('type');
const taskFields = document.getElementById('task-fields');
const eventFields = document.getElementById('event-fields');
const allDayCheckbox = document.getElementById('all-day');
const dueDateInput = document.getElementById('due-date');

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to display tasks
function displayTasks() {
  const taskList = document.getElementById('task-list');
  const statusList = document.getElementById('status-list');
  taskList.innerHTML = '';
  statusList.innerHTML = '';

  // Separate tasks and events
  const taskItems = tasks.filter(task => task.type === 'task' && task.status !== 'Done');
  const eventItems = tasks.filter(task => task.type === 'event' && task.status !== 'Done');
  const doneTaskItems = tasks.filter(task => task.type === 'task' && task.status === 'Done');
  const doneEventItems = tasks.filter(task => task.type === 'event' && task.status === 'Done');

  // Sort tasks by due date
  taskItems.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return dateA - dateB;
  });

  // Sort events by start date
  eventItems.sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA - dateB;
  });

  // Display tasks
  const taskHeader = document.createElement('h3');
  taskHeader.classList.add('status-header');
  taskHeader.textContent = 'Tasks';
  statusList.appendChild(taskHeader);
  taskItems.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('status');
    taskElement.innerHTML = `
      <h4>${task.title}</h4>
      <p>DUE DATE: ${task.dueDate}</p>
      <p>STATUS: ${task.status || 'No Status'}</p>
    `;
    taskElement.addEventListener('click', () => {
      showContextMenu(task, tasks.indexOf(task), taskElement);
    });
    statusList.appendChild(taskElement);
  });

  // Display done tasks
  const doneTaskHeader = document.createElement('h3');
  doneTaskHeader.classList.add('status-header');
  doneTaskHeader.textContent = 'Done Tasks';
  doneTaskHeader.style.marginTop = '20px';
  statusList.appendChild(doneTaskHeader);
  doneTaskItems.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('status');
    taskElement.style.opacity = '0.5';
    taskElement.innerHTML = `
      <h4><strike>${task.title}</strike></h4>
      <p>DUE DATE: ${task.dueDate}</p>
      <p>STATUS: ${task.status || 'No Status'}</p>
    `;
    taskElement.addEventListener('click', () => {
      showContextMenu(task, tasks.indexOf(task), taskElement);
    });
    statusList.appendChild(taskElement);
  });

  // Display events
  const eventHeader = document.createElement('h3');
  eventHeader.classList.add('status-header');
  eventHeader.textContent = 'Events';
  eventHeader.style.marginTop = '20px';
  statusList.appendChild(eventHeader);
  eventItems.forEach((event, index) => {
    const eventElement = document.createElement('div');
    eventElement.classList.add('status');
    eventElement.innerHTML = `
      <h4>${event.title}</h4>
      <p>START DATE: ${event.startDate}</p>
      <p>END DATE: ${event.endDate}</p>
      <p>STATUS: ${event.status || 'No Status'}</p>
    `;
    eventElement.addEventListener('click', () => {
      showContextMenu(event, tasks.indexOf(event), eventElement);
    });
    statusList.appendChild(eventElement);
  });

  // Display done events
  const doneEventHeader = document.createElement('h3');
  doneEventHeader.classList.add('status-header');
  doneEventHeader.textContent = 'Done Events';
  doneEventHeader.style.marginTop = '20px';
  statusList.appendChild(doneEventHeader);
  doneEventItems.forEach((event, index) => {
    const eventElement = document.createElement('div');
    eventElement.classList.add('status');
    eventElement.style.opacity = '0.5';
    eventElement.innerHTML = `
      <h4><strike>${event.title}</strike></h4>
      <p>START DATE: ${event.startDate}</p>
      <p>END DATE: ${event.endDate}</p>
      <p>STATUS: ${event.status || 'No Status'}</p>
    `;
    eventElement.addEventListener('click', () => {
      showContextMenu(event, tasks.indexOf(event), eventElement);
    });
    statusList.appendChild(eventElement);
  });

  // Display tasks in left column
  const activeTasks = tasks.filter(task => task.status !== 'Done');
  activeTasks.sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (a.priority !== 'high' && b.priority === 'high') return 1;
    if (a.priority === 'medium' && b.priority === 'low') return -1;
    if (a.priority === 'low' && b.priority === 'medium') return 1;
    return 0;
  });
  activeTasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
      <h3>${task.title}</h3>
      <p>PRIORITY: ${task.priority}</p>
      ${task.dueDate ? `<p>DUE DATE: ${task.dueDate}</p>` : ''}
      ${task.startDate ? `<p>START DATE: ${task.startDate}</p>` : ''}
      ${task.endDate ? `<p>END DATE: ${task.endDate}</p>` : ''}
      <p>STATUS: ${task.status || 'No Status'}</p>
      ${task.description ? `<p class="description">DESCRIPTION: ${task.description}<span class="tooltip">${task.description}</span></p>` : ''}
    `;
    taskElement.addEventListener('click', () => {
      showContextMenu(task, tasks.indexOf(task), taskElement);
    });
    taskList.appendChild(taskElement);
  });
}

// Function to show context menu
function showContextMenu(task, index, element) {
  const contextMenu = document.getElementById('context-menu');
  contextMenu.style.top = `${element.offsetTop + element.offsetHeight}px`;
  contextMenu.style.left = `${element.offsetLeft}px`;
  contextMenu.style.display = 'block';
  currentTask = task;
  currentIndex = tasks.indexOf(task);
}

// Function to delete task
function deleteTask(task, index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  displayTasks();
}

// Function to edit task
function editTask(task, index) {
  // Populate the task form with the current task data
  document.getElementById('type').value = task.type;
  document.getElementById('title').value = task.title;
  document.getElementById('priority').value = task.priority;
  document.getElementById('description').value = task.description;
  if (task.type === 'task') {
    document.getElementById('due-date').value = task.dueDate;
    document.getElementById('status').value = task.status;
    taskFields.style.display = 'block';
    eventFields.style.display = 'none';
  } else {
    document.getElementById('start-date').value = task.startDate;
    document.getElementById('end-date').value = task.endDate;
    taskFields.style.display = 'none';
    eventFields.style.display = 'block';
  }
  taskFormContainer.classList.add('show');
  document.getElementById('form-title').textContent = 'Update Task/Event';
  document.getElementById('submit-button').textContent = 'Update';
}

// Function to mark task as done
function markAsDone(task, index) {
  task.status = 'Done';
  tasks[index] = task;
  saveTasks();
  displayTasks();
}


// Event listener for hamburger menu
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Event listener for left hamburger menu
leftHamburger.addEventListener('click', () => {
  leftNavLinks.classList.toggle('show');
});

// Event listener for nav items
navItems.forEach(item => {
  item.addEventListener('click', () => {
    leftHeaderTitle.textContent = item.dataset.item;
    leftNavLinks.classList.remove('show');
    if (item.dataset.item === 'Calendar') {
      document.getElementById('task-list').style.display = 'none';
      document.getElementById('calendar').style.display = 'block';
      initCalendar();
    } else {
      document.getElementById('calendar').style.display = 'none';
      document.getElementById('task-list').style.display = 'block';
      displayTasks();
    }
  });
});


// Event listener for add task button
addTaskButton.addEventListener('click', () => {
  currentTask = null;
  document.getElementById('form-title').textContent = 'Create Task/Event';
  document.getElementById('submit-button').textContent = 'Create';
  document.getElementById('task-form').reset();
  taskFields.style.display = 'block';
  eventFields.style.display = 'none';
  taskFormContainer.classList.add('show');
});

// Event listener for cancel button
cancelButton.addEventListener('click', () => {
  taskFormContainer.classList.remove('show');
});

// Event listener for type select
typeSelect.addEventListener('change', () => {
  if (typeSelect.value === 'task') {
    taskFields.style.display = 'block';
    eventFields.style.display = 'none';
  } else {
    taskFields.style.display = 'none';
    eventFields.style.display = 'block';
  }
});

// Event listener for document click
document.addEventListener('click', (e) => {
  if (!e.target.closest('#context-menu') && !e.target.closest('.task') && !e.target.closest('.status')) {
    document.getElementById('context-menu').style.display = 'none';
  }
  if (e.target.classList.contains('description')) {
    e.target.classList.toggle('show');
  }
});

// Event listener for task form submit
document.getElementById('task-form').onsubmit = (e) => {
  e.preventDefault();
  if (currentTask) {
    // Update existing task
    currentTask.title = document.getElementById('title').value;
    currentTask.priority = document.getElementById('priority').value;
    currentTask.description = document.getElementById('description').value;
    if (currentTask.type === 'task') {
      currentTask.dueDate = document.getElementById('due-date').value;
      currentTask.allDay = document.getElementById('all-day').checked;
      currentTask.recurrence = document.getElementById('recurrence').value;
      if (currentTask.recurrence !== 'does-not-repeat') {
        currentTask.recurrenceEndDate = document.getElementById('recurrence-end-date-input').value;
      }
      currentTask.status = document.getElementById('status').value;
    } else {
      currentTask.startDate = document.getElementById('start-date').value;
      currentTask.endDate = document.getElementById('end-date').value;
    }
    tasks[currentIndex] = currentTask;
    currentTask = null;
  } else {
    // Create new task
    const type = document.getElementById('type').value;
    const task = {
      title: document.getElementById('title').value,
      priority: document.getElementById('priority').value,
      description: document.getElementById('description').value,
      type: type,
    };
    if (type === 'task') {
      task.dueDate = document.getElementById('due-date').value;
      task.allDay = document.getElementById('all-day').checked;
      task.recurrence = document.getElementById('recurrence').value;
      if (task.recurrence !== 'does-not-repeat') {
        task.recurrenceEndDate = document.getElementById('recurrence-end-date-input').value;
      }
      task.status = document.getElementById('status').value;
    } else {
      task.startDate = document.getElementById('start-date').value;
      task.endDate = document.getElementById('end-date').value;
      task.status = 'Upcoming';
    }
    tasks.push(task);
  }
  saveTasks();
  displayTasks();
  taskFormContainer.classList.remove('show');
  document.getElementById('task-form').reset();
};

document.querySelector('[data-item="Calendar"]').addEventListener('click', () => {
  document.getElementById('task-list').style.display = 'none';
  document.getElementById('calendar').style.display = 'block';
  leftHeaderTitle.textContent = 'Calendar';
  initCalendar();
});

// Event listeners for context menu
document.getElementById('delete-button').addEventListener('click', () => {
  deleteTask(currentTask, currentIndex);
  document.getElementById('context-menu').style.display = 'none';
});

document.getElementById('edit-button').addEventListener('click', () => {
  editTask(currentTask, currentIndex);
  document.getElementById('context-menu').style.display = 'none';
});

document.getElementById('mark-as-done-button').addEventListener('click', () => {
  markAsDone(currentTask, currentIndex);
  document.getElementById('context-menu').style.display = 'none';
});

// Event listener to recurrence select
document.getElementById('recurrence').addEventListener('change', () => {
  const recurrence = document.getElementById('recurrence').value;
  if (recurrence !== 'does-not-repeat') {
    document.getElementById('recurrence-end-date').style.display = 'block';
  } else {
    document.getElementById('recurrence-end-date').style.display = 'none';
  }
});


allDayCheckbox.addEventListener('change', () => {
  if (allDayCheckbox.checked) {
    dueDateInput.type = 'date';
  } else {
    dueDateInput.type = 'datetime-local';
  }
});

displayTasks();