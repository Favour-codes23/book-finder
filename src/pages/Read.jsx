import React from "react";

const ReadList = ({ books, onBookClick }) => {
  if (!books || books.length === 0) {
    return <p className="empty-state">📖 You haven’t read any books yet</p>;
  }

  return (
    <div className="read-list">
      {books.map((book, index) => {
        const info = book.volumeInfo;
        return (
          <div
            key={index}
            className="read-card"
            onClick={() => onBookClick(book)}
          >
            {info.imageLinks?.thumbnail ? (
              <img
                src={info.imageLinks.thumbnail}
                alt={info.title}
                className="read-img"
              />
            ) : (
              <div className="read-img placeholder">No Image</div>
            )}

            <div className="read-info">
              <h3>{info.title}</h3>
              <p>{info.authors ? info.authors.join(", ") : "Unknown Author"}</p>
              <span className="badge">📖 Read</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReadList;

