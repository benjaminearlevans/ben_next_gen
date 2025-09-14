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

// Collections to exclude from indexing
const EXCLUDED_COLLECTIONS = [
  'directus_access', 'directus_activity', 'directus_collections', 'directus_comments',
  'directus_fields', 'directus_files', 'directus_folders', 'directus_migrations',
  'directus_permissions', 'directus_policies', 'directus_presets', 'directus_relations',
  'directus_revisions', 'directus_roles', 'directus_sessions', 'directus_settings',
  'directus_users', 'directus_webhooks', 'directus_dashboards', 'directus_panels',
  'directus_notifications', 'directus_shares', 'directus_flows', 'directus_operations',
  'directus_translations', 'directus_versions', 'directus_extensions',
  'post_tags', 'junctions' // Junction tables and system collections
];

// Field types that are good for search
const SEARCHABLE_FIELD_TYPES = [
  'string', 'text', 'uuid', 'hash', 'json'
];

// Field types that are good for faceting
const FACETABLE_FIELD_TYPES = [
  'string', 'uuid', 'boolean', 'integer', 'float', 'decimal'
];

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

// Discover all collections in Directus
async function discoverCollections() {
  try {
    console.log('🔍 Discovering Directus collections...');
    const data = await makeRequest(`${DIRECTUS_URL}/collections`);
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    const collections = data.data
      .filter(collection => !EXCLUDED_COLLECTIONS.includes(collection.collection))
      .filter(collection => !collection.collection.startsWith('directus_'))
      .map(collection => ({
        name: collection.collection,
        note: collection.meta?.note || '',
        hidden: collection.meta?.hidden || false
      }))
      .filter(collection => !collection.hidden);
    
    console.log(`📋 Found ${collections.length} indexable collections:`);
    collections.forEach(col => {
      console.log(`   - ${col.name}${col.note ? ` (${col.note})` : ''}`);
    });
    
    return collections;
  } catch (error) {
    console.error('❌ Failed to discover collections:', error.message);
    return [];
  }
}

// Get field information for a collection
async function getCollectionFields(collectionName) {
  try {
    const data = await makeRequest(`${DIRECTUS_URL}/fields/${collectionName}`);
    
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    const fields = data.data.map(field => ({
      field: field.field,
      type: field.type,
      meta: field.meta || {}
    }));
    
    // Categorize fields
    const searchableFields = fields
      .filter(f => SEARCHABLE_FIELD_TYPES.includes(f.type))
      .filter(f => !f.meta.hidden)
      .filter(f => ['title', 'name', 'headline', 'content', 'excerpt', 'description', 'event_name'].some(keyword => 
        f.field.toLowerCase().includes(keyword)
      ))
      .map(f => f.field);
    
    const facetableFields = fields
      .filter(f => FACETABLE_FIELD_TYPES.includes(f.type))
      .filter(f => !f.meta.hidden)
      .filter(f => ['status', 'type', 'category', 'tag'].some(keyword => 
        f.field.toLowerCase().includes(keyword)
      ))
      .map(f => f.field);
    
    // Always include these core fields if they exist
    const coreFields = ['id', 'title', 'name', 'slug', 'status', 'date_created', 'date_updated'];
    const availableFields = fields.map(f => f.field);
    const indexFields = [...new Set([
      ...coreFields.filter(field => availableFields.includes(field)),
      ...searchableFields,
      ...facetableFields
    ])];
    
    return {
      allFields: availableFields,
      indexFields,
      searchableFields,
      facetableFields
    };
  } catch (error) {
    console.error(`❌ Failed to get fields for ${collectionName}:`, error.message);
    return {
      allFields: [],
      indexFields: ['id'],
      searchableFields: [],
      facetableFields: []
    };
  }
}

// Generate collection configuration dynamically
async function generateCollectionConfig(collection) {
  const fields = await getCollectionFields(collection.name);
  
  // Determine index name and ranking
  let indexName = collection.name;
  let customRanking = [];
  
  if (fields.allFields.includes('date_created')) {
    customRanking.push('desc(date_created)');
  } else if (fields.allFields.includes('date_updated')) {
    customRanking.push('desc(date_updated)');
  } else if (fields.allFields.includes('date')) {
    customRanking.push('desc(date)');
  }
  
  // Map certain collections to consolidated indices
  if (collection.name.startsWith('block_')) {
    indexName = 'blocks';
  } else if (collection.name === 'post') {
    indexName = 'posts';
  }
  
  return {
    index: indexName,
    fields: fields.indexFields,
    searchableAttributes: fields.searchableFields,
    attributesForFaceting: fields.facetableFields,
    customRanking,
    blockType: collection.name.startsWith('block_') ? collection.name.replace('block_', '') : undefined
  };
}

