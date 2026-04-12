let books = []
let activeSearchKeyword = ""
let editingBookId = null
let submitButtonElement = null
let editButtonElement = null

function isStorageSupported() {
  return typeof Storage !== "undefined"
}

function generateBookId() {
  return Number(new Date())
}

function createBookObject(values) {
  return {
    id: generateBookId(),
    title: values.title,
    author: values.author,
    year: values.year,
    isComplete: values.isComplete,
  }
}

function normalizeBook(rawBook) {
  const parsedYear = Number(rawBook.year)

  return {
    id: rawBook.id,
    title: String(rawBook.title || ""),
    author: String(rawBook.author || ""),
    year: Number.isNaN(parsedYear) ? 0 : parsedYear,
    isComplete:
      typeof rawBook.isComplete === "boolean"
        ? rawBook.isComplete
        : Boolean(rawBook.isFinished),
  }
}

function saveBooks() {
  if (!isStorageSupported()) {
    return
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
}

function loadBooks() {
  if (!isStorageSupported()) {
    books = []
    return
  }

  const serializedBooks = localStorage.getItem(STORAGE_KEY)

  if (!serializedBooks) {
    books = []
    return
  }

  try {
    const parsedBooks = JSON.parse(serializedBooks)

    if (!Array.isArray(parsedBooks)) {
      books = []
      return
    }

    books = parsedBooks.map(normalizeBook)
  } catch (error) {
    books = []
  }
}

function refreshBookList() {
  renderBooks(
    books,
    {
      onToggle: toggleBookCompleteStatus,
      onDelete: removeBook,
      onEdit: startEditBook,
    },
    activeSearchKeyword,
  )
}

function setBookFormMode(mode) {
  if (!submitButtonElement || !editButtonElement) {
    return
  }

  if (mode === "edit") {
    submitButtonElement.style.display = "none"
    editButtonElement.style.display = ""
    return
  }

  submitButtonElement.style.display = ""
  editButtonElement.style.display = "none"
}

function fillBookInputForm(book) {
  const titleField = document.getElementById(INPUT_TITLE_ID)
  const authorField = document.getElementById(INPUT_AUTHOR_ID)
  const yearField = document.getElementById(INPUT_YEAR_ID)
  const isCompleteField = document.getElementById(INPUT_IS_COMPLETE_ID)

  titleField.value = book.title
  authorField.value = book.author
  yearField.value = String(book.year)
  isCompleteField.checked = book.isComplete
}

function addBook() {
  const inputValues = getBookInputValues()

  if (
    !inputValues.title ||
    !inputValues.author ||
    Number.isNaN(inputValues.year)
  ) {
    return
  }

  const newBook = createBookObject(inputValues)
  books.push(newBook)

  saveBooks()
  resetBookInputForm()
  refreshBookList()
}

function findBookIndexById(bookId) {
  return books.findIndex(function (book) {
    return String(book.id) === String(bookId)
  })
}

function findBookById(bookId) {
  return books.find(function (book) {
    return String(book.id) === String(bookId)
  })
}

function startEditBook(bookId) {
  const book = findBookById(bookId)

  if (!book) {
    return
  }

  editingBookId = book.id
  fillBookInputForm(book)
  setBookFormMode("edit")
}

function finishEditMode() {
  editingBookId = null
  setBookFormMode("add")
}

function updateBook() {
  if (editingBookId === null) {
    return
  }

  const inputValues = getBookInputValues()

  if (
    !inputValues.title ||
    !inputValues.author ||
    Number.isNaN(inputValues.year)
  ) {
    return
  }

  const bookIndex = findBookIndexById(editingBookId)

  if (bookIndex === -1) {
    finishEditMode()
    resetBookInputForm()
    return
  }

  books[bookIndex] = {
    ...books[bookIndex],
    title: inputValues.title,
    author: inputValues.author,
    year: inputValues.year,
    isComplete: inputValues.isComplete,
  }

  saveBooks()
  finishEditMode()
  resetBookInputForm()
  refreshBookList()
}

function toggleBookCompleteStatus(bookId) {
  const bookIndex = findBookIndexById(bookId)

  if (bookIndex === -1) {
    return
  }

  books[bookIndex].isComplete = !books[bookIndex].isComplete

  saveBooks()
  refreshBookList()
}

function removeBook(bookId) {
  const bookIndex = findBookIndexById(bookId)

  if (bookIndex === -1) {
    return
  }

  books.splice(bookIndex, 1)

  if (String(editingBookId) === String(bookId)) {
    finishEditMode()
    resetBookInputForm()
  }

  saveBooks()
  refreshBookList()
}

function searchBooks(event) {
  event.preventDefault()

  const searchInput = document.getElementById(SEARCH_BOOK_TITLE_ID)
  activeSearchKeyword = searchInput.value.trim()

  refreshBookList()
}

function onBookFormReset(event) {
  event.preventDefault()
  finishEditMode()
  resetBookInputForm()
}

document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById(INPUT_BOOK_FORM_ID)
  const searchForm = document.getElementById(SEARCH_BOOK_FORM_ID)
  submitButtonElement = document.getElementById(SUBMIT_BUTTON_ID)
  editButtonElement = document.getElementById(EDIT_BUTTON_ID)

  if (editButtonElement) {
    editButtonElement.style.display = "none"
    editButtonElement.type = "button"
    editButtonElement.addEventListener("click", function (event) {
      event.preventDefault()
      updateBook()
    })
  }

  loadBooks()
  refreshBookList()
  setBookFormMode("add")

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault()
    addBook()
  })

  bookForm.addEventListener("reset", onBookFormReset)
  searchForm.addEventListener("submit", searchBooks)
})
