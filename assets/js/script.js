// Define the addTodo function globally
function addTodo() {
    const titleInput = document.getElementById('title').value;
    const noteInput = document.getElementById('note').value;
    const dueDateInput = new Date(document.getElementById('dueDate').value);
    const completeInput = document.getElementById('complete').value;
    const categoryInput = document.getElementById('category').value;

    // Format date as YYYY-MM-DD
    const formattedDueDate = dueDateInput.toISOString().split('T')[0];

    const newTodo = {
        title: titleInput,
        note: noteInput,
        date_due: formattedDueDate,
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
        fetchTodos();
    })
    .catch(error => console.error('Error adding todo:', error));
}

// Add the rest of the code within the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function() {
    const todosContainer = document.getElementById('todos');
    const detailsContainer = document.getElementById('details');

    // Fetch todos from backend and display them
    function fetchTodos() {
        fetch('https://nicodeshub.com/todo_app/api/todo_list')
            .then(response => response.json())
            .then(data => {
                renderTodos(data);
            })
            .catch(error => console.error('Error fetching todos:', error));
    }
    // Render todos in the UI
    function renderTodos(todos) {
        todosContainer.innerHTML = '';
        detailsContainer.innerHTML = '';

        todos.forEach(todo => {
            const todoDiv = document.createElement('div');
            todoDiv.className = 'todo-item';

            const title = document.createElement('span');
            title.textContent = todo.title;
            title.addEventListener('click', () => showTodoDetails(todo.id));

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.addEventListener('click', () => updateTodoForm(todo.id));

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTodoConfirm(todo.id));

            todoDiv.appendChild(title);
            todoDiv.appendChild(updateButton);
            todoDiv.appendChild(deleteButton);
            todosContainer.appendChild(todoDiv);
        });
    }

    // Show details of a todo
    function showTodoDetails(id) {
        fetch(`https://nicodeshub.com/todo_app/api/todo_details/${id}`)
            .then(response => response.json())
            .then(data => {
                detailsContainer.innerHTML = `
                    <h2>${data.title}</h2>
                    <p>Note: ${data.note}</p>
                    <p>Due Date: ${data.date_due}</p>
                    <p>Complete: ${data.complete}</p>
                    <p>Category: ${data.category}</p>
                `;
            })
            .catch(error => console.error('Error fetching todo details:', error));
    }

    // Add new todo
    function addTodo() {
        const titleInput = document.getElementById('title').value;
        const noteInput = document.getElementById('note').value;
        const dueDateInput = new Date(document.getElementById('dueDate').value);
        const completeInput = document.getElementById('complete').value;
        const categoryInput = document.getElementById('category').value;

        // Format date as YYYY-MM-DD
        const formattedDueDate = dueDateInput.toISOString().split('T')[0];

        const newTodo = {
            title: titleInput,
            note: noteInput,
            date_due: formattedDueDate,
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
            fetchTodos();
        })
        .catch(error => console.error('Error adding todo:', error));
    }

    // Show update todo form
    function updateTodoForm(todoId) {
        // Fetch the todo details by id
        fetch(`https://nicodeshub.com/todo_app/api/todo_details/${todoId}`)
            .then(response => response.json())
            .then(todo => {
                // Create the update form HTML
                const updateTodoFormHTML = `
                    <h3>Update Todo</h3>
                    <div class="form-group">
                        <label for="updateTitle">Title:</label>
                        <input type="text" id="updateTitle" class="form-control" value="${todo.title}">
                    </div>
                    <div class="form-group">
                        <label for="updateNote">Note:</label>
                        <input type="text" id="updateNote" class="form-control" value="${todo.note}">
                    </div>
                    <div class="form-group">
                        <label for="updateDueDate">Due Date:</label>
                        <input type="date" id="updateDueDate" class="form-control" value="${todo.date_due}">
                    </div>
                    <div class="form-group">
                        <label for="updateComplete">Complete:</label>
                        <select id="updateComplete" class="form-control">
                            <option value="Yes" ${todo.complete === 'Yes' ? 'selected' : ''}>Yes</option>
                            <option value="No" ${todo.complete === 'No' ? 'selected' : ''}>No</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="updateCategory">Category:</label>
                        <input type="text" id="updateCategory" class="form-control" value="${todo.category}">
                    </div>
                    <button onclick="submitUpdate(${todo.id})" class="btn btn-primary">Update</button>
                `;

                // Display the update form
                detailsContainer.innerHTML = updateTodoFormHTML;
            })
            .catch(error => console.error('Error fetching todo details:', error));
    }

    // Confirm and delete todo
    function deleteTodoConfirm(id) {
        const confirmDelete = confirm('Are you sure you want to delete this todo?');
        if (confirmDelete) {
            deleteTodo(id);
        }
    }

    // Delete todo
    function deleteTodo(id) {
        fetch(`https://nicodeshub.com/todo_app/api/delete_todo/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }
            fetchTodos();
        })
        .catch(error => console.error('Error deleting todo:', error));
    }

    // Initial fetch of todos
    fetchTodos();
});
