;
(function () {

        "use strict"

        // VARIABLES
        let app;
        let field;

        // The local storage ID
        let storageId = 'route-todos';

        // FUNCTIONS

        /**
         * Create todo items view
         */
        let createTodos = function () {
            app = new Reef('#app', {
                // properties of app 'props'
                data: {
                    lists: [{
                        name: '',
                        todos: []
                    }],
                    current: null
                },
                template: function (props) {

                    // Create a link back to the lists view
                    let link = '<a href="' + window.location.href.replace('?list=' + props.current, '') + '">&larr; Back to lists</a>';

                    // Get the current list
                    let list = props.lists[props.current];

                    // If the list does not exist, show a message and link back to all lists
                    if (!list) {
                        return link + '<h1>This list could not be found, sorry!</h1>';
                    }


                    let form =
                        link +
                        '<h1>' + list.name + '</h1>' +

                        '<form id="add-todos">' +
                            '<label for="new-todo">What do you want to do? </label>' +
                            '<input type="text" id="new-todo" autofocus placeholder="Name your to-do here">' +
                            '<button class="btn waves-effect waves-light btn-small" name="action" type="submit">' + 'Add Todo' + 
                                '<i class="material-icons right">send</i>' + 
                            '</button>' +
                        '</form>';
                    // If todos array is empty, return a generic message to prompt user to add a todo item
                    if (list.todos.length < 1) {
                        return form + '<p>There are no items in the list.  Add a todo item using the form above.</p>';
                    }
                    // Otherwise, return the form and list of todo items
                    return form + '<ul class="todos">' + list.todos.map(function (todo, index) {
                        let todoHTML =
                            '<li class="todo-list-item">' +
                                '<label for="todo-' + index + '" >' +
                                '<input type="checkbox" class="filled-in" id="todo-' + index +
                                '" data-todo="' + index + '" ' + (todo.completed ? 'checked' : '') + '>' + 
                                '<span ' + (todo.completed ? 'class="todo-completed"' : '') + '>' + todo.item + '</span>' +
                                '</label>' + 
                                ' <a class="delete-todo btn waves-effect waves-light btn-small" href="#" data-delete-todo="' + index + '" aria-label="Delete ' + todo.item + '">Delete</a>' +
                            '</li>' 
                        return todoHTML;

                    }).join('') + '</ul>'

                }

            })
        }

        /**
         * Create lists view
         */
        let createLists = function () {
            app = new Reef('#app', {
                // properties of app 'props'
                data: {
                    lists: [{
                        name: '',
                        todos: []
                    }],
                    current: null
                },
                template: function (props) {

                    let form =
                        '<h1>My Lists</h1>' +

                        '<form id="add-list">' +
                            '<label for="new-list">What kind of list would you like to create? </label>' +
                            '<input type="text" id="new-list" autofocus placeholder="Name of the list goes here">' +
                            '<button id="submit" class="btn waves-effect waves-light btn-small" name="action" type="submit">' + 'Add New List' + 
                            '<i class="material-icons right">send</i>' + '</button>' +
                        '</form>';
                    // If todos array is empty, return a generic message to prompt user to add a todo item
                    if (props.lists.length < 1) {
                        return form + '<p>There are no lists found.  Add a new list using the form above.</p>';
                    }
                    // Otherwise, return the form and list of todo items
                    return form + '<ol class="lists">' + props.lists.map(function (list, index) {
                        let todoHTML =
                            '<li class="list-list-item">' +
                            '<a href="?list=' + index + '">' + list.name + ' (' + list.todos.length + ')</a>' +
                            '<button class="waves-effect waves-light btn-small" data-delete-list="' + index + '" aria-label="Delete ' + list.name + '">Delete</button>' +
                            '</li>';
                        return todoHTML;

                    }).join('') + '</ol>'

                }

            })
        }


        /**
         * Get the URL parameters
         * source: https://css-tricks.com/snippets/javascript/get-url-variables/
         * @param  {String} url The URL
         * @return {Object}     The URL parameters
         */
        var getParams = function (url) {
            var params = {};
            var parser = document.createElement('a');
            parser.href = url ? url : window.location.href;
            var query = parser.search.substring(1);
            var vars = query.split('&');
            if (vars.length < 1 || vars[0].length < 1) return params;
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
            return params;
        };

        let setup = function () {
            let list = getParams().list;

            if (list) {
                createTodos();
            } else {
                createLists();
            }

            // Render the initial UI
            loadTodos(list);

            // Define the field variable
            // This will match against EITHER #new-list OR #new-todo, whichever it finds first
            // This prevents me from having to conditionally st my selector
            field = document.querySelector('#new-list, #new-todo');
            
        }

        let focusField = function () {
            field.value = "";
            field.focus();
        }

            /*
            This function will add a new list in the event
            that the submit button is clicked
            */
            let addList = function (e) {
                // If the button clicked is not part of the form,
                // stop running the callback function
                if (!e.target.closest('#add-list')) return;

                // Stop the form from submitting
                e.preventDefault();

                // If the #new-list input element value is emptyp,
                // stop running the function
                if (field.value.length < 1) return;

                // Get an immutable copy of the lists array
                let lists = app.getData().lists;

                // Update the immutable copy of the lists array
                lists.push({
                    name: field.value,
                    todos: []
                });

                app.setData({
                    lists: lists
                });

                // Clear the field and return focus
                focusField();
            }
            /*
            This function will add a new todo item to the list in the event
            that the submit button is clicked
            */
            let addTodo = function (e) {
                // If the button clicked is not part of the form,
                // stop running the callback function
                if (!e.target.closest('#add-todos')) return;

                // Prevent the form from submitting
                e.preventDefault();

                // If the input element value is empty, 
                // stop running the function
                if (field.value.length < 1) return;

                // Get an immutable copy of the 'data' object and 
                // update the array with the new listItem
                let data = app.getData();

                let list = data.lists[data.current];
                if (!list) return;

                // Update the immutable copy
                list.todos.push({
                    item: field.value,
                    completed: false,
                });

                // Render a fresh UI
                app.setData({
                    lists: data.lists
                });

                // Clear the input text field
                focusField();

            }

            let submitHandler = function (e) {
                // Add a new list
                addList(e);
                // Add a new todo item
                addTodo(e);
            }
            let deleteList = function (e) {
                
                // Get the index of the desired list to delete
                // Only run on delete button clicks
                let list = e.target.getAttribute('data-delete-list');
                if (!list) return;

                // Get an immutable copy of the data object
                let data = app.getData();
                // Check if there is a list with the matching index
                if (!data.lists[list]) return;

                // Confirm with the user before deleting
                if (!window.confirm('Are you sure you want to delete the ' + data.lists[list].name + ' list?  This cannot be undone.')) return;

                // Remove the list from the array
                data.lists.splice(list, 1);

                // Render a fresh UI
                app.setData({
                    lists: data.lists
                });
            }
            /*
            This function will delete a todo item in the event that the 
            delete button is clicked
            */
            let deleteTodo = function (e) {
                // Get attribute value (index) of the clicked target. 
                // If target does not have the 'data-todo'attribute, 
                // stop running the callback function
                let todo = e.target.getAttribute('data-delete-todo');
                if (!todo) return;

                // Get an immutable copy of the 'data' object
                let data = app.getData();

                // Get the current list
                let list = data.lists[data.current];
                // Check if there is a matching list, OR matching todo item exists in the todos array
                if (!list || !list.todos[todo]) return;

                // Confirm with the user before deleting
                if (!window.confirm('Are you sure you want to delete this todo item?  This cannot be undone.')) return;

                // Delete the specific item
                list.todos.splice(todo, 1);

                // Render a fresh UI
                app.setData({
                    lists: data.lists
                })

            }

            let clickHandler = function (e) {

                 // Delete the list item
                 deleteList(e);

                // Delete the todo item
                deleteTodo(e);

               


            }
            /*
            This function will load the list of saved todo items
            */
            let loadTodos = function (list) {
                // Get the saved storage data
                let saved = localStorage.getItem(storageId);

                // If there is no saved data, stop running the function
                let data = saved ? JSON.parse(saved) : {
                    lists: []
                };

                data.current = list ? parseInt(list, 10) : null;

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
                let data = app.getData();

                let list = data.lists[data.current];
                if (!list || !list.todos[todo]) return;

                list.todos[todo].completed = e.target.checked;

                app.setData({
                    lists: data.lists
                });
            }

            let handleCheckbox = function (e) {
                // Mark the todo as complete
                completeTodo(e);

            }



            // Load the todos on initial render
            setup();

            // EVENT LISTENERS

            // Listens for the submit event of the form
            document.addEventListener('submit', submitHandler, false);

            // Listens for any input events on the checkboxes
            document.addEventListener('input', handleCheckbox, false);

            // Listens for any click events on the Delete link
            document.addEventListener('click', clickHandler, false);

            // Listens for any render events when when the UI has been updated
            document.addEventListener('render', saveTodos, false);


        })()