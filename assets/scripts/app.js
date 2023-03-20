// adding eventlisteners on the addBtns
allAddBtns.forEach((btn) => {
  btn.addEventListener('click', addTask.bind(null, btn));
});

// getting tasks from lcoal storage and rendering it in the dom
if (localStorage.tasks) {
  logTasks = JSON.parse(localStorage.tasks);
  logTasks.forEach((logList, index) => {
    currentList = allLists[index];
    logList.forEach((task) => {
      const textContent = task.textContent;

      domTask = document.createElement('li');
      domTask.innerHTML = `
        <input type="text" class="task-input" style="cursor:move" readonly />
        <svg class="delete-task-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
        <svg class="up-down-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
        </svg>
        `;
      domTask.querySelector('input').value = textContent;
      domTask.setAttribute('draggable', 'true');

      currentList.lastElementChild.insertAdjacentElement(
        'beforebegin',
        domTask
      );

      addEventListeners(domTask);
    });
  });
}

// adding event listeners on the color picker
const onColorChangeHandler = (...args) => {
  const currentColor = args[0].toHSLA();
  const currentColorHEX = args[0].toHEXA().toString();
  let textColor;

  if (currentColor[2] > 70) {
    textColor = 'black';
  } else {
    textColor = 'white';
  }

  const colorsObj = {
    currentColor: currentColorHEX,
    textColor: textColor,
    h: Math.round(currentColor[0]),
    s: `${Math.round(currentColor[1])}%`,
    l: `${Math.round(currentColor[2])}%`,
    a: currentColor[3],
  };

  // updating the current color in the dom so it gets relfected in the css
  for (const key in colorsObj) {
    root.style.setProperty(`--${key}`, colorsObj[key]);
  }

  // updating all the current color values in the storage in hsla() form
  window.localStorage.setItem('colors', JSON.stringify(colorsObj));
};

const onColorsResetHandler = () => {
  // removing all the currentColor values from the dom
  for (const key in colorsObj) {
    root.style.removeProperty(`--${key}`);
  }

  // removing all the currentcColor values from the storage
  window.localStorage.removeItem('colors');
};

// every time you change the color in the color picker this code will fire up
pickr.on('change', onColorChangeHandler);

// every time you click the reset button this code will fire up
pickr.on('clear', onColorsResetHandler);

//
const langSwitch = document.querySelector('#langSwitch');

langSwitch.addEventListener('change', () => {
  if (langSwitch.checked) {
    // Switch to Arabic
    html.setAttribute('lang', 'ar');
    html.setAttribute('dir', 'rtl');

    // Save the lang in the storage
    localStorage.setItem('lang', 'ar');
  } else {
    // Switch to English
    html.setAttribute('lang', 'en');
    html.setAttribute('dir', 'ltr');

    // Save the lang in the storage
    localStorage.setItem('lang', 'en');
  }
});
