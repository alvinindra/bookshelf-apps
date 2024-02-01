document.addEventListener("DOMContentLoaded", function () {
  const formInput = document.getElementById("inputBook");
  const btnEdit = document.getElementById(EDIT_BUTTON_ID);
  btnEdit.style.display = 'none';

  formInput.addEventListener("submit", event => {
    event.preventDefault();
    addBook();
  });

  formInput.addEventListener("reset", event => {
    event.preventDefault();
    clearForm();
  });

  window.addEventListener("load", function () {
    (e = JSON.parse(localStorage.getItem("books")) || []), c(e);
    const inputBook = document.querySelector("#inputBook"),
    search = document.querySelector("#searchBook");
    search.addEventListener("submit", searchBook),
    document.addEventListener("bookChanged", saveBook);
  });
});
