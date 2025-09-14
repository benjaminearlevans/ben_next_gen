import React from 'react';
import { useRefinementList, useClearRefinements } from 'react-instantsearch-hooks-web';
import { Filter, X } from 'lucide-react';

const RefinementList = ({ attribute, title, limit = 10 }) => {
  const {
    items,
    refine,
    searchForItems,
    isFromSearch,
    canRefine,
  } = useRefinementList({
    attribute,
    limit,
    searchable: true,
  });

  if (!canRefine || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={item.isRefined}
              onChange={() => refine(item.value)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              {item.label}
              <span className="text-gray-400 ml-1">({item.count})</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const SearchFilters = ({ className = '' }) => {
  const { refine: clearRefinements, canRefine } = useClearRefinements();

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filters
        </h2>
        {canRefine && (
          <button
            onClick={clearRefinements}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      <RefinementList attribute="collection" title="Content Type" />
      <RefinementList attribute="type" title="Type" />
      <RefinementList attribute="status" title="Status" />
      <RefinementList attribute="block_type" title="Block Type" />
    </div>
  );
};

export default SearchFilters;
