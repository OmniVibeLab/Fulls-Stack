// src/pages/Search.jsx
import React, { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";

const Search = () => {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Abhaya",
    "Luna",
    "ReactJS",
    "TailwindCSS",
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches([query.trim(), ...recentSearches].slice(0, 5)); // keep last 5
    }
    setQuery("");
  };

  const handleRemoveRecent = (item) => {
    setRecentSearches(recentSearches.filter((r) => r !== item));
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm mb-6"
      >
        <SearchIcon size={20} className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent focus:outline-none text-gray-800"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button type="button" onClick={() => setQuery("")}>
            <X size={18} className="text-gray-500" />
          </button>
        )}
      </form> 

      {/* Recent Searches */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Recent Searches</h2>
        {recentSearches.length === 0 && (
          <p className="text-gray-500">No recent searches.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {recentSearches.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-800"
            >
              <span>{item}</span>
              <button
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => handleRemoveRecent(item)}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search Results */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Results for "{query}"</h2>
        {/* You can map your actual search results here */}
        {query && <p className="text-gray-500">No results found.</p>}
      </div>
    </div>
  );
};

export default Search;
