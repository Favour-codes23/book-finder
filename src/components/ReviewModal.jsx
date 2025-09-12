import React, { useState, useEffect } from "react";

function ReviewModal({ isOpen, book, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  // Reset form when modal opens with a new book
  useEffect(() => {
    if (isOpen && book) {
      setRating(0);
      setReview("");
      setHoveredRating(0);
    }
  }, [isOpen, book]);

  if (!isOpen || !book) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(book, rating, review);
      setRating(0);
      setReview("");
      setHoveredRating(0);
    }
  };

  const info = book.volumeInfo || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2 style={{ color: "#3a2f1f", marginBottom: "8px" }}>Rate & Review</h2>
          <h3 style={{ color: "#5d4e37", marginBottom: "4px" }}>{info.title || book.title}</h3>
          <p style={{ color: "#6b5b3d", fontSize: "0.9rem" }}>
            by {info.authors?.join(", ") || book.author || "Unknown Author"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Star Rating */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "12px", 
              color: "#3a2f1f", 
              fontWeight: "600",
              fontSize: "1.1rem"
            }}>
              Your Rating *
            </label>
            <div style={{ fontSize: "2rem" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    fontSize: "2rem",
                    color: (hoveredRating >= star || rating >= star) ? "#ffd700" : "#e8dcc0",
                    transition: "color 0.2s ease"
                  }}
                >
                  ★
                </button>
              ))}
            </div>
            <p style={{ 
              fontSize: "0.8rem", 
              color: "#6b5b3d", 
              marginTop: "8px" 
            }}>
              {rating === 0 && hoveredRating === 0 ? "Click to rate" :
               rating > 0 ? `You rated: ${rating} star${rating > 1 ? 's' : ''}` :
               `${hoveredRating} star${hoveredRating > 1 ? 's' : ''}`}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label 
              htmlFor="review" 
              style={{ 
                display: "block", 
                marginBottom: "8px", 
                color: "#3a2f1f", 
                fontWeight: "600" 
              }}
            >
              Your Review (Optional)
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this book..."
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                border: "2px solid #e8dcc0",
                borderRadius: "8px",
                backgroundColor: "#fefcf7",
                color: "#3a2f1f",
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                resize: "vertical",
                minHeight: "100px"
              }}
              onFocus={(e) => e.target.style.borderColor = "#cd853f"}
              onBlur={(e) => e.target.style.borderColor = "#e8dcc0"}
            />
          </div>

          
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary btn-small"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-small"
              disabled={rating === 0}
              style={rating === 0 ? { opacity: 0.6, cursor: "not-allowed" } : {}}
            >
              Add to Finished Books
            </button>
          </div>
        </form>

        {rating === 0 && (
          <p style={{ 
            fontSize: "0.8rem", 
            color: "#8b4142", 
            textAlign: "center", 
            marginTop: "8px",
            fontStyle: "italic"
          }}>
            Please provide a rating to continue
          </p>
        )}
      </div>
    </div>
  );
}

export default ReviewModal;