// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    localStorage.setItem("nextId", JSON.stringify(randomId + 1));
    return randomId;
}

// Function to create a task card
function createTaskCard(task) {
    const newCard = $('<div>')
        .addClass('card drag mb-3')
        .attr('data-id', task.id);
    const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<h5>').addClass('card-text').text(task.description);
    const cardDueDate = $('<p>').addClass('card-text').text("Due: " + task.dueDate);
    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-id', task.id)
        .on('click', function() {
            handleDeleteTask(task.id);
        });

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    newCard.append(cardHeader, cardBody);
    return newCard;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();

  taskList.forEach(task => {
      let status = task.status || task.state;  // Handle mixed property usage
      if (status === 'to-do') {
          $('#todo-cards').append(createTaskCard(task));
      } else if (status === 'in-progress') {
          $('#in-progress-cards').append(createTaskCard(task));
      } else if (status === 'done') {
          $('#done-cards').append(createTaskCard(task));
      }
  });

  $(".drag").draggable({
      containment: 'document',
      revert: 'invalid',
      helper: 'clone'
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    const title = $('#task-title').val();
    const dueDate = $('#task-due-date').val();
    const description = $('#message-text').val();
    const newTask = {
        id: generateTaskId(),
        title,
        dueDate,
        description,
        state: 'to-do'
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    $('#formModal').modal('hide');
}

// Function to handle deleting a task
function handleDeleteTask(id) {
    taskList = taskList.filter(task => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const droppedItem = ui.draggable;
  const newStatus = $(this).attr('id').replace('-cards', '');

  // Find the task in the taskList and update its status
  const taskId = droppedItem.data('id');
  const task = taskList.find(task => task.id === taskId);
  if (task) {
      task.status = newStatus;
      localStorage.setItem('tasks', JSON.stringify(taskList));  // Update localStorage
      renderTaskList();  // Re-render to reflect changes
  }
}

// When the page loads
$(document).ready(function () {
    renderTaskList();
    $('#taskForm').on('submit', handleAddTask);
    $('#task-due-date').datepicker({
        changeMonth: true,
        changeYear: true
    });
    $('.lane').droppable({
        accept: '.drag',
        drop: handleDrop
    });
});
