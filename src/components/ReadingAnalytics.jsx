import React from 'react';

function ReadingAnalytics({ readBooks, currentlyReading, goalBooks }) {
  // Calculate reading statistics
  const calculateReadingStats = () => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    
    // Books read this month
    const booksThisMonth = readBooks.filter(book => {
      const finishedDate = new Date(book.finishedDate);
      return finishedDate.getMonth() === thisMonth && finishedDate.getFullYear() === thisYear;
    }).length;

    // Total pages read this month
    const pagesThisMonth = readBooks
      .filter(book => {
        const finishedDate = new Date(book.finishedDate);
        return finishedDate.getMonth() === thisMonth && finishedDate.getFullYear() === thisYear;
      })
      .reduce((total, book) => total + book.pages, 0);

    // Reading streak (simplified - mock data for now)
    const streak = 7;

    // Average pages per day
    const avgPagesPerDay = Math.round(pagesThisMonth / new Date().getDate()) || 0;

    // Genre diversity
    const genres = [...new Set(readBooks.map(book => book.genre))];
    const genreCount = genres.length;

    // Monthly goal progress (assuming goal of 5 books per month)
    const monthlyGoal = 5;
    const goalProgress = Math.min((booksThisMonth / monthlyGoal) * 100, 100);

    return {
      booksThisMonth,
      pagesThisMonth,
      streak,
      avgPagesPerDay,
      genreCount,
      totalBooksRead: readBooks.length,
      monthlyGoal,
      goalProgress,
      genres
    };
  };

  const stats = calculateReadingStats();

  const StatCard = ({ icon, title, value, color, bgColor }) => (
    <div style={{
      backgroundColor: bgColor || "#fefcf7",
      border: "1px solid #e8dcc0",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)",
      transition: "transform 0.2s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ 
          fontSize: "2rem",
          color: color || "#cd853f"
        }}>
          {icon}
        </div>
        <div>
          <p style={{ 
            fontSize: "0.9rem", 
            color: color || "#5d4e37", 
            margin: "0 0 4px 0",
            fontWeight: "500"
          }}>
            {title}
          </p>
          <p style={{ 
            fontSize: "1.8rem", 
            fontWeight: "700", 
            color: "#3a2f1f",
            margin: 0 
          }}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "12px", 
        marginBottom: "30px",
        textAlign: "center",
        justifyContent: "center"
      }}>
        <span style={{ fontSize: "2rem" }}>📊</span>
        <h2 style={{ 
          fontSize: "2.5rem", 
          fontWeight: "700", 
          color: "#3a2f1f",
          margin: 0
        }}>
          Reading Analytics
        </h2>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        <StatCard 
          icon="📚" 
          title="Books This Month" 
          value={stats.booksThisMonth}
          color="#2563eb"
          bgColor="#eff6ff"
        />
        <StatCard 
          icon="📅" 
          title="Reading Streak" 
          value={`${stats.streak} days`}
          color="#059669"
          bgColor="#f0fdf4"
        />
        <StatCard 
          icon="📖" 
          title="Pages This Month" 
          value={stats.pagesThisMonth}
          color="#7c3aed"
          bgColor="#faf5ff"
        />
        <StatCard 
          icon="⚡" 
          title="Avg Pages/Day" 
          value={stats.avgPagesPerDay}
          color="#ea580c"
          bgColor="#fff7ed"
        />
      </div>

      {/* Reading Progress */}
      <div style={{
        backgroundColor: "#fefcf7",
        border: "1px solid #e8dcc0",
        borderRadius: "12px",
        padding: "24px",
        marginBottom: "20px",
        boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)"
      }}>
        <h3 style={{ 
          fontSize: "1.3rem", 
          fontWeight: "600", 
          color: "#3a2f1f", 
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          🎯 Monthly Reading Goal
        </h3>
        <div style={{ marginBottom: "8px" }}>
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            fontSize: "0.9rem", 
            color: "#5d4e37" 
          }}>
            <span>Progress: {stats.booksThisMonth}/{stats.monthlyGoal} books</span>
            <span>{Math.round(stats.goalProgress)}%</span>
          </div>
        </div>
        <div style={{
          width: "100%",
          backgroundColor: "#f0ebe0",
          borderRadius: "8px",
          height: "12px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${stats.goalProgress}%`,
            background: "linear-gradient(90deg, #cd853f, #daa520)",
            height: "12px",
            borderRadius: "8px",
            transition: "width 0.5s ease"
          }}></div>
        </div>
        <p style={{ 
          fontSize: "0.8rem", 
          color: "#6b5b3d", 
          marginTop: "8px",
          margin: "8px 0 0 0"
        }}>
          {stats.goalProgress >= 100 ? "🎉 Goal achieved! Great job!" : 
           stats.goalProgress >= 80 ? "🔥 Almost there! Keep it up!" :
           "📈 You're making progress!"}
        </p>
      </div>

      {/* Two Column Layout for remaining sections */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px",
        marginBottom: "20px"
      }}>
        {/* Genre Diversity */}
        <div style={{
          backgroundColor: "#fefcf7",
          border: "1px solid #e8dcc0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)"
        }}>
          <h3 style={{ 
            fontSize: "1.3rem", 
            fontWeight: "600", 
            color: "#3a2f1f", 
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            🌈 Genre Diversity
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ 
              fontSize: "2.5rem", 
              fontWeight: "700", 
              color: "#cd853f" 
            }}>
              {stats.genreCount}
            </div>
            <div>
              <p style={{ color: "#3a2f1f", margin: "0 0 4px 0", fontWeight: "500" }}>
                Different genres explored
              </p>
              <p style={{ fontSize: "0.85rem", color: "#6b5b3d", margin: 0 }}>
                Keep exploring new genres!
              </p>
            </div>
          </div>
          {stats.genres.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <p style={{ fontSize: "0.85rem", color: "#5d4e37", marginBottom: "8px" }}>
                Genres read:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {stats.genres.map((genre, index) => (
                  <span 
                    key={index}
                    style={{
                      backgroundColor: "#f0ebe0",
                      color: "#5d4e37",
                      fontSize: "0.75rem",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      border: "1px solid #e8dcc0"
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Status */}
        <div style={{
          backgroundColor: "#fefcf7",
          border: "1px solid #e8dcc0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)"
        }}>
          <h3 style={{ 
            fontSize: "1.3rem", 
            fontWeight: "600", 
            color: "#3a2f1f", 
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            📋 Current Status
          </h3>
          <div style={{ fontSize: "0.9rem", color: "#5d4e37" }}>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "8px",
              padding: "8px 0",
              borderBottom: "1px solid #f0ebe0"
            }}>
              <span>📖 Currently Reading:</span>
              <span style={{ fontWeight: "600" }}>{currentlyReading.length}</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginBottom: "8px",
              padding: "8px 0",
              borderBottom: "1px solid #f0ebe0"
            }}>
              <span>🎯 To Be Read:</span>
              <span style={{ fontWeight: "600" }}>{goalBooks.length}</span>
            </div>
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              padding: "8px 0"
            }}>
              <span>🏆 Total Finished:</span>
              <span style={{ fontWeight: "600" }}>{stats.totalBooksRead}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        backgroundColor: "#fefcf7",
        border: "1px solid #e8dcc0",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)"
      }}>
        <h3 style={{ 
          fontSize: "1.3rem", 
          fontWeight: "600", 
          color: "#3a2f1f", 
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          🕒 Recent Activity
        </h3>
        {readBooks.length === 0 ? (
          <p style={{ color: "#6b5b3d", fontSize: "0.9rem", fontStyle: "italic" }}>
            No books finished yet. Start reading to see your progress here!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {readBooks.slice(-3).reverse().map((book, index) => (
              <div 
                key={book.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  backgroundColor: "#f9f6f0",
                  borderRadius: "8px",
                  border: "1px solid #f0ebe0"
                }}
              >
                <div style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#4ade80",
                  borderRadius: "50%"
                }}></div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    fontWeight: "600", 
                    color: "#3a2f1f", 
                    margin: "0 0 2px 0",
                    fontSize: "0.95rem"
                  }}>
                    {book.title}
                  </p>
                  <p style={{ 
                    fontSize: "0.8rem", 
                    color: "#6b5b3d",
                    margin: 0
                  }}>
                    by {book.author}
                  </p>
                </div>
                <div style={{ 
                  fontSize: "0.75rem", 
                  color: "#6b5b3d",
                  textAlign: "right"
                }}>
                  <div>Finished</div>
                  <div>{new Date(book.finishedDate).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Badges */}
      <div style={{
        backgroundColor: "#fefcf7",
        border: "1px solid #e8dcc0",
        borderRadius: "12px",
        padding: "24px",
        marginTop: "20px",
        boxShadow: "0 3px 8px rgba(139, 115, 85, 0.12)"
      }}>
        <h3 style={{ 
          fontSize: "1.3rem", 
          fontWeight: "600", 
          color: "#3a2f1f", 
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          🏅 Achievements
        </h3>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          {stats.totalBooksRead >= 1 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "0.85rem"
            }}>
              <span>🎯</span>
              <span>First Book Finished!</span>
            </div>
          )}
          {stats.totalBooksRead >= 5 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "0.85rem"
            }}>
              <span>📚</span>
              <span>Bookworm (5+ books)</span>
            </div>
          )}
          {stats.genreCount >= 3 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#faf5ff",
              border: "1px solid #e9d5ff",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "0.85rem"
            }}>
              <span>🌈</span>
              <span>Genre Explorer</span>
            </div>
          )}
          {stats.streak >= 7 && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "0.85rem"
            }}>
              <span>🔥</span>
              <span>Week Streak</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReadingAnalytics;