import React from "react";

function BookModal({ book, onClose, onAddToGoal, isInGoal }) {
  if (!book) return null;

  const info = book.volumeInfo;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        {info.imageLinks?.thumbnail && (
          <img src={info.imageLinks.thumbnail} alt={info.title} className="modal-img" />
        )}

        <h2 style={{ color: "#3a2f1f", marginBottom: "1rem" }}>{info.title}</h2>
        
        <p style={{ color: "#5d4e37", marginBottom: "0.5rem" }}>
          <strong>Author(s):</strong> {info.authors ? info.authors.join(", ") : "Unknown Author"}
        </p>

        {info.pageCount && (
          <p style={{ color: "#6b5b3d", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
            <strong>Pages:</strong> {info.pageCount}
          </p>
        )}

        {info.publishedDate && (
          <p style={{ color: "#6b5b3d", fontSize: "0.9rem", marginBottom: "1rem" }}>
            <strong>Published:</strong> {info.publishedDate}
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

          {/* Add to TBR button */}
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
        </div>
      </div>
    </div>
  );
}

export default BookModal;