import React from "react";

function BookModal({ book, onClose, onAddToGoal, isInGoal }) {
  if (!book) return null;

  const info = book.volumeInfo || {};

  //star rating
  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <div style={{ 
        fontSize: "1.2rem", 
        color: "#ffd700", 
        marginBottom: "10px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        <span>{'⭐'.repeat(rating)}</span>
        <span style={{ color: "#5d4e37", fontSize: "0.9rem" }}>({rating}/5 stars)</span>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        {info.imageLinks?.thumbnail && (
          <img src={info.imageLinks.thumbnail} alt={info.title} className="modal-img" />
        )}

        <h2 style={{ color: "#3a2f1f", marginBottom: "1rem" }}>
          {info.title || book.title}
        </h2>
        
        <p style={{ color: "#5d4e37", marginBottom: "0.5rem" }}>
          <strong>Author(s):</strong> {info.authors ? info.authors.join(", ") : book.author || "Unknown Author"}
        </p>

      
        {book.rating && renderStars(book.rating)}

        
        {book.review && (
          <div style={{ 
            marginBottom: "1rem", 
            padding: "12px", 
            backgroundColor: "#f9f6f0", 
            borderRadius: "8px",
            border: "1px solid #f0ebe0"
          }}>
            <strong style={{ color: "#3a2f1f", fontSize: "0.9rem" }}>Your Review:</strong>
            <p style={{ color: "#5d4e37", marginTop: "8px", lineHeight: "1.4", fontStyle: "italic" }}>
              "{book.review}"
            </p>
          </div>
        )}

        {(info.pageCount || book.pages) && (
          <p style={{ color: "#6b5b3d", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            <strong>Pages:</strong> {info.pageCount || book.pages}
          </p>
        )}

        {(info.publishedDate || book.finishedDate) && (
          <p style={{ color: "#6b5b3d", fontSize: "0.9rem", marginBottom: "1rem" }}>
            <strong>
              {book.finishedDate ? "Finished:" : "Published:"}
            </strong> {book.finishedDate ? new Date(book.finishedDate).toLocaleDateString() : info.publishedDate}
          </p>
        )}

        <p style={{ color: "#5d4e37", lineHeight: "1.5" }}>
          {info.description || "No description available."}
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
          {info.previewLink && (
            <a
              href={info.previewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-small btn-secondary"
            >
              🔗 Preview Book
            </a>
          )}

          
          {!book.rating && (
            <button
              className="btn btn-small"
              onClick={() => {
                if (onAddToGoal) onAddToGoal(book);
              }}
              disabled={isInGoal}
              style={isInGoal ? { opacity: 0.7, cursor: "not-allowed" } : {}}
            >
              {isInGoal ? "📚 In TBR ✓" : "➕ Add to TBR"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookModal;