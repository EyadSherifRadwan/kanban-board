// getting tasks from lcoal storage and rendering it in the dom
if (localStorage.tasks) {
  updateDomFromStorage();
}

// adding eventlisteners on the addBtns
allAddBtns.forEach((btn) => {
  btn.addEventListener("click", () => addTask(btn));
});

//
langSwitch.addEventListener("change", () => {
  if (langSwitch.checked) {
    // Switch to Arabic
    html.setAttribute("lang", "ar");
    html.setAttribute("dir", "rtl");

    // Save the lang in the storage
    localStorage.setItem("lang", "ar");
  } else {
    // Switch to English
    html.setAttribute("lang", "en");
    html.setAttribute("dir", "ltr");

    // Save the lang in the storage
    localStorage.setItem("lang", "en");
  }
});
