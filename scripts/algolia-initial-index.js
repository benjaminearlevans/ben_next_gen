const { exec } = require('child_process');
const { promisify } = require('util');
const algoliasearch = require('algoliasearch');

const execAsync = promisify(exec);

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://137.184.85.3';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '_wkaWodWWha8H1Q5txNZnCrhAKLYRPuj';
const ALGOLIA_APP_ID = process.env.ALGOLIA_APPLICATION_ID || '7FCY2ACTWV';
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY || '267a038f5e25f5a39133fefaf908b181';

// Initialize Algolia client
const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

// Collection configurations matching the Directus hook
const INDEXED_COLLECTIONS = {
  post: {
    index: 'posts',
    fields: ['id', 'title', 'slug', 'excerpt', 'content', 'type', 'status', 'date_created', 'date_updated'],
    searchableAttributes: ['title', 'excerpt', 'content'],
    attributesForFaceting: ['type', 'status'],
    customRanking: ['desc(date_created)']
  },
  pages: {
    index: 'pages',
    fields: ['id', 'title', 'slug', 'meta_description', 'status', 'date_created', 'date_updated'],
    searchableAttributes: ['title', 'meta_description'],
    attributesForFaceting: ['status'],
    customRanking: ['desc(date_updated)']
  },
  speaking: {
    index: 'speaking',
    fields: ['id', 'title', 'event_name', 'description', 'type', 'status', 'date'],
    searchableAttributes: ['title', 'event_name', 'description'],
    attributesForFaceting: ['type', 'status'],
    customRanking: ['desc(date)']
  }
};

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

  // Add block type for block collections
  if (config.type) {
    indexItem.block_type = config.type;
  }

  // Add URL for frontend linking
  if (collection === 'posts' && item.slug) {
    indexItem.url = `/blog/${item.slug}`;
  } else if (collection === 'pages' && item.slug) {
    indexItem.url = `/${item.slug}`;
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
    const url = `${DIRECTUS_URL}/items/${collection}?fields=${fieldsQuery}&filter[status][_eq]=published&limit=-1`;
    
    const result = await execAsync(`curl -s -X GET "${url}" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
    
    const data = JSON.parse(result.stdout);
    
    if (data.errors) {
      console.error(`❌ Error fetching ${collection}:`, data.errors[0].message);
      // Try without status filter if it fails
      console.log(`🔄 Retrying ${collection} without status filter...`);
      const fallbackUrl = `${DIRECTUS_URL}/items/${collection}?fields=${fieldsQuery}&limit=-1`;
      const fallbackResult = await execAsync(`curl -s -X GET "${fallbackUrl}" \
        -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
      
      const fallbackData = JSON.parse(fallbackResult.stdout);
      if (fallbackData.errors) {
        return [];
      }
      
      // Filter published items manually
      const allItems = fallbackData.data || [];
      return allItems.filter(item => item.status === 'published');
    }
    
    return data.data || [];
  } catch (error) {
    console.error(`❌ Failed to fetch ${collection}:`, error.message);
    return [];
  }
}

// Index a single collection
async function indexCollection(collection, config) {
  console.log(`🔄 Indexing collection: ${collection}`);
  
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
    const existingObjects = await index.search('', {
      filters: `collection:${collection}`,
      hitsPerPage: 1000
    });
    
    if (existingObjects.hits.length > 0) {
      const objectIDsToDelete = existingObjects.hits.map(hit => hit.objectID);
      await index.deleteObjects(objectIDsToDelete);
      console.log(`🗑️  Removed ${objectIDsToDelete.length} existing ${collection} items from ${indexName}`);
    }
    
    // Batch save to Algolia
    await index.saveObjects(indexItems);
    console.log(`✅ Indexed ${items.length} items from ${collection} to ${indexName}`);
    
  } catch (error) {
    console.error(`❌ Failed to index ${collection}:`, error);
  }
}

// Main function to index all collections
async function indexAllCollections() {
  console.log('🚀 Starting Algolia initial indexing...');
  console.log('=====================================\n');
  
  // Test Algolia connection
  try {
    await client.listIndices();
    console.log('✅ Algolia connection successful\n');
  } catch (error) {
    console.error('❌ Algolia connection failed:', error.message);
    process.exit(1);
  }
  
  // Test Directus connection
  try {
    const result = await execAsync(`curl -s -X GET "${DIRECTUS_URL}/server/info" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
    const data = JSON.parse(result.stdout);
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    console.log('✅ Directus connection successful\n');
  } catch (error) {
    console.error('❌ Directus connection failed:', error.message);
    process.exit(1);
  }
  
  // Index each collection
  for (const [collection, config] of Object.entries(INDEXED_COLLECTIONS)) {
    await indexCollection(collection, config);
    console.log(''); // Add spacing between collections
  }
  
  console.log('✨ Initial Algolia indexing completed!');
  console.log('\n📋 Next steps:');
  console.log('1. Install the Directus hook in your Directus instance');
  console.log('2. Test search functionality on your Gatsby site');
  console.log('3. Add SearchButton component to your navigation');
  console.log('4. Configure GitHub secrets for deployment');
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

module.exports = { indexAllCollections, indexCollection };
