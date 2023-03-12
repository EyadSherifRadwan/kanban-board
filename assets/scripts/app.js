window.addEventListener('load', () => {
  // saving all existing tasks
  [...allTasks].forEach((task) => {
    const inputField = task.querySelector('input');
    inputField.blur();
    inputField.setAttribute('disabled', '');
    inputField.setAttribute('value', inputField.value);
    task.setAttribute('draggable', 'true');
    updateStorage();
  });

  // adding eventlisteners on the addBtns
  allAddBtns.forEach((btn) => {
    btn.addEventListener('click', addTask.bind(null, btn));
  });

  // adding the color picker
  const pickr = Pickr.create({
    el: '.color-picker',
    theme: 'nano', // or 'monolith', or 'nano'

    default: `${window.localStorage.getItem('currentColor')}`,

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

  // adding event listeners on the color picker

  // every time you change the color in the color picker this code will fire up
  pickr.on('change', (...args) => {
    const currentColor = args[0].toHSLA();
    const currentColorHEX = args[0].toHEXA();

    // updating all the current color values in the storage in hsla() form
    window.localStorage.setItem('currentColor', currentColorHEX);
    window.localStorage.setItem('h', Math.round(currentColor[0]));
    window.localStorage.setItem('s', `${Math.round(currentColor[1])}%`);
    window.localStorage.setItem('l', `${Math.round(currentColor[2])}%`);
    window.localStorage.setItem('a', currentColor[3]);

    if (currentColor[2] > 70) {
      window.localStorage.setItem('textColor', 'black');
    } else {
      window.localStorage.setItem('textColor', '#fff');
    }

    // updating the current color in the dom so it gets relfected in the css
    document
      .querySelector(':root')
      .style.setProperty('--h', Math.round(currentColor[0]));
    document
      .querySelector(':root')
      .style.setProperty('--s', `${Math.round(currentColor[1])}%`);
    document
      .querySelector(':root')
      .style.setProperty('--l', `${Math.round(currentColor[2])}%`);
    document.querySelector(':root').style.setProperty('--a', currentColor[3]);
    document
      .querySelector(':root')
      .style.setProperty(
        '--textColor',
        window.localStorage.getItem('textColor')
      );
  });

  // every time you click the reset button this code will fire up
  pickr.on('clear', () => {
    // removing all the currentcColor values from the storage
    window.localStorage.removeItem('currentColor');
    window.localStorage.removeItem('h');
    window.localStorage.removeItem('s');
    window.localStorage.removeItem('l');
    window.localStorage.removeItem('a');

    // removing all the currentColor values from the dom
    document.querySelector(':root').style.removeProperty('--h');
    document.querySelector(':root').style.removeProperty('--s');
    document.querySelector(':root').style.removeProperty('--l');
    document.querySelector(':root').style.removeProperty('--a');
    document.querySelector(':root').style.removeProperty('--textColor');
  });
});
