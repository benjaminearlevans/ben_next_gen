import React from 'react';
import { usePagination } from 'react-instantsearch-hooks-web';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SearchPagination = ({ className = '' }) => {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination();

  if (nbPages <= 1) {
    return null;
  }

  const firstPageIndex = 0;
  const previousPageIndex = currentRefinement - 1;
  const nextPageIndex = currentRefinement + 1;
  const lastPageIndex = nbPages - 1;

  return (
    <nav className={`flex items-center justify-between ${className}`} aria-label="Search pagination">
      <div className="flex-1 flex justify-between sm:hidden">
        {!isFirstPage && (
          <button
            onClick={() => refine(previousPageIndex)}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
        )}
        {!isLastPage && (
          <button
            onClick={() => refine(nextPageIndex)}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        )}
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentRefinement + 1}</span> of{' '}
            <span className="font-medium">{nbPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {!isFirstPage && (
              <button
                onClick={() => refine(previousPageIndex)}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
            
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => refine(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentRefinement
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page + 1}
              </button>
            ))}
            
            {!isLastPage && (
              <button
                onClick={() => refine(nextPageIndex)}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default SearchPagination;
