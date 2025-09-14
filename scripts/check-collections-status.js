const axios = require('axios');

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://137.184.85.3';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '_wkaWodWWha8H1Q5txNZnCrhAKLYRPuj';

const api = axios.create({
  baseURL: `${DIRECTUS_URL}`,
  headers: {
    'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function checkCollections() {
  try {
    console.log('🔍 Checking existing collections...\n');
    
    const requiredCollections = [
      'site_settings',
      'navigation', 
      'post',
      'featured_posts',
      'speaking',
      'companies'
    ];

    for (const collection of requiredCollections) {
      try {
        const response = await api.get(`/collections/${collection}`);
        console.log(`✅ ${collection}: EXISTS`);
        
        // Check if it has GraphQL access
        const fieldsResponse = await api.get(`/fields/${collection}`);
        console.log(`   Fields: ${fieldsResponse.data.data.length} fields`);
        
      } catch (error) {
        if (error.response?.status === 403) {
          console.log(`⚠️  ${collection}: EXISTS but no access permissions`);
        } else if (error.response?.status === 404) {
          console.log(`❌ ${collection}: MISSING`);
        } else {
          console.log(`❓ ${collection}: Error - ${error.response?.status}`);
        }
      }
    }

    console.log('\n🔍 Testing GraphQL access...');
    try {
      const graphqlResponse = await api.post('/graphql', {
        query: `
          query {
            __schema {
              types {
                name
              }
            }
          }
        `
      });
      
      const types = graphqlResponse.data.data.__schema.types
        .map(t => t.name)
        .filter(name => name.startsWith('Directus_'));
      
      console.log('✅ GraphQL accessible');
      console.log('Available Directus types:', types.join(', '));
      
    } catch (error) {
      console.log('❌ GraphQL not accessible:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Error checking collections:', error.message);
  }
}

checkCollections();
