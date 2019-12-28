;(function() {

    "use strict";

    // VARIABLES

// The new todo input field
let newTodo = document.querySelector('#new-todo');
// The local storage ID
let storageId = 'save-todos';

// COMPONENT
let app = new Reef('#app', {
    // properties of app 'props'
    data: {
        todos: []
    },
    template: function (props) {
        // If todos array is empty, return a generic message to prompt user to add a todo item
        if (props.todos.length < 1) {
            return '<p>There are no items in the list.  Add a todo item using the form above.</p>'
        } 
        // Otherwise, render the list of todo items
        return '<ul class="todos">' + props.todos.map(function (todo, index) {
                            let todoHTML = 
                            '<li ' + (todo.completed ? 'class="todo-completed"' : '') + '>' + 
                                '<label for="todo-' + index + '">' + 
                                    '<input type="checkbox" id="todo-' + index 
                                    + '" data-todo="' + index + '" ' + (todo.completed ? 'checked' : '') + '>' + todo.item +
                                '</label>' +
                            '</li>' + ' <a href="#" data-delete="' + index + '" aria-label="Delete ' +  todo.item + '">Delete</a>';
                            return todoHTML;

            }).join('') + '</ul>'
        
    }
    
})
// FUNCTIONS

/*
This function will add a new todo item to the list in the event
that the submit button is clicked
*/
let addTodo = function(e) {
    // If the button clicked is not part of the form,
    // stop running the callback function
    if (!e.target.closest('#add-todos')) return;

    // Prevent the form from submitting
    e.preventDefault();

    // If the input element value is empty, 
    // stop running the function
    if (newTodo.value.length < 1) return;

    // Get an immutable copy of the 'data' object and 
    // update the array with the new listItem
    let items = app.getData().todos;

    // Update the immutable copy
    items.push({
        item: newTodo.value, 
        completed: false,
    });

    // Render a fresh UI
    app.setData({todos: items});

    // Clear the input text field
    newTodo.value = "";
    newTodo.focus();

    // Save the todos to localStorage
    // saveTodos();

}
/*
This function will delete a todo item in the event that the 
delete button is clicked
*/
let deleteTodo = function (e) {
    // Get attribute value (index) of the clicked target. 
    // If target does not have the 'data-todo'attribute, 
    // stop running the callback function
    let todo = e.target.getAttribute('data-delete');
    if (!todo) return;

    // Get an immutable copy of the 'data' object
    let items = app.getData().todos;
    // Check if todo item exists
    if (!items[todo]) return;

    // Confirm with the user before deleting
    if (!window.confirm('Are you sure you want to delete this todo item?  This cannot be undone.')) return

    // Delete the specific item
    items.splice(todo, 1);

    // Render a fresh UI
    app.setData({todos: items})
    
}
/*
This function will load the list of saved todo items
*/
let loadTodos = function () {
    // Get the saved storage data
    let saved = localStorage.getItem(storageId);

    // If there is no saved data, stop running the function
    let data = saved ? JSON.parse(saved) : { todos: [] };

    // Set the saved data to the 'data' object and render fresh UI
    app.setData(data);
}
/*
This function will save the list of todo items to localStorage
*/
let saveTodos = function () {
    // Get immutable copy of todos
    let data = app.getData();
    // Save the todos to localStorage
    localStorage.setItem(storageId, JSON.stringify(data))
}
/*
This function will mark any todo item as complete in the
event that the todo's checkbox is checked
*/
let completeTodo = function (e) {
    // Get attribute value (index) of the clicked target. 
    // If target does not have the 'data-todo' attribute, 
    // stop running the callback function
    let todo = e.target.getAttribute('data-todo');
    if (!todo) return;

    // Get an immutable copy of the 'data' object.
    // If the clicked todo item doesn't have an index,
    // stop running the callback function
    let items = app.getData().todos;
    if (!items[todo]) return;

    items[todo].completed = e.target.checked;

    app.setData({todos: items});
}

let handleCheckbox = function(e) {
    // Mark the todo as complete
    completeTodo(e);

}

// Load the todos on initial render
loadTodos();

// EVENT LISTENERS

// Listens for the submit event of the form
document.addEventListener('submit', addTodo, false);

// Listens for any input events on the checkboxes
document.addEventListener('input', handleCheckbox, false);

// Listens for any click events on the Delete link
document.addEventListener('click', deleteTodo, false);

// Listens for any render events when when the UI has been updated
document.addEventListener('render', saveTodos, false);


})();