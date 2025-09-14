import React, { useState, useEffect } from 'react';
import { InstantSearch, Index } from 'react-instantsearch-hooks-web';
import { searchClient, SEARCH_INDICES } from '../../lib/algolia';
import SearchBox from './SearchBox';
import SearchHits from './SearchHits';
import SearchPagination from './SearchPagination';
import { X, Search as SearchIcon } from 'lucide-react';

const SearchModal = ({ isOpen, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchState, setSearchState] = useState({});

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center p-4 pt-16">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
          <InstantSearch
            searchClient={searchClient}
            indexName={SEARCH_INDICES[activeIndex].name}
            searchState={searchState}
            onSearchStateChange={setSearchState}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <SearchIcon className="h-6 w-6 text-gray-400" />
                <h2 className="text-lg font-semibold text-gray-900">Search</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close search"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search Box */}
            <div className="p-4 border-b border-gray-200">
              <SearchBox placeholder="Search posts, pages, speaking engagements..." />
            </div>

            {/* Index Tabs */}
            <div className="flex border-b border-gray-200">
              {SEARCH_INDICES.map((index, idx) => (
                <button
                  key={index.name}
                  onClick={() => setActiveIndex(idx)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeIndex === idx
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {index.title}
                </button>
              ))}
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              <Index indexName={SEARCH_INDICES[activeIndex].name}>
                <div className="p-4">
                  <SearchHits indexName={SEARCH_INDICES[activeIndex].name} />
                </div>
              </Index>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-gray-200">
              <Index indexName={SEARCH_INDICES[activeIndex].name}>
                <SearchPagination />
              </Index>
            </div>
          </InstantSearch>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
