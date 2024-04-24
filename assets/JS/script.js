// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskID () {
  return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const card = $('<div>').addClass('card').attr('data-task-id', task.id);

  const cardBody = $('<div>').addClass('card-body');

  const title = $('<h5>').addClass('card-title').text(task.title);

  const description = $('<p>').addClass('card-text').text(task.description);

  const dueDate = $('<p>').addClass('card-text').text(`Due: ${task.dueDate}`);

  const deleteBtn = $('<button>').addClass('btn btn-danger').text('Delete').on('click', function() {
      handleDeleteTask(task.id);
  });

  cardBody.append(title, description, dueDate, deleteBtn);

  card.append(cardBody);

  return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const todoList = $('#todo-cards');
  const inProgressList = $('#in-progress-cards');
  const doneList = $('#done-cards');

  // Clear existing content in task lists
  todoList.empty();
  inProgressList.empty();
  doneList.empty();

  taskList.forEach(task => {
      if (task.status === 'to-do') {
          todoList.append(createTaskCard(task));
      } else if (task.status === 'in-progress') {
         inProgressList.append(createTaskCard(task));
      } else if (task.status === 'done') {
          doneList.append(createTaskCard(task));
      }
  });

  // Make the cards draggable with specific options
  $('.card').draggable({
      opacity: 0.7, 
      zIndex: 100, 
      helper: function (e) {
          const original = $(e.target).hasClass('ui-draggable')
              ? $(e.target)
              : $(e.target).closest('.ui-draggable');
          return original.clone().css({
              width: original.outerWidth()
          });
      },
      revert: "invalid", 
      cursor: 'move'
  });

  // Make lanes droppable and accept dragged cards
  $('.lane').droppable({
      accept: ".card",
      drop: function(event, ui) {
          const newStatus = $(this).attr('id').replace('-cards', ''); 
          const taskId = ui.draggable.attr('data-task-id'); 
          const task = taskList.find(t => t.id === taskId);
          if (task) {
              task.status = newStatus;
              localStorage.setItem('tasks', JSON.stringify(taskList)); 
              renderTaskList(); 
          }
      }
  });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const title = $('#taskTitle').val();
  const description = $('#taskDescription').val();
  const dueDate = $('#taskDueDate').val();

  const task = {
      id: generateTaskId(),
      title: title,
      description: description,
      dueDate: dueDate,
      status: 'todo'
  };

  taskList.push(task);
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTaskList();
  $('#formModal').modal('hide'); 
  $('#taskForm')[0].reset(); 
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId) {
  var taskList = JSON.parse(localStorage.getItem('tasks')) || [];

  taskList = taskList.filter(function(task) {
      return task.id !== taskId;
  });

  localStorage.setItem('tasks', JSON.stringify(taskList));

  renderTaskList();
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const taskId = ui.draggable.data('task-id');
  console.log('Task ID:', taskId);

  const newStatus = $(event.target).attr('id');
  console.log('New Status:', newStatus);

  tasks.forEach(task => {
      if (task.id === taskId) {
          task.status = newStatus;
      }
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  renderTaskList();

  
  $('#taskForm').on('submit', function(event) {
     
      event.preventDefault();

     
      handleAddTask();
  });

 
  $('#taskDueDate').datepicker({
      dateFormat: 'mm/dd/yy' 
  });
});
