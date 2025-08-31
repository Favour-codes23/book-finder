import React from "react";

function BookList({ books }) {
  if (!books || books.length === 0) {
    return (
      <div className="no-books">
        <span role="img" aria-label="books" style={{ fontSize: '2rem'}}>📚</span> 
        <h2>No books found</h2>
        <p>Try searching with a different keyword.</p>
        </div>
    );
  }

  return (
    <div className="book-list">
      {books.map((book) => {
        const info = book.volumeInfo;

        return (
          <div
            key={book.id} className="book-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
            }}
          >
            
            {info.imageLinks?.thumbnail ? (
              <img
                src={info.imageLinks.thumbnail}
                alt={info.title}
                className="book-img"
              />
            ) : (
              <div className="book-img-placeholder" > No Image</div>
            )}

            <h3 className="book-title">{info.title}</h3>

            <p className="book-author">
              {info.authors ? info.authors.join(", ") : "Unknown Author"}
            </p>

            <p className="book-desc">
              {info.description
                ? info.description.substring(0, 100) + "..."
                : "No description available."}
            </p>

            {info.previewLink && (
              <a
                href={info.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="preview-btn"
              >
                🔗 Preview Book
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default BookList;
