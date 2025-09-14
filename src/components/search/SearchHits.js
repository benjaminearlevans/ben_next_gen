import React from 'react';
import { useHits } from 'react-instantsearch-hooks-web';
import { Link } from 'gatsby';
import { Calendar, ExternalLink, FileText, MessageSquare } from 'lucide-react';

// Individual hit components for different content types
const PostHit = ({ hit }) => (
  <Link
    to={hit.url || `/blog/${hit.slug}`}
    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
  >
    <div className="flex items-start space-x-3">
      <FileText className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          <span dangerouslySetInnerHTML={{ __html: hit._highlightResult?.title?.value || hit.title }} />
        </h3>
        {hit._snippetResult?.excerpt?.value && (
          <p className="text-gray-600 text-sm mb-2">
            <span dangerouslySetInnerHTML={{ __html: hit._snippetResult.excerpt.value }} />
          </p>
        )}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(hit.date_created).toLocaleDateString()}
          </span>
          {hit.type && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
              {hit.type}
            </span>
          )}
        </div>
      </div>
    </div>
  </Link>
);

const PageHit = ({ hit }) => (
  <Link
    to={hit.url || `/${hit.slug}`}
    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
  >
    <div className="flex items-start space-x-3">
      <FileText className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          <span dangerouslySetInnerHTML={{ __html: hit._highlightResult?.title?.value || hit.title }} />
        </h3>
        {hit._snippetResult?.meta_description?.value && (
          <p className="text-gray-600 text-sm mb-2">
            <span dangerouslySetInnerHTML={{ __html: hit._snippetResult.meta_description.value }} />
          </p>
        )}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
            Page
          </span>
        </div>
      </div>
    </div>
  </Link>
);

const SpeakingHit = ({ hit }) => (
  <Link
    to={hit.url || '/speaking'}
    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
  >
    <div className="flex items-start space-x-3">
      <MessageSquare className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          <span dangerouslySetInnerHTML={{ __html: hit._highlightResult?.title?.value || hit.title }} />
        </h3>
        {hit.event_name && (
          <p className="text-sm text-gray-700 mb-1">
            <span dangerouslySetInnerHTML={{ __html: hit._highlightResult?.event_name?.value || hit.event_name }} />
          </p>
        )}
        {hit._snippetResult?.description?.value && (
          <p className="text-gray-600 text-sm mb-2">
            <span dangerouslySetInnerHTML={{ __html: hit._snippetResult.description.value }} />
          </p>
        )}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(hit.date).toLocaleDateString()}
          </span>
          {hit.type && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
              {hit.type}
            </span>
          )}
          {hit.video_url && (
            <span className="flex items-center text-blue-500">
              <ExternalLink className="h-3 w-3 mr-1" />
              Video
            </span>
          )}
        </div>
      </div>
    </div>
  </Link>
);

const BlockHit = ({ hit }) => (
  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
    <div className="flex items-start space-x-3">
      <div className="h-5 w-5 bg-gray-400 rounded mt-1 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        {hit.headline && (
          <h4 className="text-md font-medium text-gray-900 mb-1">
            <span dangerouslySetInnerHTML={{ __html: hit._highlightResult?.headline?.value || hit.headline }} />
          </h4>
        )}
        {hit._snippetResult?.content?.value && (
          <p className="text-gray-600 text-sm mb-2">
            <span dangerouslySetInnerHTML={{ __html: hit._snippetResult.content.value }} />
          </p>
        )}
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
            {hit.block_type} block
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Hit component selector
const HitComponent = ({ hit, index }) => {
  switch (index) {
    case 'posts':
      return <PostHit hit={hit} />;
    case 'pages':
      return <PageHit hit={hit} />;
    case 'speaking':
      return <SpeakingHit hit={hit} />;
    case 'blocks':
      return <BlockHit hit={hit} />;
    default:
      return <PostHit hit={hit} />;
  }
};

const SearchHits = ({ indexName, className = '' }) => {
  const { hits, results } = useHits();

  if (!results || results.nbHits === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No results found</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-sm text-gray-600 mb-4">
        {results.nbHits} result{results.nbHits !== 1 ? 's' : ''} found in {results.processingTimeMS}ms
      </div>
      {hits.map((hit) => (
        <HitComponent key={hit.objectID} hit={hit} index={indexName} />
      ))}
    </div>
  );
};

export default SearchHits;
