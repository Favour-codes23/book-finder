import React, { useState, useEffect, useMemo, useCallback } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import BookList from "./components/BookList";
import BookModal from "./components/BookModal";
import Sidebar from "./components/SideBar";
import ReadingAnalytics from "./components/ReadingAnalytics";
import ReviewModal from "./components/ReviewModal";
import EditBookModal from "./components/EditBookModal";
import DataManager from "./components/DataManager";
import "./App.css";

function App() {
  // existing app state
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);

  // navigation + shelves - removed hardcoded data, will load from localStorage
  const [currentPage, setCurrentPage] = useState("home");
  const [goalBooks, setGoalBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // New state for review system
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [bookToReview, setBookToReview] = useState(null);

  // New state for editing functionality
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [bookEditType, setBookEditType] = useState(""); // "goal", "currentlyReading", or "read"

  const maxResults = 10;

  // Storage keys - memoized to avoid dependency issues
  const STORAGE_KEYS = useMemo(() => ({
    goalBooks: 'bookish-goal-books',
    readBooks: 'bookish-read-books', 
    currentlyReading: 'bookish-currently-reading'
  }), []);

  // Helper function to safely parse JSON from localStorage
  const getFromStorage = useCallback((key) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return [];
      return JSON.parse(item);
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return [];
    }
  }, []);

  // Helper function to safely save to localStorage
  const saveToStorage = useCallback((key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Saved ${key} to localStorage:`, data.length, 'items');
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, []);

  // Load data from localStorage on component mount
  useEffect(() => {
    console.log('Loading data from localStorage...');
    
    const savedGoalBooks = getFromStorage(STORAGE_KEYS.goalBooks);
    const savedReadBooks = getFromStorage(STORAGE_KEYS.readBooks);
    const savedCurrentlyReading = getFromStorage(STORAGE_KEYS.currentlyReading);

    console.log('Loaded goal books:', savedGoalBooks.length);
    console.log('Loaded read books:', savedReadBooks.length);
    console.log('Loaded currently reading:', savedCurrentlyReading.length);

    setGoalBooks(savedGoalBooks);
    setReadBooks(savedReadBooks);
    setCurrentlyReading(savedCurrentlyReading);
    setDataLoaded(true);
  }, [getFromStorage, STORAGE_KEYS.goalBooks, STORAGE_KEYS.readBooks, STORAGE_KEYS.currentlyReading]);

  // Save to localStorage whenever the arrays change (but only after initial load)
  useEffect(() => {
    if (dataLoaded) {
      saveToStorage(STORAGE_KEYS.goalBooks, goalBooks);
    }
  }, [goalBooks, dataLoaded, saveToStorage, STORAGE_KEYS.goalBooks]);

  useEffect(() => {
    if (dataLoaded) {
      saveToStorage(STORAGE_KEYS.readBooks, readBooks);
    }
  }, [readBooks, dataLoaded, saveToStorage, STORAGE_KEYS.readBooks]);

  useEffect(() => {
    if (dataLoaded) {
      saveToStorage(STORAGE_KEYS.currentlyReading, currentlyReading);
    }
  }, [currentlyReading, dataLoaded, saveToStorage, STORAGE_KEYS.currentlyReading]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth <= 768 && sidebarOpen) {
        const sidebar = document.querySelector('.sidebar');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (sidebar && !sidebar.contains(event.target) && 
            mobileMenuBtn && !mobileMenuBtn.contains(event.target)) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  // Handle sidebar behavior - always start closed, only close on mobile when resizing
  useEffect(() => {
    const handleResize = () => {
      // Only close sidebar on mobile, don't auto-open on any screen size
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      }
    };

    // Set initial state - start closed on all devices
    setSidebarOpen(false);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      const newBooks = [book, ...prev];
      console.log('Adding book to goal. New count:', newBooks.length);
      return newBooks;
    });
    setSelectedBook(null);
    setCurrentPage("goal");
  };

  // mark a Goal book as Read with rating/review
  const markAsRead = (book) => {
    setGoalBooks((prev) => prev.filter((b) => b.id !== book.id));
    setBookToReview(book);
    setReviewModalOpen(true);
  };

  // Handle adding a book with review to read books
  const addBookWithReview = (book, rating, review) => {
    const bookWithReview = {
      ...book,
      rating,
      review,
      finishedDate: new Date().toISOString().split('T')[0],
      pages: book.volumeInfo?.pageCount || book.totalPages || 200,
      genre: book.volumeInfo?.categories?.[0] || "Fiction",
      title: book.title || book.volumeInfo?.title || "Unknown Title",
      author: book.author || book.volumeInfo?.authors?.join(", ") || "Unknown Author"
    };

    setReadBooks((prev) => {
      if (prev.some((b) => b.id === book.id)) return prev;
      const newBooks = [bookWithReview, ...prev];
      console.log('Adding book to read books. New count:', newBooks.length);
      return newBooks;
    });
    setReviewModalOpen(false);
    setBookToReview(null);
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

  // mark currently reading book as finished with review
  const markCurrentAsFinished = (book) => {
    setCurrentlyReading((prev) => prev.filter((b) => b.id !== book.id));
    setBookToReview(book);
    setReviewModalOpen(true);
  };

  // Update reading progress
  const updateReadingProgress = (bookId, newPage) => {
    setCurrentlyReading((prev) => 
      prev.map((book) => 
        book.id === bookId 
          ? { ...book, currentPage: Math.min(Math.max(0, newPage), book.totalPages) }
          : book
      )
    );
  };

  // Edit book functionality
  const openEditModal = (book, bookType) => {
    setBookToEdit(book);
    setBookEditType(bookType);
    setEditModalOpen(true);
  };

  const saveEditedBook = (updatedBook) => {
    switch (bookEditType) {
      case "goal":
        setGoalBooks((prev) => 
          prev.map((book) => book.id === updatedBook.id ? updatedBook : book)
        );
        break;
      case "currentlyReading":
        setCurrentlyReading((prev) => 
          prev.map((book) => book.id === updatedBook.id ? updatedBook : book)
        );
        break;
      case "read":
        setReadBooks((prev) => 
          prev.map((book) => book.id === updatedBook.id ? updatedBook : book)
        );
        break;
      default:
        break;
    }
    setEditModalOpen(false);
    setBookToEdit(null);
    setBookEditType("");
  };

  // Import data functionality
  const handleImportData = (importedData) => {
    setGoalBooks(importedData.goalBooks || []);
    setReadBooks(importedData.readBooks || []);
    setCurrentlyReading(importedData.currentlyReading || []);
  };

  const isBookInGoal = (book) => {
    if (!book) return false;
    return goalBooks.some((b) => b.id === book.id);
  };

  // Component for individual currently reading items
  const CurrentlyReadingItem = ({ book, onUpdateProgress, onMarkAsFinished, onSelectBook, onEdit }) => {
    const [tempPage, setTempPage] = useState(book.currentPage);

    return (
      <div className="reading-item">
        <div onClick={() => onSelectBook(book)} style={{ cursor: "pointer" }}>
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author || book.volumeInfo?.authors?.join(", ") || "Unknown Author"}</p>
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
              value={tempPage}
              onChange={(e) => setTempPage(parseInt(e.target.value) || 0)}
              max={book.totalPages}
              min={0}
            />
            <button 
              className="btn btn-small"
              onClick={() => {
                onUpdateProgress(book.id, tempPage);
              }}
            >
              Update Progress
            </button>
            <button 
              className="btn btn-small"
              onClick={() => onMarkAsFinished(book)}
            >
              Mark as Finished
            </button>
            <button 
              className="btn btn-small btn-secondary"
              onClick={() => onEdit(book, "currentlyReading")}
              title="Edit book details"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    );
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
              <CurrentlyReadingItem 
                key={book.id}
                book={book}
                onUpdateProgress={updateReadingProgress}
                onMarkAsFinished={markCurrentAsFinished}
                onSelectBook={setSelectedBook}
                onEdit={openEditModal}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper to render the Goal page UI
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

                <div style={{ marginTop: "0.5rem", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    className="btn btn-small"
                    onClick={() => startReading(book)}
                  >
                    Start Reading
                  </button>

                  <button
                    className="btn btn-small"
                    onClick={() => markAsRead(book)}
                  >
                    Mark as Read
                  </button>

                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() => openEditModal(book, "goal")}
                    title="Edit book details"
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-small btn-secondary"
                    onClick={() =>
                      setGoalBooks((prev) => prev.filter((b) => b.id !== book.id))
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Helper to render star rating display
  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Helper to render the Read page UI with bookshelf design
  const renderReadPage = () => {
    return (
      <div>
        <h2 style={{ textAlign: "center", marginTop: "12px", color: "#3a2f1f" }}>My Bookshelf</h2>

        {readBooks.length === 0 ? (
          <div className="no-books" style={{ marginTop: "1rem" }}>
            <p>No books on your shelf yet. Start reading to fill it up!</p>
          </div>
        ) : (
          <div className="bookshelf-container" style={{ padding: "1rem" }}>
            <div className="bookshelf">
              {readBooks.map((book, index) => {
                // Generate a unique color for each book based on its title
                const bookHue = (book.title ? book.title.charCodeAt(0) + book.title.length : index) * 137.508; // Golden angle
                
                return (
                  <div 
                    key={book.id} 
                    className="book-spine" 
                    onClick={() => setSelectedBook(book)}
                    style={{
                      '--book-hue': bookHue % 360
                    }}
                  >
                    <div className="book-spine-content">
                      <div className="book-spine-title">{book.title}</div>
                      <div className="book-spine-author">{book.author}</div>
                      <div className="book-spine-rating">{renderStars(book.rating || 0)}</div>
                    </div>
                    
                    {/* Edit button */}
                    <button
                      className="edit-book-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(book, "read");
                      }}
                      title="Edit book details"
                    >
                      ✎
                    </button>
                    
                    <button
                      className="remove-book-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setReadBooks((prev) => prev.filter((b) => b.id !== book.id));
                      }}
                      title="Remove from shelf"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Debug component to show localStorage status
  const DebugInfo = () => {
    // Only show in development - simple browser check
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (!isDevelopment) return null;
    
    return (
      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999
      }}>
        <div>Goal Books: {goalBooks.length}</div>
        <div>Read Books: {readBooks.length}</div>
        <div>Currently Reading: {currentlyReading.length}</div>
        <div>Data Loaded: {dataLoaded ? 'Yes' : 'No'}</div>
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
      
      <div className="main-content" style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? "280px" : "0", 
        transition: "margin-left 0.3s ease" 
      }}>
        {/* Mobile Header */}
        <div className="mobile-header">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="mobile-menu-btn"
          >
            ☰ Menu
          </button>
          <h1>Hello, Bookish</h1>
        </div>

        {/* HOME */}
        {currentPage === "home" && (
          <div>
            <div className="header-container">
              <Header />
            </div>
            <SearchBar
              onSearch={(q) => {
                searchBooks(q, true);
                setCurrentPage("home");
              }}
            />

            {loading && <div className="spinner"></div>}
            {error && <p className="error">{error}</p>}

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

        {/* DATA MANAGEMENT */}
        {currentPage === "data" && (
          <DataManager 
            goalBooks={goalBooks}
            readBooks={readBooks}
            currentlyReading={currentlyReading}
            onImportData={handleImportData}
          />
        )}
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && window.innerWidth <= 768 && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onAddToGoal={addToGoal}
        isInGoal={isBookInGoal(selectedBook)}
      />

      <ReviewModal
        isOpen={reviewModalOpen}
        book={bookToReview}
        onClose={() => {
          setReviewModalOpen(false);
          setBookToReview(null);
        }}
        onSubmit={addBookWithReview}
      />

      <EditBookModal
        isOpen={editModalOpen}
        book={bookToEdit}
        bookType={bookEditType}
        onClose={() => {
          setEditModalOpen(false);
          setBookToEdit(null);
          setBookEditType("");
        }}
        onSave={saveEditedBook}
      />

      <DebugInfo />
    </div>
  );
}

export default App;