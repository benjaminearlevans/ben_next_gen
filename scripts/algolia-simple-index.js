const algoliasearch = require('algoliasearch');
const https = require('https');
const http = require('http');

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://137.184.85.3';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '_wkaWodWWha8H1Q5txNZnCrhAKLYRPuj';
const ALGOLIA_APP_ID = process.env.ALGOLIA_APPLICATION_ID || '7FCY2ACTWV';
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY || '267a038f5e25f5a39133fefaf908b181';

// Initialize Algolia client
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

// Collection configurations
const INDEXED_COLLECTIONS = {
  post: {
    index: 'posts',
    fields: ['id', 'title', 'slug', 'excerpt', 'content', 'type', 'status', 'date_created', 'date_updated'],
    searchableAttributes: ['title', 'excerpt', 'content'],
    attributesForFaceting: ['type', 'status'],
    customRanking: ['desc(date_created)']
  },
  speaking: {
    index: 'speaking',
    fields: ['id', 'title', 'event_name', 'description', 'type', 'status', 'date_created'],
    searchableAttributes: ['title', 'event_name', 'description'],
    attributesForFaceting: ['type', 'status'],
    customRanking: ['desc(date_created)']
  }
};

// Helper function to make HTTP requests
function makeRequest(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const requestModule = url.startsWith('https:') ? https : http;
    
    const options = {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
        ...headers
      }
    };

    requestModule.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Helper function to strip HTML
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

// Helper function to prepare item for indexing
function prepareItemForIndexing(collection, item, config) {
  const indexItem = {
    objectID: `${collection}_${item.id}`,
    collection: collection,
    ...config.fields.reduce((acc, field) => {
      if (item[field] !== undefined) {
        // Strip HTML from content fields
        if (field === 'content' && typeof item[field] === 'string') {
          acc[field] = stripHtml(item[field]);
        } else {
          acc[field] = item[field];
        }
      }
      return acc;
    }, {})
  };

  // Add URL for frontend linking
  if (collection === 'post' && item.slug) {
    indexItem.url = `/blog/${item.slug}`;
  } else if (collection === 'speaking') {
    indexItem.url = '/speaking';
  }

  return indexItem;
}

// Configure index settings
async function configureIndexSettings(indexName, config) {
  const index = client.initIndex(indexName);
  
  const settings = {
    searchableAttributes: config.searchableAttributes || [],
    attributesForFaceting: config.attributesForFaceting || [],
    customRanking: config.customRanking || []
  };

  try {
    await index.setSettings(settings);
    console.log(`✅ Configured settings for index: ${indexName}`);
  } catch (error) {
    console.error(`❌ Failed to configure index ${indexName}:`, error);
  }
}

// Fetch data from Directus collection
async function fetchCollectionData(collection, fields) {
  try {
    const fieldsQuery = fields.join(',');
    const url = `${DIRECTUS_URL}/items/${collection}?fields=${fieldsQuery}&limit=-1`;
    
    console.log(`🔍 Fetching from: ${url}`);
    const data = await makeRequest(url);
    
    if (data.errors) {
      console.error(`❌ Error fetching ${collection}:`, data.errors[0].message);
      return [];
    }
    
    // Filter published items
    const allItems = data.data || [];
    const publishedItems = allItems.filter(item => item.status === 'published');
    
    console.log(`📊 Found ${allItems.length} total items, ${publishedItems.length} published`);
    return publishedItems;
    
  } catch (error) {
    console.error(`❌ Failed to fetch ${collection}:`, error.message);
    return [];
  }
}

// Index a single collection
async function indexCollection(collection, config) {
  console.log(`\n🔄 Indexing collection: ${collection}`);
  
  try {
    // Fetch data from Directus
    const items = await fetchCollectionData(collection, config.fields);
    
    if (items.length === 0) {
      console.log(`📭 No published items found in ${collection}`);
      return;
    }

    const indexName = config.index;
    const index = client.initIndex(indexName);
    
    // Configure index settings
    await configureIndexSettings(indexName, config);
    
    // Prepare items for indexing
    const indexItems = items.map(item => prepareItemForIndexing(collection, item, config));
    
    // Clear existing items for this collection from the index
    try {
      const existingObjects = await index.search('', {
        filters: `collection:${collection}`,
        hitsPerPage: 1000
      });
      
      if (existingObjects.hits.length > 0) {
        const objectIDsToDelete = existingObjects.hits.map(hit => hit.objectID);
        await index.deleteObjects(objectIDsToDelete);
        console.log(`🗑️  Removed ${objectIDsToDelete.length} existing ${collection} items from ${indexName}`);
      }
    } catch (error) {
      console.log(`ℹ️  No existing items to remove from ${indexName}`);
    }
    
    // Batch save to Algolia
    await index.saveObjects(indexItems);
    console.log(`✅ Indexed ${items.length} items from ${collection} to ${indexName}`);
    
  } catch (error) {
    console.error(`❌ Failed to index ${collection}:`, error);
  }
}

// Main function
async function indexAllCollections() {
  console.log('🚀 Starting Algolia indexing with Node.js HTTP client...');
  console.log('=====================================================\n');
  
  // Test Algolia connection
  try {
    await client.listIndices();
    console.log('✅ Algolia connection successful');
  } catch (error) {
    console.error('❌ Algolia connection failed:', error.message);
    process.exit(1);
  }
  
  // Test Directus connection
  try {
    const data = await makeRequest(`${DIRECTUS_URL}/server/info`);
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    console.log('✅ Directus connection successful');
  } catch (error) {
    console.error('❌ Directus connection failed:', error.message);
    process.exit(1);
  }
  
  // Index each collection
  for (const [collection, config] of Object.entries(INDEXED_COLLECTIONS)) {
    await indexCollection(collection, config);
  }
  
  console.log('\n✨ Algolia indexing completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Check your Algolia dashboard to verify indices are populated');
  console.log('2. Test search functionality on your Gatsby site');
  console.log('3. Install the Directus hook for automatic syncing');
}

// Run the script
if (require.main === module) {
  indexAllCollections()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Indexing failed:', error.message);
      process.exit(1);
    });
}

module.exports = { indexAllCollections };
