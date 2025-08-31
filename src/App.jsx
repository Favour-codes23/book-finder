import React, { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import './App.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const maxResults = 10;

  const searchBooks = async (newQuery, reset = false) => {
    setLoading(true);
    setError('');

    try {
      const startIndex = reset ? 0 : page * maxResults;

      if (reset) {
        setBooks([]);
        setPage(0);
        setQuery(newQuery);
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${newQuery}&startIndex=${startIndex}&maxResults=${maxResults}`
      );

      if (!response.ok) {
        throw new Error('Something went wrong.. Try again.');
      }

      const data = await response.json();

      setBooks((prevBooks) =>
        reset ? data.items || [] : [...prevBooks, ...(data.items || [])]
      );

      if (reset) {
        setPage(1);
      } else {
        setPage((prevPage) => prevPage + 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <SearchBar onSearch={(q) => searchBooks(q, true)} />

      {loading && <div className="spinner"></div>}
      {error && <p className="error">❌ {error}</p>}

      {!loading && !error && <BookList books={books} />}

      {!loading && books.length > 0 && (
        <div className="load-more-container">
          <button
            onClick={() => searchBooks(query, false)}
            className="load-more-btn"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
