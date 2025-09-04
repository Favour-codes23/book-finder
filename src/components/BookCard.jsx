import React from "react";

const BookCard = ({ book, onClick }) => {
  const info = book.volumeInfo;

  return (
    <div className="book-card" onClick={onClick}>
      {info.imageLinks?.thumbnail ? (
        <img src={info.imageLinks.thumbnail} alt={info.title} className="book-img" />
      ) : (
        <div className="book-img-placeholder">No Image</div>
      )}

      <h3 className="book-title">{info.title}</h3>
      <p className="book-author">
        {info.authors ? info.authors.join(", ") : "Unknown Author"}
      </p>
    </div>
  );
};

export default BookCard;
