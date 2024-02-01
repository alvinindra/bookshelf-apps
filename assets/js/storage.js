const composeData = (title, author, year, isFinished) => {
  return {
    id: +new Date(),
    title,
    author,
    year,
    isFinished
  }
}

const isStorageExist = () => {
 if(typeof(Storage) === undefined){
     alert("Browser kamu tidak mendukung local storage");
     return false
 }
 return true;
}

const saveData = () => {
 const parsed = JSON.stringify(books);
 localStorage.setItem(BOOKSHELF_KEY, parsed);
 document.dispatchEvent(new Event("ondatasaved"));
}

const loadDataFromStorage = () => {
 const serializedData = localStorage.getItem(BOOKSHELF_KEY);
 
 let data = JSON.parse(serializedData);
 
 if(data !== null) books = data;

 document.dispatchEvent(new Event("ondataloaded"));
}

const updateDataToStorage = () => {
 if(isStorageExist())
     saveData();
}

const findBook = bookId => {
 for(book of books){
     if(book.id === bookId)
         return book;
 }
 return null;
}


const findBookIndex = bookId => {
 let index = 0
 for (book of books) {
     if(book.id === bookId)
         return index;

     index++;
 }

 return -1;
}