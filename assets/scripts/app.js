window.addEventListener('load', () => {
  [...allTasks].forEach((task) => {
    const inputField = task.querySelector('input');
    inputField.blur();
    inputField.setAttribute('disabled', '');
    inputField.setAttribute('value', inputField.value);
    inputField.style.cursor = 'move';
    task.setAttribute('draggable', 'true');
    updateStorage();
  });

  const currentColor = window.localStorage.getItem('currentColor');
  if (currentColor) {
    const shadeTwo = window.localStorage.getItem('shadeTwo');
    const shadeThree = window.localStorage.getItem('shadeThree');
    const textColor = window.localStorage.getItem('textColor');

    document
      .querySelector(':root')
      .style.setProperty('--mainColor', currentColor);
    document.querySelector(':root').style.setProperty('--shadeTwo', shadeTwo);
    document
      .querySelector(':root')
      .style.setProperty('--shadeThree', shadeThree);
    document.querySelector(':root').style.setProperty('--textColor', textColor);
  }
});

// ///////////

// ///////////

allAddBtns.forEach((btn) => {
  btn.addEventListener('click', addTask.bind(null, btn));
});
