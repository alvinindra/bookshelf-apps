function addBook() {
  const title = document.querySelector("#inputBookTitle"),
    author = document.querySelector("#inputBookAuthor"),
    year = document.querySelector("#inputBookYear"),
    complete = document.querySelector("#inputBookIsComplete"),
    book = {
      id: +new Date(),
      title: title.value,
      author: author.value,
      year: year.value,
      isComplete: complete.checked,
    };
  listBooks.push(book),
  document.dispatchEvent(new Event("bookChanged"));
}

const addBookList = () => {
  const completedBooksContainer = document.getElementById(COMPLETED_BOOKS_ID);
  const uncompleteBooksContainer = document.getElementById(UNCOMPLETE_BOOKS_ID);

  const title = document.getElementById(TITLE_FIELD_ID).value;
  const author = document.getElementById(AUTHOR_FIELD_ID).value;
  const year = document.getElementById(YEAR_FIELD_ID).value;
  const isFinished = document.getElementById(IS_FINISEHD_ID).checked;

  const composedData = composeData(title, author, year, isFinished);
  const book = makeBookList(composedData);

  if(isFinished) {
      completedBooksContainer.append(book);
  } else {
      uncompleteBooksContainer.append(book);
  }

  books.push(composedData);

  updateDataToStorage();
  clearForm();
}

const makeBookList = ({id, title, author, year, isFinished}) => {
  const bookContainer = document.createElement('div');
  bookContainer.classList.add('book');
  bookContainer.setAttribute('id', id);

  const imageBook = document.createElement('img');

  const yearBook = document.createElement('div');
  yearBook.classList.add('year');
  yearBook.innerText = year;

  const titleBook = document.createElement('h1');
  titleBook.innerText = title;

  const authorBook = document.createElement('p');
  authorBook.innerText = `Author : ${author}`;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons');

  BTN_ATTRIBUTES.forEach(btn => {
      const button = document.createElement('button');
      button.classList.add('btn');
      button.classList.add(btn.class);
      button.setAttribute('title', btn.title);
      
      if(btn.type === 'markCompleted' || btn.type === 'markUncomplete') {
          button.innerHTML = btn.icon;
          if (isFinished) {
              bookContainer.classList.add('completed');
              if (btn.type === 'markUncomplete') {
                  button.setAttribute('id', 'uncompleteButton');
                  button.style.display = 'none';
              } else {
                  button.setAttribute('id', 'completedButton');
              }
          }
          else {
              bookContainer.classList.add('uncomplete');
              button.setAttribute('id', 'completedButton');
              if (btn.type === 'markCompleted') {
                  button.style.display = 'none';
              } else {
                  button.setAttribute('id', 'uncompleteButton');
              }
          }
      } else {
          button.innerHTML = btn.icon;
      }

      button.addEventListener("click", function (event) {
          buttonActions(btn.type, id, button);
      });

      buttonsContainer.append(button);
  })

  bookContainer.append(imageBook, titleBook, authorBook, yearBook, buttonsContainer);
  return bookContainer;
}

const buttonActions = (type, id, button) => {
  switch (type) {
      case 'markCompleted': 
          changeMarking(id, button, 'completed');
          break;
      case 'markUncomplete': 
          changeMarking(id, button, 'uncomplete');
          break;
      case 'edit': 
      editData(id);
          break;
      case 'delete': 
          const confirm = window.confirm("Are you sure want to delete this data?");
          if (confirm) removeBookList(id);
          break;
  }
}

const removeBookList = id => {
  const bookPosition = findBookIndex(id);
  books.splice(bookPosition, 1);

  const parentElement = document.getElementById(id);
  parentElement.remove();

  updateDataToStorage();
}

const changeMarking = (id, button, status) => {
  const bookData = findBook(id);

  const completedBooksContainer = document.getElementById(COMPLETED_BOOKS_ID);
  const uncompleteBooksContainer = document.getElementById(UNCOMPLETE_BOOKS_ID);

  const parentElement = document.getElementById(id);
  const parentElementClasses = parentElement.className.split(" ");

  if(status === 'completed') {
      const child = parentElement.querySelector(`.buttons #uncompleteButton`)
      child.style.display = '';
      bookData.isFinished = false;
  }
  else {
      const child = parentElement.querySelector(`.buttons #completedButton`)
      child.style.display = '';
      bookData.isFinished = true;
  }

  button.style.display = 'none';

  parentElementClasses.forEach(parentClass => {
      if(parentClass === 'completed') {
          uncompleteBooksContainer.append(parentElement);
          parentElement.classList.remove('completed');
          parentElement.classList.add('uncomplete');
      }
      else if(parentClass === 'uncomplete') {
          completedBooksContainer.append(parentElement);
          parentElement.classList.remove('uncomplete');
          parentElement.classList.add('completed');
      }
  });

  updateDataToStorage();
}

