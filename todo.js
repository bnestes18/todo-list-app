;(function() {

    "use strict";

    // VARIABLES

// The new todo input field
let newTodo = document.querySelector('#new-todo');
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
                            '</li>' + ' <a href="#" data-delete="' + index + '">Delete</a>';
                            return todoHTML;

            }).join('') + '</ul>'
        
    }
    
})
// FUNCTIONS

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
    saveTodos();

}

let deleteTodo = function (e) {
    // Get attribute value (index) of the clicked target. 
    // If target does not have the 'data-todo'attribute, 
    // stop running the callback function
    let todo = e.target.getAttribute('data-delete');
    if (!todo) return;

    // Get an immutable copy of the 'data' object
    let items = app.getData().todos;

    // Delete the specific item
    items.splice(items[todo], 1);

    // Render a fresh UI
    app.setData({todos: items})

    // Save the todos to localStorage
    saveTodos();
    
}

let loadTodos = function () {
    // Get the saved storage data
    let saved = localStorage.getItem(storageId);

    // If there is no saved data, stop running the function
    if (!saved) return;
    // Otherwise, convert the data into an array
    saved = JSON.parse(saved);

    // Set the saved data to the 'data' object and render fresh UI
    app.setData({todos: saved});
}

let saveTodos = function () {

    if (app.innerHTML === app.render()) return;

    // Get immutable copy of todos
    let items = app.getData().todos;
    // Save the todos to localStorage
    localStorage.setItem(storageId, JSON.stringify(items))
}

let handleCheckbox = function(e) {
    
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

    saveTodos();

    


}

document.addEventListener('submit', addTodo, false)
document.addEventListener('input', handleCheckbox, false)
document.addEventListener('click', deleteTodo, false)

app.render();

loadTodos();

})();