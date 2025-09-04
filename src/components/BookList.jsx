import React from "react";
import BookCard from "./BookCard";

function BookList({ books, onSelectBook }) {
  if (!books || books.length === 0) {
    return (
      <div className="no-books">
        <span role="img" aria-label="books" style={{ fontSize: "2rem" }}>📚</span>
        <h2>No books found</h2>
        <p>Try searching with a different keyword.</p>
        <p style={{ fontSize: "0.9rem", color: "#888", marginTop: "0.5rem" }}>
          Popular searches: "fiction", "mystery", "self help", "biography"
        </p>
      </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard key={book.id} book={book} onClick={() => onSelectBook(book)} />
      ))}
    </div>
  );
}

export default BookList;