const editData = (id) => {
  const editButton = document.getElementById(EDIT_BUTTON_ID);
  const submitButton = document.getElementById(SUBMIT_BUTTON_ID);
  const hiddenInput = document.getElementById(HIDDEN_INPUT);
  hiddenInput.setAttribute('value', id)
  editButton.style.display = '';
  submitButton.style.display = 'none';

  const parentElement = document.getElementById(id);
  const title = parentElement.querySelector('h1').innerHTML;
  const author = parentElement.querySelector('p').innerHTML;
  const authorName = author.substr(9)
  const year = parentElement.querySelector('.year').innerHTML;
  let checked = true;

  const parentElementClasses = parentElement.className.split(" ");
  parentElementClasses.forEach(parentClass => {
      if(parentClass === 'uncomplete') {
          checked = false;
      }
  })
  
  document.getElementById(TITLE_FIELD_ID).value = title;
  document.getElementById(AUTHOR_FIELD_ID).value = authorName;
  document.getElementById(YEAR_FIELD_ID).value = year;
  document.getElementById(IS_FINISEHD_ID).checked = checked;
}

const clearForm = () => {
  const btnEdit = document.getElementById('edit');
  const btnSubmit = document.getElementById('submit');
  btnEdit.style.display = 'none';
  btnSubmit.style.display = '';
  
  document.getElementById('inputBookTitle').value = '';
  document.getElementById('inputBookAuthor').value = '';
  document.getElementById('inputBookYear').value = '';
  document.getElementById('inputBookIsComplete').checked = false;
}

const updateData = () => {
  const id = document.getElementById(HIDDEN_INPUT).value;
  const title = document.getElementById(TITLE_FIELD_ID).value;
  const author = document.getElementById(AUTHOR_FIELD_ID).value;
  const year = document.getElementById(YEAR_FIELD_ID).value;
  const isFinished = document.getElementById(IS_FINISEHD_ID).checked;
  const bookData = findBook(parseInt(id));
  
  bookData.title = title;
  bookData.author = author;
  bookData.year = year;
  bookData.isFinished = isFinished;

  updateDataToStorage();
  window.alert("Please refresh the page to see the updated data.")
}

const searchData = () => {
  const completedBooksContainer = document.getElementById(COMPLETED_BOOKS_ID);
  const uncompleteBooksContainer = document.getElementById(UNCOMPLETE_BOOKS_ID);
  const keyword = document.getElementById(SEARCH_FIELD_ID).value;

  completedBooksContainer.innerHTML = '';
  uncompleteBooksContainer.innerHTML = '';

  const filteredData = books.filter((book) => book.title.toLowerCase().includes(keyword.toLowerCase()));
  filteredData.forEach(data => {
      let composedData = {
          id: data.id,
          title: data.title,
          author: data.author,
          year: data.year,
          isFinished: data.isFinished
      }
      const bookContainer = makeBookList(composedData);

      if(data.isFinished) {
          completedBooksContainer.append(bookContainer);
      } else {
          uncompleteBooksContainer.append(bookContainer);
      }
  });

  document.getElementById(SEARCH_FIELD_ID).value = '';
}

const refreshDataFromBooks = () => {
  const completedBooksContainer = document.getElementById(COMPLETED_BOOKS_ID);
  const uncompleteBooksContainer = document.getElementById(UNCOMPLETE_BOOKS_ID);

  for(book of books){
      let composedData = {
          id: book.id,
          title: book.title,
          author: book.author,
          year: book.year,
          isFinished: book.isFinished
      }
      const bookContainer = makeBookList(composedData);

      if(book.isFinished) {
          completedBooksContainer.append(bookContainer);
      } else {
          uncompleteBooksContainer.append(bookContainer);
      }
  }
}