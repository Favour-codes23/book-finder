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
        onSubmit={handleSubmit} className='search-bar'>
      <input
      type='text'
      placeholder='Search for books...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className='search-input'
      />
        <button 
            type='submit'
            className='search-btn'
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
          >
         🔍 Search
        </button>
    </form>
  );
}
export default SearchBar;