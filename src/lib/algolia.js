import algoliasearch from 'algoliasearch/lite';

// Initialize Algolia client
export const searchClient = algoliasearch(
  process.env.GATSBY_ALGOLIA_APP_ID || '7FCY2ACTWV',
  process.env.GATSBY_ALGOLIA_SEARCH_KEY || 'ccf6379fbe3e02970cd36f6152d7910a'
);

// Define search indices
export const SEARCH_INDICES = [
  {
    name: 'posts',
    title: 'Blog Posts',
    hitComponent: 'PostHit',
  },
  {
    name: 'pages',
    title: 'Pages',
    hitComponent: 'PageHit',
  },
  {
    name: 'speaking',
    title: 'Speaking',
    hitComponent: 'SpeakingHit',
  },
  {
    name: 'blocks',
    title: 'Content',
    hitComponent: 'BlockHit',
  },
];

// Search configuration
export const SEARCH_CONFIG = {
  hitsPerPage: 10,
  attributesToSnippet: ['content:20', 'excerpt:20', 'description:20'],
  snippetEllipsisText: '…',
  highlightPreTag: '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">',
  highlightPostTag: '</mark>',
};

// Helper function to get search state from URL
export const createURL = (state) => {
  const isDefaultRoute = !state.query && state.page === 1 && !state.refinementList;
  
  if (isDefaultRoute) {
    return '';
  }

  const queryParameters = {};

  if (state.query) {
    queryParameters.query = encodeURIComponent(state.query);
  }

  if (state.page !== 1) {
    queryParameters.page = state.page;
  }

  if (state.refinementList) {
    Object.keys(state.refinementList).forEach(key => {
      queryParameters[key] = state.refinementList[key].map(encodeURIComponent);
    });
  }

  const queryString = Object.keys(queryParameters)
    .map(key => {
      const value = queryParameters[key];
      if (Array.isArray(value)) {
        return `${key}=${value.join('&' + key + '=')}`;
      }
      return `${key}=${value}`;
    })
    .join('&');

  return queryString ? `?${queryString}` : '';
};

// Helper function to get search state from URL
export const searchStateToUrl = (searchState) => {
  return searchState ? createURL(searchState) : '';
};

// Helper function to get URL state from search
export const urlToSearchState = (location) => {
  if (!location.search) {
    return {};
  }

  const searchParams = new URLSearchParams(location.search);
  const searchState = {};

  if (searchParams.get('query')) {
    searchState.query = decodeURIComponent(searchParams.get('query'));
  }

  if (searchParams.get('page')) {
    searchState.page = parseInt(searchParams.get('page'), 10);
  }

  // Handle refinement lists
  const refinementList = {};
  for (const [key, value] of searchParams.entries()) {
    if (key !== 'query' && key !== 'page') {
      if (!refinementList[key]) {
        refinementList[key] = [];
      }
      refinementList[key].push(decodeURIComponent(value));
    }
  }

  if (Object.keys(refinementList).length > 0) {
    searchState.refinementList = refinementList;
  }

  return searchState;
};
