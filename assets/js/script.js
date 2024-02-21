document.addEventListener("DOMContentLoaded", function() {
    fetchAndRenderTodos();
});

// Function to fetch todos from the API and render them
function fetchAndRenderTodos() {
    fetch('https://nicodeshub.com/todo_app/api/todo_list')
        .then(response => response.json())
        .then(data => {
            renderTodos(data); // Call renderTodos to display fetched todos
        })
        .catch(error => console.error('Error fetching todos:', error));
}

// Function to render todos
function renderTodos(todos) {
    const todosContainer = document.getElementById('todos');
    todosContainer.innerHTML = ''; // Clear existing content

    todos.forEach(todo => {
        const todoHtml = `
            <tr>
                <td>${todo.title}</td>
                <td>${todo.note}</td>
                <td>${todo.date_due}</td>
                <td>${todo.complete}</td>
                <td>${todo.category}</td>
                <td>
                    <button class="btn btn-primary me-2" onclick="updateTodoForm(${todo.id})">Update</button>
                    <button class="btn btn-danger" onclick="deleteTodoConfirm(${todo.id})">Delete</button>
                </td>
            </tr>
        `;
        todosContainer.innerHTML += todoHtml;
    });
}

// Function to add a new todo
function addTodo() {
    const titleInput = document.getElementById('title').value;
    const noteInput = document.getElementById('note').value;
    const dueDateInput = document.getElementById('dueDate').value;
    const completeInput = document.getElementById('complete').value;
    const categoryInput = document.getElementById('category').value;

    const newTodo = {
        title: titleInput,
        note: noteInput,
        date_due: dueDateInput,
        complete: completeInput,
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
        fetchAndRenderTodos(); // Refresh the list after adding a new todo
    })
    .catch(error => console.error('Error adding todo:', error));
}

// Function to show the add todo form
function showAddTodoForm() {
    const addTodoForm = document.getElementById('addTodoForm');
    addTodoForm.style.display = 'block';
}

// Function to update todo form
function updateTodoForm(todoId) {
    // Your code for updating the todo form goes here
    console.log("Updating todo with ID:", todoId);
}

// Function to confirm deletion of todo
function deleteTodoConfirm(id) {
    const confirmDelete = confirm('Are you sure you want to delete this todo?');
    if (confirmDelete) {
        deleteTodo(id);
    }
}

// Function to delete todo
function deleteTodo(id) {
    fetch(`https://nicodeshub.com/todo_app/api/delete_todo/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete todo');
        }
        fetchAndRenderTodos(); // Refresh the list after deleting a todo
    })
    .catch(error => console.error('Error deleting todo:', error));
}
