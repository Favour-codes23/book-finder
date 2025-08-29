import React, { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";

function App() {
  const [books, setBooks] = useState([]);

  const searchBooks = async (query) => {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );
    const data = await response.json();
    setBooks(data.items || []);
    console.log(data);
  };

  return (
    <div>
      <Header />
      <SearchBar onSearch={searchBooks}/>

      <p>Found {books.length} books</p>
      <BookList books={books} />
    </div>
  );
}
export default App;