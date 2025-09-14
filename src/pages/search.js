import React, { useState, useEffect } from 'react';
import { InstantSearch, Index } from 'react-instantsearch-hooks-web';
import { searchClient, SEARCH_INDICES, urlToSearchState, searchStateToUrl } from '../lib/algolia';
import SearchBox from '../components/search/SearchBox';
import SearchHits from '../components/search/SearchHits';
import SearchFilters from '../components/search/SearchFilters';
import SearchPagination from '../components/search/SearchPagination';
import { Search as SearchIcon } from 'lucide-react';

const SearchPage = ({ location }) => {
  const [searchState, setSearchState] = useState(() => urlToSearchState(location));
  const [activeIndex, setActiveIndex] = useState(0);

  // Update URL when search state changes
  useEffect(() => {
    const url = searchStateToUrl(searchState);
    if (typeof window !== 'undefined' && window.history) {
      window.history.replaceState({}, '', `/search${url}`);
    }
  }, [searchState]);

  // Update search state when URL changes
  useEffect(() => {
    setSearchState(urlToSearchState(location));
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <SearchIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Search</h1>
          </div>
          <p className="text-gray-600">
            Search across all content including blog posts, pages, speaking engagements, and more.
          </p>
        </div>

        <InstantSearch
          searchClient={searchClient}
          indexName={SEARCH_INDICES[activeIndex].name}
          searchState={searchState}
          onSearchStateChange={setSearchState}
        >
          {/* Search Box */}
          <div className="mb-8">
            <SearchBox 
              placeholder="Search posts, pages, speaking engagements..." 
              className="max-w-2xl"
            />
          </div>

          {/* Index Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {SEARCH_INDICES.map((index, idx) => (
                  <button
                    key={index.name}
                    onClick={() => setActiveIndex(idx)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeIndex === idx
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {index.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Index indexName={SEARCH_INDICES[activeIndex].name}>
                <SearchFilters />
              </Index>
            </div>

            {/* Results */}
            <div className="lg:col-span-3">
              <Index indexName={SEARCH_INDICES[activeIndex].name}>
                <SearchHits indexName={SEARCH_INDICES[activeIndex].name} />
                <div className="mt-8">
                  <SearchPagination />
                </div>
              </Index>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
};

export default SearchPage;

export const Head = () => (
  <>
    <title>Search - Benjamin Carlson</title>
    <meta name="description" content="Search across all content including blog posts, pages, speaking engagements, and more." />
    <meta name="robots" content="noindex" />
  </>
);
