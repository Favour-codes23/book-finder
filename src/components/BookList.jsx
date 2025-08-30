import React from "react";

function BookList({ books }) {
  if (!books || books.length === 0) {
    return <p style={{ textAlign: "center", color: "#555" }}>No books found. Try another search</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {books.map((book) => {
        const info = book.volumeInfo;

        return (
          <div
            key={book.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              transition: "transform 0.2s", 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
            }}
          >
            {/* Book Cover */}
            {info.imageLinks?.thumbnail ? (
              <img
                src={info.imageLinks.thumbnail}
                alt={info.title}
                style={{
                  width: "100%",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "250px",
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#666",
                  borderRadius: "5px",
                }}
              >
                No Image
              </div>
            )}

            {/* Title */}
            <h3 style={{ fontSize: "16px", margin: "10px 0" }}>{info.title}</h3>

            {/* Authors */}
            <p style={{ fontSize: "14px", color: "#555" }}>
              {info.authors ? info.authors.join(", ") : "Unknown Author"}
            </p>

            {/* Description */}
            <p style={{ fontSize: "13px", color: "#666" }}>
              {info.description
                ? info.description.substring(0, 100) + "..."
                : "No description available."}
            </p>

            {/* Preview Link */}
            {info.previewLink && (
              <a
                href={info.previewLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  color: "#007bff",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
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
