let books = []
let activeSearchKeyword = ""

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
    },
    activeSearchKeyword,
  )
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

  const searchInput = document.getElementById(SEARCH_BOOK_TITLE_ID)
  activeSearchKeyword = ""
  searchInput.value = ""

  resetBookInputForm()
  refreshBookList()
}

document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById(INPUT_BOOK_FORM_ID)
  const searchForm = document.getElementById(SEARCH_BOOK_FORM_ID)
  const editButton = document.getElementById(EDIT_BUTTON_ID)

  if (editButton) {
    editButton.style.display = "none"
    editButton.type = "button"
  }

  loadBooks()
  refreshBookList()

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault()
    addBook()
  })

  bookForm.addEventListener("reset", onBookFormReset)
  searchForm.addEventListener("submit", searchBooks)
})
