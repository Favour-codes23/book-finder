import React from 'react';

function Header() {
  return (
    <header
      style={{
        backgroundColor: "#007bff",
        padding: "20px",
        textAlign: "center",
        color: "white",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "bold"}}>
        Hello, Book Finder📚
      </h1>
      <p style={{ marginTop: "5px", fontSize: "14px", opacity: 0.9 }}>
        search for your favorite books
      </p>
    </header>
  );
}
export default Header;