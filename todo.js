;(function() {
    // VARIABLES

let newTodo = document.querySelector('#new-todo')

// COMPONENT
let app = new Reef('#app', {
    // properties of app 'props'
    data: {
        listItems: []
    },
    template: function (props) {
    
        let html = (props.listItems.length < 1) ? '<p>There are no items in the list</p>' :
        '<ul>' + props.listItems.map(function (item) {
                        return  '<li>' + item.todo + '<input type="checkbox" value="completed" name="completed">' + '</li>'
        }).join('') + '</ul>'

        return html;
    }
    
})
// FUNCTIONS

let addTodo = function(e) {
    // if the button clicked is not part of the form
    if (!e.target.closest('#add-todos')) return;
    // If the input element or input element value 
    //does not exist, stop running the function
    if (!newTodo || !newTodo.value) return;

    // Prevent the form from submitting
    e.preventDefault();
    // Get an immutable copy of the 'data' object and 
    // update the array with the new listItem
    let items = app.getData();
    items.listItems.push({todo: newTodo.value, completed: false});
    app.setData({listItems: items.listItems});
    // Clear the input text field
    newTodo.value = "";

}
/*
This function will update the complete property for each todo to true
*/
let updateComplete = function () {
    
    app.data.listItems.map(function (listItem) {
        // console.log('listItemBefore', listItem);
        listItem.completed = true;
        // console.log('listItemAfter', listItem);
    // app.setData({listItems: items.listItems})
    // console.log('app', app.data.listItems)
    })
}
/*
This function will update the complete property for each todo to false
*/
let updateNotComplete = function () {
    app.data.listItems.map(function (listItem) {
        // console.log('listItemBefore', listItem);
        listItem.completed = false;
        // console.log('listItemAfter', listItem);
    // app.setData({listItems: items.listItems})
    // console.log('app', app.data.listItems)
    })
}


let handleCheckbox = function(e) {
    
    // Select the checkboxes in the unordered list
    let checkBoxes = Array.prototype.slice.call(document.querySelectorAll('li > input'));

    if (!checkBoxes) return;

    checkBoxes.map(function (checkBox) {
        // If checkbox is checked, add a 'strikethrough' effect to the text
        // and update the complete property of the todo item to true
        if (checkBox.checked) {
            checkBox.parentNode.classList.add("complete");
            updateComplete();
        } else {
            // Otherwise, remove the 'strikethrough' effect and
            // update the complete property of the todo item to true
            checkBox.parentNode.classList.remove("complete");
            updateNotComplete();
        }
    })

}

document.addEventListener('submit', addTodo, false)
document.addEventListener('input', handleCheckbox, false)

app.render();



})();