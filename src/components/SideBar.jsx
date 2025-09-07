import React from 'react';

function Sidebar({ currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, goalBooks, readBooks, currentlyReading }) {
  // Calculate quick stats
  const calculateQuickStats = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    const booksThisMonth = readBooks.filter(book => {
      if (!book.finishedDate) return false;
      const finishedDate = new Date(book.finishedDate);
      return finishedDate.getMonth() === thisMonth && finishedDate.getFullYear() === thisYear;
    }).length;

    return {
      booksThisMonth,
      streak: 7, // Mock streak data
      totalBooksRead: readBooks.length
    };
  };

  const stats = calculateQuickStats();

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(90, 60, 40, 0.7)",
            zIndex: 999,
            display: window.innerWidth <= 768 ? "block" : "none"
          }}
        />
      )}

      <div 
        className="sidebar"
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-280px",
          width: "280px",
          height: "100vh",
          backgroundColor: "#faf7f0",
          borderRight: "2px solid #e8dcc0",
          transition: "left 0.3s ease",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          boxShadow: "2px 0 10px rgba(139, 115, 85, 0.15)"
        }}
      >
        {/* Sidebar Header */}
        <div 
          className="sidebar-header"
          style={{
            background: "linear-gradient(135deg, #8b4513, #cd853f, #daa520)",
            color: "#fefcf7",
            padding: "20px",
            borderRadius: "0 0 12px 12px",
            margin: "0 8px 0 0"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ 
                fontSize: "1.4rem", 
                margin: "0 0 4px 0", 
                fontWeight: "600",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)"
              }}>
                📚 Hello, Bookish
              </h1>
              <p style={{ 
                fontSize: "0.9rem", 
                margin: 0, 
                opacity: 0.9 
              }}>
                Track • Discover • Remember
              </p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "rgba(254, 252, 247, 0.2)",
                border: "1px solid rgba(254, 252, 247, 0.4)",
                color: "#fefcf7",
                borderRadius: "6px",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "1.2rem"
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: "16px", flex: 1 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            
            <button
              onClick={() => { setCurrentPage("home"); setSidebarOpen(false); }}
              className={`sidebar-nav-btn ${currentPage === "home" ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "Georgia, serif",
                width: "100%",
                textAlign: "left",
                transition: "all 0.2s ease",
                backgroundColor: currentPage === "home" ? "#e8dcc0" : "transparent",
                color: currentPage === "home" ? "#3a2f1f" : "#5d4e37"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🔍</span>
              Search Books
            </button>

            <button
              onClick={() => { setCurrentPage("currently-reading"); setSidebarOpen(false); }}
              className={`sidebar-nav-btn ${currentPage === "currently-reading" ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "Georgia, serif",
                width: "100%",
                textAlign: "left",
                transition: "all 0.2s ease",
                backgroundColor: currentPage === "currently-reading" ? "#e8dcc0" : "transparent",
                color: currentPage === "currently-reading" ? "#3a2f1f" : "#5d4e37"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>📖</span>
              Currently Reading
              {currentlyReading.length > 0 && (
                <span style={{
                  backgroundColor: "#cd853f",
                  color: "#fefcf7",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  marginLeft: "auto"
                }}>
                  {currentlyReading.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setCurrentPage("goal"); setSidebarOpen(false); }}
              className={`sidebar-nav-btn ${currentPage === "goal" ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "Georgia, serif",
                width: "100%",
                textAlign: "left",
                transition: "all 0.2s ease",
                backgroundColor: currentPage === "goal" ? "#e8dcc0" : "transparent",
                color: currentPage === "goal" ? "#3a2f1f" : "#5d4e37"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🎯</span>
              To Be Read
              {goalBooks.length > 0 && (
                <span style={{
                  backgroundColor: "#cd853f",
                  color: "#fefcf7",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  marginLeft: "auto"
                }}>
                  {goalBooks.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setCurrentPage("read"); setSidebarOpen(false); }}
              className={`sidebar-nav-btn ${currentPage === "read" ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "Georgia, serif",
                width: "100%",
                textAlign: "left",
                transition: "all 0.2s ease",
                backgroundColor: currentPage === "read" ? "#e8dcc0" : "transparent",
                color: currentPage === "read" ? "#3a2f1f" : "#5d4e37"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🏆</span>
              Finished
              {readBooks.length > 0 && (
                <span style={{
                  backgroundColor: "#cd853f",
                  color: "#fefcf7",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  marginLeft: "auto"
                }}>
                  {readBooks.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setCurrentPage("analytics"); setSidebarOpen(false); }}
              className={`sidebar-nav-btn ${currentPage === "analytics" ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "Georgia, serif",
                width: "100%",
                textAlign: "left",
                transition: "all 0.2s ease",
                backgroundColor: currentPage === "analytics" ? "#e8dcc0" : "transparent",
                color: currentPage === "analytics" ? "#3a2f1f" : "#5d4e37"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>📊</span>
              Reading Analytics
            </button>

            <button
              onClick={() => { setCurrentPage("data"); setSidebarOpen(false); }}
              className={`sidebar-nav-btn ${currentPage === "data" ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontFamily: "Georgia, serif",
                width: "100%",
                textAlign: "left",
                transition: "all 0.2s ease",
                backgroundColor: currentPage === "data" ? "#e8dcc0" : "transparent",
                color: currentPage === "data" ? "#3a2f1f" : "#5d4e37"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>💾</span>
              Data Management
            </button>
          </div>

          {/* Quick Stats */}
          <div style={{
            marginTop: "auto",
            paddingTop: "20px",
            borderTop: "1px solid #e8dcc0"
          }}>
            <h3 style={{
              fontSize: "1rem",
              fontWeight: "600",
              color: "#3a2f1f",
              margin: "0 0 12px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "1rem" }}>📈</span>
              Quick Stats
            </h3>
            <div style={{ fontSize: "0.9rem", color: "#5d4e37" }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "6px" 
              }}>
                <span>Books this month:</span>
                <span style={{ fontWeight: "600" }}>{stats.booksThisMonth}</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginBottom: "6px" 
              }}>
                <span>Reading streak:</span>
                <span style={{ fontWeight: "600" }}>{stats.streak} days</span>
              </div>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between" 
              }}>
                <span>Total read:</span>
                <span style={{ fontWeight: "600" }}>{stats.totalBooksRead}</span>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Toggle button for desktop */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 1001,
            backgroundColor: "#cd853f",
            color: "#fefcf7",
            border: "none",
            borderRadius: "8px",
            padding: "12px 16px",
            cursor: "pointer",
            fontSize: "1rem",
            fontFamily: "Georgia, serif",
            boxShadow: "0 4px 12px rgba(139, 69, 19, 0.3)"
          }}
        >
          ☰ Menu
        </button>
      )}
    </>
  );
}

export default Sidebar;