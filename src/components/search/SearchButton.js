import React, { useState } from 'react';
import { Search } from 'lucide-react';
import SearchModal from './SearchModal';

const SearchButton = ({ className = '' }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSearchOpen(true)}
        className={`inline-flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors ${className}`}
        aria-label="Open search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded border">
          ⌘K
        </kbd>
      </button>
      
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
};

export default SearchButton;
