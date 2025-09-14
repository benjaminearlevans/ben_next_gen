const algoliasearch = require('algoliasearch');

// Initialize Algolia client
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID || '7FCY2ACTWV',
  process.env.ALGOLIA_ADMIN_API_KEY || '267a038f5e25f5a39133fefaf908b181'
);

// Define which collections to index and their configurations
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

// Helper function to extract text content from HTML
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

// Helper function to configure index settings
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

// Main indexing function
async function indexItem(collection, item, operation = 'save') {
  const config = INDEXED_COLLECTIONS[collection];
  if (!config) return; // Skip collections we don't want to index

  const indexName = config.index;
  const index = client.initIndex(indexName);

  try {
    if (operation === 'delete') {
      await index.deleteObject(`${collection}_${item.id}`);
      console.log(`🗑️  Deleted from Algolia: ${collection}/${item.id}`);
    } else {
      // Only index published items (if status field exists)
      if (item.status && item.status !== 'published') {
        // If item is not published, remove it from index if it exists
        try {
          await index.deleteObject(`${collection}_${item.id}`);
          console.log(`🔒 Removed unpublished item from Algolia: ${collection}/${item.id}`);
        } catch (error) {
          // Object might not exist in index, which is fine
        }
        return;
      }

      const indexItem = prepareItemForIndexing(collection, item, config);
      await index.saveObject(indexItem);
      console.log(`💾 Indexed to Algolia: ${collection}/${item.id} → ${indexName}`);
    }
  } catch (error) {
    console.error(`❌ Algolia indexing failed for ${collection}/${item.id}:`, error);
  }
}

// Bulk indexing function for initial setup
async function bulkIndexCollection(database, collection) {
  const config = INDEXED_COLLECTIONS[collection];
  if (!config) return;

  console.log(`🔄 Bulk indexing collection: ${collection}`);
  
  try {
    // Fetch all published items from the collection
    const query = database(collection);
    if (config.fields.includes('status')) {
      query.where('status', 'published');
    }
    
    const items = await query.select(config.fields);
    
    if (items.length === 0) {
      console.log(`📭 No items found in ${collection}`);
      return;
    }

    const indexName = config.index;
    const index = client.initIndex(indexName);
    
    // Configure index settings
    await configureIndexSettings(indexName, config);
    
    // Prepare items for indexing
    const indexItems = items.map(item => prepareItemForIndexing(collection, item, config));
    
    // Batch save to Algolia
    await index.saveObjects(indexItems);
    console.log(`✅ Bulk indexed ${items.length} items from ${collection} to ${indexName}`);
    
  } catch (error) {
    console.error(`❌ Bulk indexing failed for ${collection}:`, error);
  }
}

// Export the hook functions
module.exports = function registerHook({ database, logger }) {
  console.log('🔍 Registering Algolia sync hooks...');

  // Register hooks for each indexed collection
  Object.keys(INDEXED_COLLECTIONS).forEach(collection => {
    // Hook for item creation and updates
    database.on(`items.create.${collection}`, async (input) => {
      await indexItem(collection, input, 'save');
    });

    database.on(`items.update.${collection}`, async (input) => {
      await indexItem(collection, input, 'save');
    });

    // Hook for item deletion
    database.on(`items.delete.${collection}`, async (input) => {
      // input might be an array of IDs for bulk delete
      const ids = Array.isArray(input) ? input : [input];
      for (const id of ids) {
        await indexItem(collection, { id }, 'delete');
      }
    });
  });

  // Provide bulk indexing function for initial setup
  return {
    bulkIndexAllCollections: async () => {
      console.log('🚀 Starting bulk indexing of all collections...');
      
      for (const collection of Object.keys(INDEXED_COLLECTIONS)) {
        await bulkIndexCollection(database, collection);
      }
      
      console.log('✨ Bulk indexing completed!');
    }
  };
};

// Export utility functions for manual use
module.exports.indexItem = indexItem;
module.exports.bulkIndexCollection = bulkIndexCollection;
module.exports.INDEXED_COLLECTIONS = INDEXED_COLLECTIONS;
