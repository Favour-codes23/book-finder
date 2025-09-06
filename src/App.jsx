import React, { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import BookModal from "./components/BookModal";
import Sidebar from "./components/Sidebar";
import ReadingAnalytics from "./components/ReadingAnalytics";
import "./App.css";


function App() {
  // existing app state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);

  // navigation + shelves
  const [currentPage, setCurrentPage] = useState("home");
  const [goalBooks, setGoalBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", finishedDate: "2024-08-15", pages: 180, genre: "Fiction" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", finishedDate: "2024-08-28", pages: 281, genre: "Fiction" },
    { id: 3, title: "1984", author: "George Orwell", finishedDate: "2024-09-02", pages: 328, genre: "Dystopian" },
  ]);
  const [currentlyReading, setCurrentlyReading] = useState([
    { id: 4, title: "Dune", author: "Frank Herbert", currentPage: 150, totalPages: 688, startDate: "2024-08-20" }
  ]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const maxResults = 10;

  // existing search function
  const searchBooks = async (newQuery, reset = false) => {
    setLoading(true);
    setError("");

    try {
      const startIndex = reset ? 0 : page * maxResults;

      if (reset) {
        setBooks([]);
        setPage(0);
        setQuery(newQuery);
      }

      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          newQuery
        )}&startIndex=${startIndex}&maxResults=${maxResults}`
      );

      if (!response.ok) {
        throw new Error("Something went wrong.. Try again.");
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

  // add a book to Goal (To Be Read)
  const addToGoal = (book) => {
    setGoalBooks((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev;
      return [book, ...prev];
    });
    setSelectedBook(null);
    setCurrentPage("goal");
  };

  // mark a Goal book as Read
  const markAsRead = (book) => {
    setGoalBooks((prev) => prev.filter((b) => b.id !== book.id));
    setReadBooks((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev;
      return [book, ...prev];
    });
  };

  // start reading a book from TBR
  const startReading = (book) => {
    setGoalBooks((prev) => prev.filter((b) => b.id !== book.id));
    setCurrentlyReading((prev) => [...prev, {
      ...book,
      currentPage: 0,
      totalPages: book.volumeInfo?.pageCount || 200,
      startDate: new Date().toISOString().split('T')[0]
    }]);
  };

  // mark currently reading book as finished
  const markCurrentAsFinished = (book) => {
    setCurrentlyReading((prev) => prev.filter((b) => b.id !== book.id));
    setReadBooks((prev) => [...prev, {
      ...book,
      finishedDate: new Date().toISOString().split('T')[0],
      pages: book.totalPages || 200,
      genre: "Fiction" // Default genre
    }]);
  };

  const isBookInGoal = (book) => {
    if (!book) return false;
    return goalBooks.some((b) => b.id === book.id);
  };

  // Helper to render the Currently Reading page
  const renderCurrentlyReadingPage = () => {
    return (
      <div>
        <h2 style={{ textAlign: "center", marginTop: "12px", color: "#3a2f1f" }}>Currently Reading</h2>

        {currentlyReading.length === 0 ? (
          <div className="no-books" style={{ marginTop: "1rem" }}>
            <p>No books currently being read.</p>
          </div>
        ) : (
          <div className="book-list" style={{ padding: "1rem" }}>
            {currentlyReading.map((book) => (
              <div key={book.id} className="reading-item">
                <div onClick={() => setSelectedBook(book)} style={{ cursor: "pointer" }}>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                </div>

                <div className="progress-section">
                  <div className="progress-info">
                    <span>Progress: {book.currentPage}/{book.totalPages} pages</span>
                    <span>{Math.round((book.currentPage / book.totalPages) * 100)}%</span>
                  </div>
                  <div style={{ width: "100%", backgroundColor: "#f0ebe0", borderRadius: "8px", height: "8px" }}>
                    <div 
                      style={{ 
                        width: `${(book.currentPage / book.totalPages) * 100}%`,
                        backgroundColor: "#cd853f",
                        height: "8px",
                        borderRadius: "8px",
                        transition: "width 0.3s ease"
                      }}
                    ></div>
                  </div>

                  <div className="progress-controls" style={{ marginTop: "10px" }}>
                    <input 
                      type="number" 
                      className="progress-input"
                      placeholder="Current page"
                      max={book.totalPages}
                      min={0}
                    />
                    <button className="btn btn-small">Update Progress</button>
                    <button 
                      className="btn btn-small"
                      onClick={() => markCurrentAsFinished(book)}
                    >
                      ✅ Mark as Finished
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper to render the Goal page ui
  const renderGoalPage = () => {
    return (
      <div>
        <h2 style={{ textAlign: "center", marginTop: "12px", color: "#3a2f1f" }}>Your Goal (To Be Read)</h2>

        {goalBooks.length === 0 ? (
          <div className="no-books" style={{ marginTop: "1rem" }}>
            <p>No books in your goal yet. Add some from Home!</p>
          </div>
        ) : (
          <div className="book-list" style={{ padding: "1rem" }}>
            {goalBooks.map((book) => (
              <div key={book.id} className="goal-item">
                <div onClick={() => setSelectedBook(book)} style={{ cursor: "pointer" }}>
                  <BookList books={[book]} onSelectBook={setSelectedBook} />
                </div>

                <div style={{ marginTop: "0.5rem", display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-small"
                    onClick={() => startReading(book)}
                  >
                    📖 Start Reading
                  </button>

                  <button
                    className="btn btn-small"
                    onClick={() => markAsRead(book)}
                  >
                    ✅ Mark as Read
                  </button>

                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() =>
                      setGoalBooks((prev) => prev.filter((b) => b.id !== book.id))
                    }
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )} 
      </div>
    );
  };

  // Helper to render the Read page UI
  const renderReadPage = () => {
    return (
      <div>
        <h2 style={{ textAlign: "center", marginTop: "12px", color: "#3a2f1f" }}>Read</h2>

        {readBooks.length === 0 ? (
          <div className="no-books" style={{ marginTop: "1rem" }}>
            <p>No books marked as read yet.</p>
          </div>
        ) : (
          <div className="book-list" style={{ padding: "1rem" }}>
            {readBooks.map((book) => (
              <div key={book.id} style={{ display: "flex", flexDirection: "column" }}>
                <div onClick={() => setSelectedBook(book)} style={{ cursor: "pointer" }}>
                  <div className="book-card">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-author">by {book.author}</p>
                    <div className="book-metadata">
                      <p style={{ fontSize: "0.8rem", color: "#6b5b3d" }}>
                        {book.pages} pages • {book.genre}
                      </p>
                      <p style={{ fontSize: "0.8rem", color: "#4a7c59", marginTop: "4px" }}>
                        Finished: {new Date(book.finishedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    className="btn btn-small btn-danger"
                    onClick={() =>
                      setReadBooks((prev) => prev.filter((b) => b.id !== book.id))
                    }
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        goalBooks={goalBooks}
        readBooks={readBooks}
        currentlyReading={currentlyReading}
      />
      
      <div className="main-content" style={{ flex: 1, marginLeft: sidebarOpen ? "280px" : "0", transition: "margin-left 0.3s ease" }}>
        {/* Mobile Header */}
        <div className="mobile-header" style={{ display: "none" }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="btn">
            ☰ Menu
          </button>
          <h1>Hello, Bookish</h1>
        </div>

        {/* HOME */}
        {currentPage === "home" && (
          <div>
            <Header />
            <SearchBar
              onSearch={(q) => {
                searchBooks(q, true);
                setCurrentPage("home");
              }}
            />

            {loading && <div className="spinner"></div>}
            {error && <p className="error">❌ {error}</p>}

            {!loading && !error && <BookList books={books} onSelectBook={setSelectedBook} />}

            {!loading && books.length > 0 && (
              <div className="load-more-container">
                <button onClick={() => searchBooks(query, false)} className="btn">
                  Load More
                </button>
              </div>
            )}
          </div>
        )}

        {/* CURRENTLY READING */}
        {currentPage === "currently-reading" && renderCurrentlyReadingPage()}

        {/* GOAL */}
        {currentPage === "goal" && renderGoalPage()}

        {/* READ */}
        {currentPage === "read" && renderReadPage()}

        {/* ANALYTICS */}
        {currentPage === "analytics" && (
          <ReadingAnalytics 
            readBooks={readBooks}
            currentlyReading={currentlyReading}
            goalBooks={goalBooks}
          />
        )}
      </div>

      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onAddToGoal={addToGoal}
        isInGoal={isBookInGoal(selectedBook)}
      />
    </div>
  );
}

export default App;

