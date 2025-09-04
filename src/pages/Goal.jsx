import React from "react";

const GoalList = ({ books, onBookClick }) => {
  if (!books || books.length === 0) {
    return <p className="empty-state">🎯 No books in your Goal yet</p>;
  }

  return (
    <div className="goal-list">
      {books.map((book, index) => {
        const info = book.volumeInfo;
        return (
          <div
            key={index}
            className="goal-card"
            onClick={() => onBookClick(book)}
          >
            {info.imageLinks?.thumbnail ? (
              <img
                src={info.imageLinks.thumbnail}
                alt={info.title}
                className="goal-img"
              />
            ) : (
              <div className="goal-img placeholder">No Image</div>
            )}

            <div className="goal-info">
              <h3>{info.title}</h3>
              <p>{info.authors ? info.authors.join(", ") : "Unknown Author"}</p>
              <span className="badge">🎯 Goal</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GoalList;

