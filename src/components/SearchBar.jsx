import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    };
  }
  
  return (
    <form 
        onSubmit={handleSubmit} 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          margin: '20px auto',
          gap: '10px' 
        }}
    >
      <input
      type='text'
      placeholder='Search for books...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      style={{ padding: '10px 15px', 
               fontSize: '16px',
               width: '300px',
               borderRadius: '25px', 
               border: '1px solid #ccc',
               outline: 'none',
               boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
              }}
      />
        <button 
            type='submit'
            style={{
               backgroundColor: '#007bff',
               color: 'white',
               border: 'none',
               borderRadius: '25px', 
               padding: '10px 20px',
               fontSize: '16px',
               cursor: 'pointer',
               transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
         🔍 Search
        </button>
    </form>
  );
}
export default SearchBar;