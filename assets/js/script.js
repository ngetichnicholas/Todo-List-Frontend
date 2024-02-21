let addTodoFormVisible = false;
let updateTodoFormVisible = false;

// Function to show the add todo form
function showAddTodoForm() {
    if (!addTodoFormVisible && !updateTodoFormVisible) {
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
}

// Function to show the update todo form
function showUpdateTodoForm(todo) {
    if (!updateTodoFormVisible && !addTodoFormVisible) {
        const updateTodoForm = document.getElementById('updateTodoForm');
        // Populate form fields with todo data
        document.getElementById('updateTitle').value = todo.title;
        document.getElementById('updateNote').value = todo.description;
        document.getElementById('updateDueDate').value = todo.date_due;
        document.getElementById('updateComplete').value = todo.status;
        document.getElementById('updateCategory').value = todo.category;
        document.getElementById('updateTodoId').value = todo.id; // Set the value of the hidden input field

        updateTodoForm.style.display = 'block';
        updateTodoFormVisible = true;
    }
}


// Function to hide the update todo form
function hideUpdateTodoForm() {
    const updateTodoForm = document.getElementById('updateTodoForm');
    updateTodoForm.style.display = 'none';
    updateTodoFormVisible = false;
}

function renderTodos(todos) {
    const todosContainer = document.getElementById('todos');
    const detailsContainer = document.getElementById('details');

    todosContainer.innerHTML = '';
    detailsContainer.innerHTML = '';

    todos.forEach(todo => {
        const todoTr = document.createElement('tr');

        const titleTd = document.createElement('td');
        titleTd.textContent = todo.title;

        const noteTd = document.createElement('td');
        noteTd.textContent = todo.description;

        // Format the date to display only the date without time and timezone
        const dueDate = new Date(todo.date_due);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const formattedDueDate = dueDate.toLocaleDateString('en-US', options);

        const dueDateTd = document.createElement('td');
        dueDateTd.textContent = formattedDueDate;

        const statusTd = document.createElement('td');
        statusTd.textContent = todo.status;

        const categoryTd = document.createElement('td');
        categoryTd.textContent = todo.category;

        const updateButtonTd = document.createElement('td'); // Create td for update button
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('btn', 'btn-primary', 'me-2');
        updateButton.addEventListener('click', () => showUpdateTodoForm(todo));
        updateButtonTd.appendChild(updateButton); // Append button to its td

        const deleteButtonTd = document.createElement('td'); // Create td for delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.addEventListener('click', () => deleteTodoConfirm(todo.id));
        deleteButtonTd.appendChild(deleteButton); // Append button to its td

        todoTr.appendChild(titleTd);
        todoTr.appendChild(noteTd);
        todoTr.appendChild(dueDateTd);
        todoTr.appendChild(statusTd);
        todoTr.appendChild(categoryTd);
        todoTr.appendChild(updateButtonTd); // Append update button td
        todoTr.appendChild(deleteButtonTd); // Append delete button td

        todosContainer.appendChild(todoTr);
    });
}

// fetchTodos function
function fetchTodos() {
    fetch('https://nicodeshub.com/todo_app/api/todo_list')
        .then(response => response.json())
        .then(data => {
            renderTodos(data); 
        })
        .catch(error => console.error('Error fetching todos:', error));
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

// submitUpdate function
function submitUpdate() {
    const todoId = document.getElementById('updateTodoId').value; // Retrieve todoId from hidden input field
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
