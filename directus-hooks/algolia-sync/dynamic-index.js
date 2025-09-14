const algoliasearch = require('algoliasearch');

// Initialize Algolia client
const client = algoliasearch(
  process.env.ALGOLIA_APPLICATION_ID || '7FCY2ACTWV',
  process.env.ALGOLIA_ADMIN_API_KEY || '267a038f5e25f5a39133fefaf908b181'
);

// Collections to exclude from indexing
const EXCLUDED_COLLECTIONS = [
  'directus_access', 'directus_activity', 'directus_collections', 'directus_comments',
  'directus_fields', 'directus_files', 'directus_folders', 'directus_migrations',
  'directus_permissions', 'directus_policies', 'directus_presets', 'directus_relations',
  'directus_revisions', 'directus_roles', 'directus_sessions', 'directus_settings',
  'directus_users', 'directus_webhooks', 'directus_dashboards', 'directus_panels',
  'directus_notifications', 'directus_shares', 'directus_flows', 'directus_operations',
  'directus_translations', 'directus_versions', 'directus_extensions',
  'post_tags', 'junctions' // Junction tables
];

// Field types that are good for search
const SEARCHABLE_FIELD_TYPES = [
  'string', 'text', 'uuid', 'hash', 'json'
];

// Field types that are good for faceting
const FACETABLE_FIELD_TYPES = [
  'string', 'uuid', 'boolean', 'integer', 'float', 'decimal'
];

// Cache for collection configurations
const collectionConfigCache = new Map();

// Helper function to strip HTML
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

// Get collection configuration dynamically
async function getCollectionConfig(database, collectionName) {
  // Check cache first
  if (collectionConfigCache.has(collectionName)) {
    return collectionConfigCache.get(collectionName);
  }

  // Skip excluded collections
  if (EXCLUDED_COLLECTIONS.includes(collectionName) || collectionName.startsWith('directus_')) {
    return null;
  }

  try {
    // Get collection fields
    const fields = await database('directus_fields')
      .where('collection', collectionName)
      .select('field', 'type', 'meta');

    if (fields.length === 0) {
      return null;
    }

    // Categorize fields
    const searchableFields = fields
      .filter(f => SEARCHABLE_FIELD_TYPES.includes(f.type))
      .filter(f => !f.meta?.hidden)
      .filter(f => ['title', 'name', 'headline', 'content', 'excerpt', 'description', 'event_name'].some(keyword => 
        f.field.toLowerCase().includes(keyword)
      ))
      .map(f => f.field);

    const facetableFields = fields
      .filter(f => FACETABLE_FIELD_TYPES.includes(f.type))
      .filter(f => !f.meta?.hidden)
      .filter(f => ['status', 'type', 'category', 'tag'].some(keyword => 
        f.field.toLowerCase().includes(keyword)
      ))
      .map(f => f.field);

    // Core fields
    const coreFields = ['id', 'title', 'name', 'slug', 'status', 'date_created', 'date_updated'];
    const availableFields = fields.map(f => f.field);
    const indexFields = [...new Set([
      ...coreFields.filter(field => availableFields.includes(field)),
      ...searchableFields,
      ...facetableFields
    ])];

    // Determine index name and ranking
    let indexName = collectionName;
    let customRanking = [];
    
    if (availableFields.includes('date_created')) {
      customRanking.push('desc(date_created)');
    } else if (availableFields.includes('date_updated')) {
      customRanking.push('desc(date_updated)');
    } else if (availableFields.includes('date')) {
      customRanking.push('desc(date)');
    }
    
    // Map certain collections to consolidated indices
    if (collectionName.startsWith('block_')) {
      indexName = 'blocks';
    } else if (collectionName === 'post') {
      indexName = 'posts';
    }

    const config = {
      index: indexName,
      fields: indexFields,
      searchableAttributes: searchableFields,
      attributesForFaceting: facetableFields,
      customRanking,
      blockType: collectionName.startsWith('block_') ? collectionName.replace('block_', '') : undefined
    };

    // Cache the configuration
    collectionConfigCache.set(collectionName, config);
    
    console.log(`📋 Generated config for ${collectionName}:`, {
      index: config.index,
      fields: config.fields.length,
      searchable: config.searchableAttributes.length,
      facetable: config.attributesForFaceting.length
    });

    return config;
  } catch (error) {
    console.error(`❌ Failed to get config for ${collectionName}:`, error);
    return null;
  }
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

// Prepare item for indexing
function prepareItemForIndexing(collection, item, config) {
  const indexItem = {
    objectID: `${collection}_${item.id}`,
    collection: collection,
    ...config.fields.reduce((acc, field) => {
      if (item[field] !== undefined) {
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
  if (config.blockType) {
    indexItem.block_type = config.blockType;
  }

  // Add URL for frontend linking
  if (collection === 'post' && item.slug) {
    indexItem.url = `/blog/${item.slug}`;
  } else if (collection === 'pages' && item.slug) {
    indexItem.url = `/${item.slug}`;
  } else if (collection === 'speaking') {
    indexItem.url = '/speaking';
  }

  return indexItem;
}

// Main indexing function
async function indexItem(database, collection, item, operation = 'save') {
  const config = await getCollectionConfig(database, collection);
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
  const config = await getCollectionConfig(database, collection);
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
  console.log('🔍 Registering Dynamic Algolia sync hooks...');

  // Hook for any collection item creation
  database.on('items.create', async (input, { collection }) => {
    await indexItem(database, collection, input, 'save');
  });

  // Hook for any collection item updates
  database.on('items.update', async (input, { collection }) => {
    await indexItem(database, collection, input, 'save');
  });

  // Hook for any collection item deletion
  database.on('items.delete', async (input, { collection }) => {
    // input might be an array of IDs for bulk delete
    const ids = Array.isArray(input) ? input : [input];
    for (const id of ids) {
      await indexItem(database, collection, { id }, 'delete');
    }
  });

  // Provide bulk indexing function for initial setup
  return {
    bulkIndexAllCollections: async () => {
      console.log('🚀 Starting dynamic bulk indexing of all collections...');
      
      // Get all collections
      const collections = await database('directus_collections')
        .whereNotIn('collection', EXCLUDED_COLLECTIONS)
        .whereNotLike('collection', 'directus_%')
        .select('collection');
      
      for (const { collection } of collections) {
        await bulkIndexCollection(database, collection);
      }
      
      console.log('✨ Dynamic bulk indexing completed!');
    },
    
    clearCache: () => {
      collectionConfigCache.clear();
      console.log('🗑️  Cleared collection config cache');
    }
  };
};

// Export utility functions for manual use
module.exports.indexItem = indexItem;
module.exports.bulkIndexCollection = bulkIndexCollection;
module.exports.getCollectionConfig = getCollectionConfig;
module.exports.EXCLUDED_COLLECTIONS = EXCLUDED_COLLECTIONS;
