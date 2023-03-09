const notStartedTasksList = document.getElementById('not-started-tasks-list');
const inProgressTasksList = document.getElementById('in-progress-tasks-list');
const completedTasksList = document.getElementById('in-completed-list');

const allLists = document.querySelectorAll('ul');
const allTasks = document.querySelectorAll('li:has(input)');

const allAddBtns = [...document.querySelectorAll('li button')];

const addTask = (btn) => {
  // create the element and append it
  const newTask = document.createElement('li');
  newTask.innerHTML = `
  <input type="text" class="task-input" />
  <svg class="edit-task-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
  </svg>
  <svg class="delete-task-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
  <svg class="up-down-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
  </svg>
  `;
  btn.closest('li').insertAdjacentElement('beforebegin', newTask);
  newTask.querySelector('input').focus();

  // updating the storage
  updateStorage();

  // adding the required event listeners for each task to all of them
  addEventListenersOnAllCurrentTasks();
};

const hideIcons = () => {
  const icons = document.querySelectorAll('svg');
  for (icon of icons) {
    icon.setAttribute('id', 'invisible');
  }
};

const showIcons = () => {
  const icons = document.querySelectorAll('svg');
  for (icon of icons) {
    icon.removeAttribute('id');
  }
};

const updateStorage = () => {
  window.localStorage.setItem(
    'mainInnerHTML',
    document.querySelector('main').innerHTML
  );
};

function addEventListenersOnAllCurrentTasks() {
  const tasks = [...document.querySelectorAll('li:has(input)')];
  tasks.forEach((task) => {
    const inputField = task.querySelector('input');
    const editBtn = task.querySelector('.edit-task-icon');
    const deleteBtn = task.querySelector('.delete-task-icon');
    const moveBtn = task.querySelector('.up-down-icon');

    // event listeners
    const saveTask = () => {
      inputField.blur();
      inputField.setAttribute('disabled', '');
      inputField.setAttribute('value', inputField.value);
      inputField.style.cursor = 'move';
      task.setAttribute('draggable', 'true');
      task.addEventListener('click', editTaskHandler);
      updateStorage();
    };

    const onFocusOutHandler = () => {
      saveTask();
    };

    const saveTaskHandler = (e) => {
      if (e.code === 'Enter') {
        saveTask();
      }
    };

    const deleteTaskHandler = () => {
      task.remove();
      updateStorage();
    };

    const editTaskHandler = () => {
      task.removeEventListener('click', editTaskHandler);
      inputField.removeAttribute('disabled');
      inputField.focus();
      inputField.style.cursor = 'auto';
      task.removeAttribute('draggable');

      // updating the storage
      updateStorage();
    };

    const taskContexMenuHandler = (e) => {
      e.preventDefault();
    };

    inputField.addEventListener('focusout', onFocusOutHandler);

    inputField.addEventListener('keypress', saveTaskHandler);

    task.addEventListener('click', editTaskHandler);

    // task.addEventListener('contextmenu', taskContexMenuHandler);

    editBtn.addEventListener('click', editTaskHandler);

    deleteBtn.addEventListener('click', deleteTaskHandler);

    // working on ..........

    moveBtn.addEventListener('click', (e) => {
      const currentTask = e.target.closest('li');
      currentTask.removeEventListener('click', editTaskHandler);
      // console.log(task.nextSibling);
      const nextTask = currentTask.nextElementSibling;
      const nextColumn =
        currentTask.parentElement.parentElement.nextElementSibling;
      console.log('hello');
      console.log(nextTask);
      if (nextTask.querySelector('input')) {
        nextTask.insertAdjacentElement('afterend', currentTask);
      } else if (nextColumn) {
        nextColumn
          .querySelector('ul')
          .querySelector('#first-li')
          .insertAdjacentElement('afterend', currentTask);
      }
    });

    // ...............

    // drag and drop

    const dragStart = () => {
      hideIcons();
      task.classList.add('dragged');
    };

    const dragEnd = (e) => {
      const dragged = document.querySelector('.dragged');
      const target = document.querySelector('.target:not(:has(button))');
      const targetHasBtn = document.querySelector('.target:has(button)');

      if (target) {
        target.insertAdjacentElement('afterend', dragged);
        target.classList.remove('target');
        dragged.classList.remove('dragged');
      } else if (targetHasBtn) {
        targetHasBtn.insertAdjacentElement('beforebegin', dragged);
        targetHasBtn.classList.remove('target');
        dragged.classList.remove('dragged');
      } else {
        task.classList.remove('dragged');
      }
      showIcons();

      // updating the storage
      updateStorage();
    };

    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
  });

  allLists.forEach((list) => {
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      const target = e.target.closest('li');
      target.classList.add('target');
    });

    list.addEventListener('dragleave', () => {
      const listItems = [...document.querySelectorAll('li')];
      listItems.forEach((listItem) => {
        listItem.classList.remove('target');
      });
    });
  });
}

addEventListenersOnAllCurrentTasks();
