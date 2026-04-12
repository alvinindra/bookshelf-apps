function getBookInputValues() {
  const titleField = document.getElementById(INPUT_TITLE_ID)
  const authorField = document.getElementById(INPUT_AUTHOR_ID)
  const yearField = document.getElementById(INPUT_YEAR_ID)
  const isCompleteField = document.getElementById(INPUT_IS_COMPLETE_ID)

  return {
    title: titleField.value.trim(),
    author: authorField.value.trim(),
    year: Number(yearField.value),
    isComplete: isCompleteField.checked,
  }
}

function resetBookInputForm() {
  const titleField = document.getElementById(INPUT_TITLE_ID)
  const authorField = document.getElementById(INPUT_AUTHOR_ID)
  const yearField = document.getElementById(INPUT_YEAR_ID)
  const isCompleteField = document.getElementById(INPUT_IS_COMPLETE_ID)

  titleField.value = ""
  authorField.value = ""
  yearField.value = ""
  isCompleteField.checked = false
}

function createBookItemElement(book, handlers) {
  const bookContainer = document.createElement("div")
  bookContainer.classList.add("card--book")
  bookContainer.setAttribute("data-bookid", String(book.id))
  bookContainer.setAttribute("data-testid", BOOK_ITEM_TEST_IDS.ITEM)

  const titleEl = document.createElement("h3")
  titleEl.setAttribute("data-testid", BOOK_ITEM_TEST_IDS.TITLE)
  titleEl.textContent = book.title

  const authorEl = document.createElement("p")
  authorEl.setAttribute("data-testid", BOOK_ITEM_TEST_IDS.AUTHOR)
  authorEl.textContent = `Penulis: ${book.author}`

  const yearEl = document.createElement("p")
  yearEl.setAttribute("data-testid", BOOK_ITEM_TEST_IDS.YEAR)
  yearEl.textContent = `Tahun: ${book.year}`

  const actionContainer = document.createElement("div")
  actionContainer.classList.add("button-group")

  const toggleButton = document.createElement("button")
  toggleButton.type = "button"
  toggleButton.setAttribute("data-testid", BOOK_ITEM_TEST_IDS.TOGGLE_BUTTON)
  toggleButton.textContent = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca"
  toggleButton.addEventListener("click", function () {
    handlers.onToggle(book.id)
  })

  const deleteButton = document.createElement("button")
  deleteButton.type = "button"
  deleteButton.classList.add("red")
  deleteButton.setAttribute("data-testid", BOOK_ITEM_TEST_IDS.DELETE_BUTTON)
  deleteButton.textContent = "Hapus buku"
  deleteButton.addEventListener("click", function () {
    handlers.onDelete(book.id)
  })

  const editButton = document.createElement("button")
  editButton.type = "button"
  editButton.setAttribute("data-testid", BOOK_ITEM_TEST_IDS.EDIT_BUTTON)
  editButton.textContent = "Edit buku"
  editButton.addEventListener("click", function () {
    if (typeof handlers.onEdit === "function") {
      handlers.onEdit(book.id)
    }
  })

  actionContainer.append(toggleButton, deleteButton, editButton)
  bookContainer.append(titleEl, authorEl, yearEl, actionContainer)

  return bookContainer
}

function renderBooks(books, handlers, keyword = "") {
  const incompleteContainer = document.getElementById(
    INCOMPLETE_BOOKSHELF_LIST_ID,
  )
  const completeContainer = document.getElementById(COMPLETE_BOOKSHELF_LIST_ID)

  incompleteContainer.innerHTML = ""
  completeContainer.innerHTML = ""

  const normalizedKeyword = keyword.trim().toLowerCase()
  const renderedBooks = normalizedKeyword
    ? books.filter(function (book) {
        return book.title.toLowerCase().includes(normalizedKeyword)
      })
    : books

  renderedBooks.forEach(function (book) {
    const bookElement = createBookItemElement(book, handlers)

    if (book.isComplete) {
      completeContainer.append(bookElement)
      return
    }

    incompleteContainer.append(bookElement)
  })
}
