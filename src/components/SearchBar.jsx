import { useState } from 'react';
function SearchBar() {
  const [query, setQuery] = useState('');
  const handlesearch = () => {
    console.log('Searching for:', query);
  };
  return (
    <div>
      <input
      type='text'
      placeholder='Search for books...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      />
        <button onClick={handlesearch}>Search</button>
    </div>
  );
}
export default SearchBar;