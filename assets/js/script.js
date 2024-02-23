let addTodoFormVisible = false;
let updateTodoFormVisible = false;
let todoListVisible = true;

// fetchTodos function
function fetchTodos() {
    fetch('https://nicodeshub.com/todo_app/api/todo_list')
        .then(response => response.json())
        .then(data => {
            renderTodos(data);
        })
        .catch(error => console.error('Error fetching todos:', error));
}

// Function to render todo list
function renderTodos(todos) {
    const todosContainer = document.getElementById('todos');

    todosContainer.innerHTML = '';

    todos.forEach(todo => {
        const todoTr = document.createElement('tr');

        const titleTd = document.createElement('td');
        titleTd.textContent = todo.title;

        const statusTd = document.createElement('td');
        statusTd.textContent = todo.status;

        const detailsButtonTd = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.classList.add('btn', 'btn-primary');
        detailsButton.addEventListener('click', () => showTodoDetails(todo));
        detailsButtonTd.appendChild(detailsButton);

        todoTr.appendChild(titleTd);
        todoTr.appendChild(statusTd);
        todoTr.appendChild(detailsButtonTd);

        todosContainer.appendChild(todoTr);
    });
}

// Function to show todo list
function showTodoList() {
    const todoList = document.getElementById('todoList');
    todoList.style.display = 'block';
    todoListVisible = true;
}

// Function to hide todo list
function hideTodoList() {
    const todoList = document.getElementById('todoList');
    todoList.style.display = 'none';
    todoListVisible = false;
}

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}

// Function to show todo details
function showTodoDetails(todo) {
    const detailsContainer = document.getElementById('todoDetails');
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsDescription = document.getElementById('detailsDescription');
    const detailsCreatedDate = document.getElementById('detailsCreatedDate');
    const detailsDueDate = document.getElementById('detailsDueDate');
    const detailsStatus = document.getElementById('detailsStatus');
    const detailsCategory = document.getElementById('detailsCategory');
    const backButton = document.getElementById('backButton');
    const deleteButton = document.getElementById('deleteButton');
    const updateButton = document.getElementById('updateButton');

    detailsTitle.textContent = todo.title;
    detailsDescription.textContent = todo.description;
    detailsCreatedDate.textContent = formatDate(todo.date_created); 
    detailsDueDate.textContent = formatDate(todo.date_due); 
    detailsStatus.textContent = todo.status;
    detailsCategory.textContent = todo.category;

    hideTodoList();
    detailsContainer.style.display = 'block';

    // Show buttons
    backButton.style.display = 'inline-block';
    deleteButton.style.display = 'inline-block';
    updateButton.style.display = 'inline-block';

    // Add event listeners with the todo id
    backButton.addEventListener('click', () => {
        hideTodoDetails();
        showTodoList();
    });

    if (!deleteButton.getAttribute('data-event-listener-added')) {
        deleteButton.addEventListener('click', () => deleteTodoConfirm(todo.id));
        deleteButton.setAttribute('data-event-listener-added', 'true');
    }

    // Pass todo object to showUpdateTodoForm
    updateButton.addEventListener('click', () => {
        showUpdateTodoForm(todo);
        hideTodoDetails();
    });
}

// Function to hide todo details
function hideTodoDetails() {
    const detailsContainer = document.getElementById('todoDetails');
    detailsContainer.style.display = 'none';
}

// Function to show the add todo form
function showAddTodoForm() {
    if (!addTodoFormVisible && !updateTodoFormVisible) {
        hideTodoList();
        const addTodoForm = document.getElementById('addTodoForm');
        addTodoForm.style.display = 'block';
        addTodoFormVisible = true;
    }
}

// Function to hide the add todo form
function hideAddTodoForm() {
    const addTodoForm = document.getElementById('addTodoForm');
    addTodoForm.style.display = 'none';
    addTodoFormVisible = false;
    showTodoList();
}


// Define the addTodo function globally
function addTodo() {
    const titleInput = document.getElementById('title').value;
    const noteInput = document.getElementById('description').value;
    const dueDateInput = new Date(document.getElementById('dueDate').value);
    const completeInput = document.getElementById('status').value;
    const categoryInput = document.getElementById('category').value;

    const formattedDueDate = dueDateInput.toISOString().split('T')[0];

    const newTodo = {
        title: titleInput,
        description: noteInput,
        date_due: formattedDueDate,
        status: completeInput,
        category: categoryInput
    };

    fetch('https://nicodeshub.com/todo_app/api/add_todo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add todo');
        }
        fetchTodos();
        hideAddTodoForm();
        showSuccessMessage('Todo added successfully!');
    })
    .catch(error => console.error('Error adding todo:', error));
}

// Function to show the update todo form
function showUpdateTodoForm(todo) {
    if (!updateTodoFormVisible && !addTodoFormVisible) {
        hideTodoList();
        const updateTodoForm = document.getElementById('updateTodoForm');
        // Populate form fields with todo data
        document.getElementById('updateTitle').value = todo.title;
        document.getElementById('updateNote').value = todo.description;
        document.getElementById('updateDueDate').value = todo.date_due;
        document.getElementById('updateComplete').value = todo.status;
        document.getElementById('updateCategory').value = todo.category;
        document.getElementById('updateTodoId').value = todo.id;

        updateTodoForm.style.display = 'block';
        updateTodoFormVisible = true;
    }
}

// Function to hide the update todo form
function hideUpdateTodoForm() {
    const updateTodoForm = document.getElementById('updateTodoForm');
    updateTodoForm.style.display = 'none';
    updateTodoFormVisible = false;
    showTodoList();
}


// submitUpdate function
function submitUpdate() {
    const todoId = document.getElementById('updateTodoId').value;
    const updateTitleInput = document.getElementById('updateTitle').value;
    const updateNoteInput = document.getElementById('updateNote').value;
    const updateDueDateInput = new Date(document.getElementById('updateDueDate').value);
    const updateCompleteInput = document.getElementById('updateComplete').value;
    const updateCategoryInput = document.getElementById('updateCategory').value;

    const formattedDueDate = updateDueDateInput.toISOString().split('T')[0];

    const updatedTodo = {
        title: updateTitleInput,
        description: updateNoteInput,
        date_due: formattedDueDate,
        status: updateCompleteInput,
        category: updateCategoryInput
    };

    fetch(`https://nicodeshub.com/todo_app/api/update_todo/${todoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update todo');
        }
        fetchTodos();
        hideUpdateTodoForm();
        showSuccessMessage('Todo updated successfully!');
    })
    .catch(error => console.error('Error updating todo:', error));
}

// deleteTodoConfirm function
function deleteTodoConfirm(id) {
    const confirmDelete = confirm('Are you sure you want to delete this todo?');
    if (confirmDelete) {
        deleteTodo(id);
    }
}

// deleteTodo function
function deleteTodo(id) {
    fetch(`https://nicodeshub.com/todo_app/api/delete_todo/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete todo');
        }
        fetchTodos();
        showTodoList()
        hideTodoDetails();
        showSuccessMessage('Todo deleted successfully!');
    })
    .catch(error => console.error('Error deleting todo:', error));
}

// Function to show success message
function showSuccessMessage(message) {
    const successMessageText = document.getElementById('successMessageText');
    successMessageText.textContent = message;
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// fetch of todos when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    fetchTodos();
});
