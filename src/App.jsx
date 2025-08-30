import React, { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchBooks = async (query) => {
    setLoading(true);
    setError('');
    setBooks([]);

    try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );

    if (!response.ok) {
      throw new Error('Something went wrong.. Try again.');
    }

    const data = await response.json();
    setBooks(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{  fontFamily: "Arial, sans-serif", 
                backgroundColor: "#f9f9f9", 
                minHeight: "100vh"
            }}
    >
      <Header />
      <SearchBar onSearch={searchBooks}/>
          
      {loading && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>⏳Loading...</p>
      )}

      {error && (
        <p style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
          ❌{error}
        </p>
        )}
    
      {!loading && !error && <BookList books ={books}/>}
    </div>
  );
}
export default App;