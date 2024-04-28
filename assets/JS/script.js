// Retrieve tasks from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to generate a unique task ID
function generateTaskId() {
  return crypto.randomUUID();
}

// Function to create a task card
function createTaskCard(task) {
  let card = $('<div class="card drag mb-3"></div>').attr('data-id', task.id).attr('data-status', task.status);
  let cardHeader = $('<div class="card-header h4"></div>').text(task.title);
  let cardBody = $('<div class="card-body"></div>');
  let cardDescription = $('<h5 class="card-text"></div>').text(task.description);
  let cardDueDate = $('<p class="card-text"></div>').text(`Due: ${task.dueDate}`);
  let cardDeleteBtn = $('<button class="btn btn-danger delete"></button>').text('Delete').on('click', function () {
    if (confirm("Are you sure you want to delete this task?")) {
      $(this).closest('.card').remove();
      taskList = taskList.filter(t => t.id !== task.id);
      localStorage.setItem('tasks', JSON.stringify(taskList));
      renderTaskList();  // Refresh the list after deletion
    }
  });

  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  card.append(cardHeader, cardBody);
  return card;
}

// Function to render the task list
function renderTaskList() {
  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();

  taskList.forEach(task => {
    const targetColumn = $(`#${task.status}-cards`);
    const card = createTaskCard(task);
    targetColumn.append(card);
  });

  // Initialize draggable for the task cards
  $(".card.drag").draggable({
    containment: "document",
    cursor: "move",
    helper: "clone",
    revert: "invalid"
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  
  const title = $('#taskTitle').val().trim();
  const description = $('#taskDescription').val().trim();
  const dueDate = $('#taskDueDate').val().trim();
  
  const newTask = {
    id: generateTaskId(),
    title: title,
    description: description,
    dueDate: dueDate,
    status: 'todo'  // Make sure this matches your HTML container IDs
  };
  
  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();  // Refresh the list after adding
  $('#formModal').modal('hide');  // Hide the modal form after submission
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const newStatus = this.id.replace('-cards', '');
  const taskId = ui.draggable.attr('data-id');
  const task = taskList.find(t => t.id === taskId);
  if (task) {
    task.status = newStatus;
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();
  }
}

$(document).ready(function() {
  $('#taskForm').on('submit', handleAddTask);

  // Droppable areas initialization
  $('.lane').droppable({
    accept: ".card.drag",
    drop: handleDrop,
    tolerance: "intersect"
  });

  // Initialize the datepicker
  $('#taskDueDate').datepicker({
    dateFormat: 'yy-mm-dd'
  });

  // Load tasks from localStorage and render them
  taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  renderTaskList();
});