// Helper functions
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
}

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

  // Generate URLs
  if (collection === 'post' && item.slug) {
    indexItem.url = `/blog/${item.slug}`;
  } else if (collection === 'pages' && item.slug) {
    indexItem.url = `/${item.slug}`;
  } else if (collection === 'speaking') {
    indexItem.url = '/speaking';
  }

  return indexItem;
}

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

async function fetchCollectionData(collection, fields) {
  try {
    const fieldsQuery = fields.join(',');
    const url = `${DIRECTUS_URL}/items/${collection}?fields=${fieldsQuery}&limit=-1`;
    
    const data = await makeRequest(url);
    
    if (data.errors) {
      console.error(`❌ Error fetching ${collection}:`, data.errors[0].message);
      return [];
    }
    
    const allItems = data.data || [];
    // Filter published items if status field exists
    const publishedItems = allItems.filter(item => 
      !item.hasOwnProperty('status') || item.status === 'published'
    );
    
    return publishedItems;
    
  } catch (error) {
    console.error(`❌ Failed to fetch ${collection}:`, error.message);
    return [];
  }
}

async function indexCollection(collection, config) {
  console.log(`\n🔄 Indexing collection: ${collection}`);
  
  try {
    const items = await fetchCollectionData(collection, config.fields);
    
    if (items.length === 0) {
      console.log(`📭 No items found in ${collection}`);
      return;
    }

    const indexName = config.index;
    const index = client.initIndex(indexName);
    
    await configureIndexSettings(indexName, config);
    
    const indexItems = items.map(item => prepareItemForIndexing(collection, item, config));
    
    // Clear existing items for this collection
    try {
      const existingObjects = await index.search('', {
        filters: `collection:${collection}`,
        hitsPerPage: 1000
      });
      
      if (existingObjects.hits.length > 0) {
        const objectIDsToDelete = existingObjects.hits.map(hit => hit.objectID);
        await index.deleteObjects(objectIDsToDelete);
        console.log(`🗑️  Removed ${objectIDsToDelete.length} existing ${collection} items`);
      }
    } catch (error) {
      console.log(`ℹ️  No existing items to remove from ${indexName}`);
    }
    
    await index.saveObjects(indexItems);
    console.log(`✅ Indexed ${items.length} items from ${collection} to ${indexName}`);
    
  } catch (error) {
    console.error(`❌ Failed to index ${collection}:`, error);
  }
}

// Main function
async function dynamicIndexAllCollections() {
  console.log('🚀 Starting Dynamic Algolia Indexing...');
  console.log('========================================\n');
  
  // Test connections
  try {
    await client.listIndices();
    console.log('✅ Algolia connection successful');
  } catch (error) {
    console.error('❌ Algolia connection failed:', error.message);
    process.exit(1);
  }
  
  try {
    const data = await makeRequest(`${DIRECTUS_URL}/server/info`);
    if (data.errors) throw new Error(data.errors[0].message);
    console.log('✅ Directus connection successful\n');
  } catch (error) {
    console.error('❌ Directus connection failed:', error.message);
    process.exit(1);
  }
  
  // Discover and index collections
  const collections = await discoverCollections();
  
  if (collections.length === 0) {
    console.log('❌ No collections found to index');
    return;
  }
  
  for (const collection of collections) {
    const config = await generateCollectionConfig(collection);
    await indexCollection(collection.name, config);
  }
  
  console.log('\n✨ Dynamic Algolia indexing completed!');
  console.log('\n📊 Summary:');
  console.log(`   - Discovered ${collections.length} collections automatically`);
  console.log('   - Generated search configurations dynamically');
  console.log('   - No hardcoded collection names required');
}

// Run the script
if (require.main === module) {
  dynamicIndexAllCollections()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Dynamic indexing failed:', error.message);
      process.exit(1);
    });
}

module.exports = { 
  dynamicIndexAllCollections,
  discoverCollections,
  generateCollectionConfig,
  EXCLUDED_COLLECTIONS
};
