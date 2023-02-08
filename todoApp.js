(function() {

    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    };

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;

        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    };

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    };

    function createTodoItem(task, array) {
        let item = document.createElement('li');
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        if (typeof(task) === 'object') {
            item.textContent = task.name;

            let status = task.done;

            if (status === 'true') {
                item.classList.add('list-group-item-success');
            };
        } else {
            item.textContent = task;
            array.push({ name: task, done: 'false' });
        };

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        return {
            item,
            doneButton,
            deleteButton,
        };
    };

    function appendTodoItem(value, list, array, key) {
        let todoItem = createTodoItem(value, array);

        list.append(todoItem.item);

        todoItem.doneButton.addEventListener('click', function() {
            todoItem.item.classList.toggle('list-group-item-success');

            let indexValue;
            let itemValue = todoItem.item.childNodes[0].data;

            for (let a of array) {
                if (a.name == itemValue) {
                    indexValue = array.indexOf(a);
                };
            };

            let status = array[indexValue].done;

            if (status === 'true') {
                array[indexValue].done = 'false';
            } else {
                array[indexValue].done = 'true';
            };

            localStorage.setItem(key, JSON.stringify(array));
        });

        todoItem.deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                todoItem.item.remove();
            };

            let indexValue = undefined;
            let itemValue = todoItem.item.childNodes[0].data;

            for (let a of array) {
                if (a.name == itemValue) {
                    indexValue = array.indexOf(a);
                };
            };

            array.splice(indexValue, 1);

            localStorage.setItem(key, JSON.stringify(array));
        });
    };

    function createTodoApp(container, title = 'Список дел', array, key) {
        if (JSON.parse(localStorage.getItem(key)) != null) {
            array = JSON.parse(localStorage.getItem(key));
        };

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        if (array) {
            for (let a of array) {
                appendTodoItem(a, todoList, array, key);
            };
        };

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();

            if (!todoItemForm.input.value) {
                return;
            };

            appendTodoItem(todoItemForm.input.value, todoList, array, key);

            todoItemForm.input.value = '';
            todoItemForm.button.disabled = true;

            localStorage.setItem(key, JSON.stringify(array));
        });

        todoItemForm.input.addEventListener('input', function() {
            if (todoItemForm.input.value) {
                todoItemForm.button.disabled = false;
            } else {
                todoItemForm.button.disabled = true;
            };
        });
    };

    window.createTodoApp = createTodoApp;
})();