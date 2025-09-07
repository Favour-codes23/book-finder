import React, { useState, useEffect } from "react";

function EditBookModal({ isOpen, book, onClose, onSave, bookType }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    totalPages: "",
    currentPage: "",
    rating: 0,
    review: "",
    genre: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && book) {
      setFormData({
        title: book.title || book.volumeInfo?.title || "",
        author: book.author || book.volumeInfo?.authors?.join(", ") || "",
        totalPages: book.totalPages || book.volumeInfo?.pageCount || book.pages || "",
        currentPage: book.currentPage || 0,
        rating: book.rating || 0,
        review: book.review || "",
        genre: book.genre || book.volumeInfo?.categories?.[0] || ""
      });
      setErrors({});
    }
  }, [isOpen, book]);

  if (!isOpen || !book) return null;

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    }
    
    const totalPages = parseInt(formData.totalPages);
    if (!totalPages || totalPages < 1) {
      newErrors.totalPages = "Total pages must be a positive number";
    }
    
    if (bookType === "currentlyReading") {
      const currentPage = parseInt(formData.currentPage);
      if (currentPage < 0 || currentPage > totalPages) {
        newErrors.currentPage = `Current page must be between 0 and ${totalPages}`;
      }
    }
    
    if (bookType === "read" && (!formData.rating || formData.rating < 1 || formData.rating > 5)) {
      newErrors.rating = "Rating is required for finished books (1-5 stars)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedBook = {
      ...book,
      title: formData.title.trim(),
      author: formData.author.trim(),
      totalPages: parseInt(formData.totalPages),
      currentPage: parseInt(formData.currentPage) || 0,
      rating: parseInt(formData.rating) || 0,
      review: formData.review.trim(),
      genre: formData.genre.trim() || "Fiction",
      pages: parseInt(formData.totalPages) // For compatibility
    };

    onSave(updatedBook);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const renderStars = (rating, onRatingChange) => {
    return (
      <div style={{ fontSize: "1.5rem", marginBottom: "8px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              fontSize: "1.5rem",
              color: rating >= star ? "#ffd700" : "#e8dcc0",
              transition: "color 0.2s ease"
            }}
          >
            ★
          </button>
        ))}
        <span style={{ fontSize: "0.9rem", color: "#5d4e37", marginLeft: "8px" }}>
          {rating > 0 ? `${rating}/5 stars` : "No rating"}
        </span>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
        <button className="modal-close" onClick={onClose}>
          ✖
        </button>

        <h2 style={{ color: "#3a2f1f", marginBottom: "1.5rem", textAlign: "center" }}>
          Edit Book Details
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div style={{ marginBottom: "1rem" }}>
            <label 
              htmlFor="edit-title" 
              style={{ 
                display: "block", 
                marginBottom: "4px", 
                color: "#3a2f1f", 
                fontWeight: "600" 
              }}
            >
              Title *
            </label>
            <input
              id="edit-title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: `2px solid ${errors.title ? "#cd5c5c" : "#e8dcc0"}`,
                borderRadius: "6px",
                backgroundColor: "#fefcf7",
                color: "#3a2f1f",
                fontFamily: "Georgia, serif"
              }}
            />
            {errors.title && (
              <div style={{ color: "#cd5c5c", fontSize: "0.8rem", marginTop: "4px" }}>
                {errors.title}
              </div>
            )}
          </div>

          {/* Author */}
          <div style={{ marginBottom: "1rem" }}>
            <label 
              htmlFor="edit-author" 
              style={{ 
                display: "block", 
                marginBottom: "4px", 
                color: "#3a2f1f", 
                fontWeight: "600" 
              }}
            >
              Author *
            </label>
            <input
              id="edit-author"
              type="text"
              value={formData.author}
              onChange={(e) => handleChange("author", e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: `2px solid ${errors.author ? "#cd5c5c" : "#e8dcc0"}`,
                borderRadius: "6px",
                backgroundColor: "#fefcf7",
                color: "#3a2f1f",
                fontFamily: "Georgia, serif"
              }}
            />
            {errors.author && (
              <div style={{ color: "#cd5c5c", fontSize: "0.8rem", marginTop: "4px" }}>
                {errors.author}
              </div>
            )}
          </div>

          {/* Total Pages and Current Page (side by side) */}
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label 
                htmlFor="edit-total-pages" 
                style={{ 
                  display: "block", 
                  marginBottom: "4px", 
                  color: "#3a2f1f", 
                  fontWeight: "600" 
                }}
              >
                Total Pages *
              </label>
              <input
                id="edit-total-pages"
                type="number"
                min="1"
                value={formData.totalPages}
                onChange={(e) => handleChange("totalPages", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: `2px solid ${errors.totalPages ? "#cd5c5c" : "#e8dcc0"}`,
                  borderRadius: "6px",
                  backgroundColor: "#fefcf7",
                  color: "#3a2f1f",
                  fontFamily: "Georgia, serif"
                }}
              />
              {errors.totalPages && (
                <div style={{ color: "#cd5c5c", fontSize: "0.8rem", marginTop: "4px" }}>
                  {errors.totalPages}
                </div>
              )}
            </div>

            {bookType === "currentlyReading" && (
              <div style={{ flex: 1 }}>
                <label 
                  htmlFor="edit-current-page" 
                  style={{ 
                    display: "block", 
                    marginBottom: "4px", 
                    color: "#3a2f1f", 
                    fontWeight: "600" 
                  }}
                >
                  Current Page
                </label>
                <input
                  id="edit-current-page"
                  type="number"
                  min="0"
                  value={formData.currentPage}
                  onChange={(e) => handleChange("currentPage", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: `2px solid ${errors.currentPage ? "#cd5c5c" : "#e8dcc0"}`,
                    borderRadius: "6px",
                    backgroundColor: "#fefcf7",
                    color: "#3a2f1f",
                    fontFamily: "Georgia, serif"
                  }}
                />
                {errors.currentPage && (
                  <div style={{ color: "#cd5c5c", fontSize: "0.8rem", marginTop: "4px" }}>
                    {errors.currentPage}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Genre */}
          <div style={{ marginBottom: "1rem" }}>
            <label 
              htmlFor="edit-genre" 
              style={{ 
                display: "block", 
                marginBottom: "4px", 
                color: "#3a2f1f", 
                fontWeight: "600" 
              }}
            >
              Genre
            </label>
            <input
              id="edit-genre"
              type="text"
              value={formData.genre}
              onChange={(e) => handleChange("genre", e.target.value)}
              placeholder="e.g., Fiction, Mystery, Biography"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "2px solid #e8dcc0",
                borderRadius: "6px",
                backgroundColor: "#fefcf7",
                color: "#3a2f1f",
                fontFamily: "Georgia, serif"
              }}
            />
          </div>

          {/* Rating and Review for finished books */}
          {bookType === "read" && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  color: "#3a2f1f", 
                  fontWeight: "600" 
                }}>
                  Rating *
                </label>
                {renderStars(formData.rating, (rating) => handleChange("rating", rating))}
                {errors.rating && (
                  <div style={{ color: "#cd5c5c", fontSize: "0.8rem", marginTop: "4px" }}>
                    {errors.rating}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label 
                  htmlFor="edit-review" 
                  style={{ 
                    display: "block", 
                    marginBottom: "4px", 
                    color: "#3a2f1f", 
                    fontWeight: "600" 
                  }}
                >
                  Review
                </label>
                <textarea
                  id="edit-review"
                  value={formData.review}
                  onChange={(e) => handleChange("review", e.target.value)}
                  placeholder="Your thoughts about this book..."
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    border: "2px solid #e8dcc0",
                    borderRadius: "6px",
                    backgroundColor: "#fefcf7",
                    color: "#3a2f1f",
                    fontFamily: "Georgia, serif",
                    resize: "vertical"
                  }}
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "1.5rem" }}>
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
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBookModal;