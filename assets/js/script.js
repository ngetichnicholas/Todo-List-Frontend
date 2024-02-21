let addTodoFormVisible = false;
let updateTodoFormVisible = false;


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

        const actionsTd = document.createElement('td');
        const updateButton = document.createElement('button');
        updateButton.textContent = 'Update';
        updateButton.classList.add('btn', 'btn-primary', 'me-2');
        updateButton.addEventListener('click', () => showUpdateTodoForm(todo));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.addEventListener('click', () => deleteTodoConfirm(todo.id));

        actionsTd.appendChild(updateButton);
        actionsTd.appendChild(deleteButton);

        todoTr.appendChild(titleTd);
        todoTr.appendChild(noteTd);
        todoTr.appendChild(dueDateTd);
        todoTr.appendChild(statusTd);
        todoTr.appendChild(categoryTd);
        todoTr.appendChild(actionsTd);

        todosContainer.appendChild(todoTr);
    });
}

// Function to show the add todo form
function showAddTodoForm() {
    if (!addTodoFormVisible && !updateTodoFormVisible) {
        const addTodoForm = document.getElementById('addTodoForm');
        addTodoForm.style.display = 'block';
        addTodoFormVisible = true;
    }
}

// Function to show the update todo form
function showUpdateTodoForm(todo) {
    if (!updateTodoFormVisible && !addTodoFormVisible) {
        const updateTodoForm = document.getElementById('updateTodoForm');
        updateTodoForm.innerHTML = `
            <h3>Update Todo</h3>
            <div class="form-group">
                <label for="updateTitle">Title:</label>
                <input type="text" id="updateTitle" class="form-control" value="${todo.title}">
            </div>
            <div class="form-group">
                <label for="updateNote">Note:</label>
                <input type="text" id="updateNote" class="form-control" value="${todo.description}">
            </div>
            <div class="form-group">
                <label for="updateDueDate">Due Date:</label>
                <input type="date" id="updateDueDate" class="form-control" value="${todo.date_due}">
            </div>
            <div class="form-group">
                <label for="updateComplete">Complete:</label>
                <select id="updateComplete" class="form-control">
                    <option value="Complete" ${todo.status === 'Complete' ? 'selected' : ''}>Complete</option>
                    <option value="Pending" ${todo.status === 'Pending' ? 'selected' : ''}>Pending</option>
                </select>
            </div>
            <div class="form-group">
                <label for="updateCategory">Category:</label>
                <input type="text" id="updateCategory" class="form-control" value="${todo.category}">
            </div>
            <button onclick="submitUpdate(${todo.id})" class="btn btn-primary">Update</button>
            <button onclick="hideUpdateTodoForm()" class="btn btn-secondary">Cancel</button>
        `;
        updateTodoForm.style.display = 'block';
        updateTodoFormVisible = true;
    }
}

// Function to hide the add todo form
function hideAddTodoForm() {
    const addTodoForm = document.getElementById('addTodoForm');
    addTodoForm.style.display = 'none';
    addTodoFormVisible = false;
}

// Function to hide the update todo form
function hideUpdateTodoForm() {
    const updateTodoForm = document.getElementById('updateTodoForm');
    updateTodoForm.innerHTML = '';
    updateTodoForm.style.display = 'none';
    updateTodoFormVisible = false;
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
function submitUpdate(todoId) {
    console.log("Updating todo with ID:", todoId);
    hideUpdateTodoForm(); 
    showSuccessMessage('Todo updated successfully!');
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