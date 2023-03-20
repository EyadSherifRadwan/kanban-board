let currentColor = localStorage.getItem('colors');
if (currentColor) {
  currentColor = JSON.parse(currentColor)['currentColor'];
} else {
  currentColor = '#009476';
}

const allLists = [...document.querySelectorAll('ul')];
const allTasks = [...document.querySelectorAll('li:has(input)')];
const allAddBtns = [...document.querySelectorAll('li button')];

let logTasks = [[], [], []];

function updateStorage() {
  logTasks = [[], [], []];

  allLists.forEach((list, listIndex) => {
    list.querySelectorAll('li:has(input)').forEach((task) => {
      logTasks[listIndex].push({
        textContent: task.querySelector('input').value,
      });
    });
  });

  localStorage.setItem('tasks', JSON.stringify(logTasks));
}

const addTask = (btn) => {
  // create the element and append it
  const newTask = document.createElement('li');
  newTask.innerHTML = `
  <input type="text" class="task-input" />
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

  // adding the event listeners for the task
  addEventListeners(newTask);
};

const hideIcons = () => {
  const icons = document.querySelectorAll('svg');
  icons.forEach((icon) => {
    icon.setAttribute('id', 'invisible');
  });
};

const showIcons = () => {
  const icons = document.querySelectorAll('svg');
  icons.forEach((icon) => {
    icon.removeAttribute('id');
  });
};

function addEventListeners(task) {
  const inputField = task.querySelector('input');
  const deleteBtn = task.querySelector('.delete-task-icon');
  const upDownBtn = task.querySelector('.up-down-icon');

  // handlres
  const saveTask = () => {
    updateStorage();

    inputField.blur();
    inputField.setAttribute('readonly', '');
    inputField.style.cursor = 'move';
    task.setAttribute('draggable', 'true');
    inputField.addEventListener('click', editTaskHandler);
  };

  const onFocusOutHandler = () => {
    saveTask();
  };

  const saveTaskHandler = (e) => {
    if (e.code === 'Enter') {
      saveTask();
    }
  };

  function deleteTaskHandler() {
    // remove the task from the dom
    task.remove();

    // remove the task from the log
    updateStorage();
  }

  const editTaskHandler = () => {
    task.removeEventListener('click', editTaskHandler);
    inputField.removeAttribute('readonly');
    inputField.focus();
    inputField.style.cursor = 'auto';
    task.removeAttribute('draggable');
  };

  const dragStartHandler = () => {
    hideIcons();
    task.classList.add('dragged');
  };

  const dragEndHandler = (e) => {
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
      inputField.blur();
    }
    showIcons();

    // updating the storage to save the changes
    updateStorage();
  };

  const mobileDragStartHandler = () => {
    hideIcons();
    task.classList.add('dragged');
    document.addEventListener('touchstart', touchStartHandler);
    document.addEventListener('touchend', touchEndHandler);
    allLists.forEach((list) => {
      list.querySelectorAll('li input').forEach((input) => {
        input.setAttribute('disabled', '');
        list.querySelector('li button').setAttribute('disabled', '');
      });
    });
    allLists.forEach((list) => {
      list
        .querySelectorAll('li:has(input):not(.dragged)')
        .forEach((task) => {});
    });
  };

  const touchStartHandler = (e) => {
    const targetTask = e.target.closest('li');
    if (targetTask) {
      targetTask.classList.add('target');
    }
  };

  const touchEndHandler = (e) => {
    const targetTask = e.target.closest('li:has(input)');
    const targetButton = e.target.closest('li:has(button)');

    // const targetTask = document.querySelector('.target');
    const dragged = document.querySelector('.dragged');
    if (dragged && targetTask) {
      targetTask.insertAdjacentElement('afterend', dragged);
      targetTask.classList.remove('target');
      dragged.classList.remove('dragged');
    } else if (dragged && targetButton) {
      targetButton.insertAdjacentElement('beforebegin', dragged);
      targetButton.classList.remove('target');
      dragged.classList.remove('dragged');
    } else if (dragged) {
      dragged.classList.remove('dragged');
    }

    showIcons();

    document.removeEventListener('touchstart', touchStartHandler);
    document.removeEventListener('touchend', touchEndHandler);

    allLists.forEach((list) => {
      list.querySelectorAll('li input').forEach((input) => {
        input.removeAttribute('disabled');
      });
    });
  };

  // event listeners

  // when focusing out of the task, when pressing enter --> the task will be saved
  inputField.addEventListener('focusout', onFocusOutHandler);
  inputField.addEventListener('keypress', saveTaskHandler);

  inputField.addEventListener('click', editTaskHandler);
  deleteBtn.addEventListener('click', deleteTaskHandler);

  // drag and drop for mobile

  upDownBtn.addEventListener('click', mobileDragStartHandler);

  // drag and drop
  task.addEventListener('dragstart', dragStartHandler);
  task.addEventListener('dragend', dragEndHandler);
}

allLists.forEach((list) => {
  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const target = e.target.closest('li');
    if (target) {
      target.classList.add('target');
    }
  });

  list.addEventListener('dragleave', () => {
    const listItems = [...document.querySelectorAll('li')];
    listItems.forEach((listItem) => {
      listItem.classList.remove('target');
    });
  });
});

// adding the color picker
const pickr = Pickr.create({
  el: '.color-picker',
  theme: 'nano', // or 'monolith', or 'nano'

  default: currentColor,

  swatches: [
    'rgba(244, 67, 54, 1)',
    'rgba(233, 30, 99, 0.95)',
    'rgba(156, 39, 176, 0.9)',
    'rgba(103, 58, 183, 0.85)',
    'rgba(63, 81, 181, 0.8)',
    'rgba(33, 150, 243, 0.75)',
    'rgba(3, 169, 244, 0.7)',
    'rgba(0, 188, 212, 0.7)',
    'rgba(0, 150, 136, 0.75)',
    'rgba(76, 175, 80, 0.8)',
    'rgba(139, 195, 74, 0.85)',
    'rgba(205, 220, 57, 0.9)',
    'rgba(255, 235, 59, 0.95)',
    'rgba(255, 193, 7, 1)',
  ],

  components: {
    // Main components
    preview: true,
    opacity: true,
    hue: true,

    // Input / output Options
    interaction: {
      hex: false,
      rgba: false,
      hsla: false,
      hsva: false,
      cmyk: false,
      input: true,
      clear: true,
      save: false,
    },
  },

  i18n: {
    'btn:clear': 'Reset',
  },
});
