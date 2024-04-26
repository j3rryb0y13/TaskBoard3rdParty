// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to generate a unique task ID using crypto
function generateTaskId() {
    return crypto.randomUUID();
}

// Function to create a task card
function createTaskCard(task) {
  const card = $('<div>').addClass('card drag mb-3').attr('data-id', task.id).attr('data-status', task.status);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<h5>').addClass('card-text').text(task.description);
  const cardDueDate = $('<p>').addClass('card-text').text(`Due: ${task.dueDate}`);
  const cardDeleteBtn = $('<button>')
      .addClass('btn btn-danger delete')
      .text('Delete')
      .on('click', function() {
          if (confirm("Are you sure you want to delete this task?")) {
              card.remove();
              taskList = taskList.filter(t => t.id !== task.id);
              localStorage.setItem('tasks', JSON.stringify(taskList));
          }
      });

  // Color coding based on due date
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  if (dueDate.setHours(0,0,0,0) === today.setHours(0,0,0,0)) {
      card.addClass('bg-warning');
  } else if (dueDate < today) {
      card.addClass('bg-danger');
  }

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
        targetColumn.append(createTaskCard(task));
    });

    $(".drag").draggable({
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
  
  // Form validation
  if (title === '' || description === '' || dueDate === '') {
      alert("Please fill in all fields.");
      return;
  }

  const newTask = {
      id: generateTaskId(),
      title: title,
      description: description,
      dueDate: dueDate,
      status: 'to-do'
  };
  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList(); // Ensure renderTaskList is called after adding a new task
  $('#formModal').modal('hide');
}
// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const newStatus = $(this).attr('id').replace('-cards', '');
    const taskId = ui.draggable.attr('data-id');
    const task = taskList.find(t => t.id === taskId);
    if (task) {
        task.status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList();
    }
}

// Initialization on document ready
$(document).ready(function() {
    $('#taskForm').on('submit', handleAddTask);
    $('.lane').droppable({
        accept: ".drag",
        drop: handleDrop
    });
    $('#taskDueDate').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    renderTaskList();
});


console.log(taskList);
