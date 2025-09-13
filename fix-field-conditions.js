const axios = require('axios');

// Directus configuration
const DIRECTUS_URL = 'http://137.184.85.3:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-token-here';

const api = axios.create({
  baseURL: `${DIRECTUS_URL}/`,
  headers: {
    'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function fixFieldConditions() {
  try {
    console.log('Fixing conditional field visibility in Directus...');

    // Update speaking-specific fields with proper conditions
    const speakingFields = [
      {
        field: 'video_url',
        conditions: [
          {
            name: 'Show for Speaking',
            rule: {
              type: {
                _eq: 'speaking'
              }
            },
            hidden: false,
            options: {}
          }
        ]
      },
      {
        field: 'event_name',
        conditions: [
          {
            name: 'Show for Speaking',
            rule: {
              type: {
                _eq: 'speaking'
              }
            },
            hidden: false,
            options: {}
          }
        ]
      },
      {
        field: 'event_date',
        conditions: [
          {
            name: 'Show for Speaking',
            rule: {
              type: {
                _eq: 'speaking'
              }
            },
            hidden: false,
            options: {}
          }
        ]
      }
    ];

    // Update podcast-specific fields with proper conditions
    const podcastFields = [
      {
        field: 'audio_url',
        conditions: [
          {
            name: 'Show for Podcast',
            rule: {
              type: {
                _eq: 'podcast'
              }
            },
            hidden: false,
            options: {}
          }
        ]
      },
      {
        field: 'podcast_name',
        conditions: [
          {
            name: 'Show for Podcast',
            rule: {
              type: {
                _eq: 'podcast'
              }
            },
            hidden: false,
            options: {}
          }
        ]
      },
      {
        field: 'duration',
        conditions: [
          {
            name: 'Show for Podcast',
            rule: {
              type: {
                _eq: 'podcast'
              }
            },
            hidden: false,
            options: {}
          }
        ]
      }
    ];

    // Update each speaking field
    for (const fieldConfig of speakingFields) {
      try {
        await api.patch(`/fields/post/${fieldConfig.field}`, {
          meta: {
            conditions: fieldConfig.conditions
          }
        });
        console.log(`✓ Updated conditions for speaking field: ${fieldConfig.field}`);
      } catch (error) {
        console.log(`⚠ Could not update ${fieldConfig.field}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    // Update each podcast field
    for (const fieldConfig of podcastFields) {
      try {
        await api.patch(`/fields/post/${fieldConfig.field}`, {
          meta: {
            conditions: fieldConfig.conditions
          }
        });
        console.log(`✓ Updated conditions for podcast field: ${fieldConfig.field}`);
      } catch (error) {
        console.log(`⚠ Could not update ${fieldConfig.field}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    // Also make sure content field shows for all types (no conditions)
    try {
      await api.patch(`/fields/post/content`, {
        meta: {
          conditions: null
        }
      });
      console.log('✓ Ensured content field shows for all post types');
    } catch (error) {
      console.log('⚠ Could not update content field conditions');
    }

    // Make sure excerpt shows for all types
    try {
      await api.patch(`/fields/post/excerpt`, {
        meta: {
          conditions: null
        }
      });
      console.log('✓ Ensured excerpt field shows for all post types');
    } catch (error) {
      console.log('⚠ Could not update excerpt field conditions');
    }

    console.log('\n🎉 Field conditions updated!');
    console.log('Now when you select a post type in Directus:');
    console.log('- Article: Shows title, slug, content, excerpt, featured_image, author, tags');
    console.log('- Speaking: Shows title, slug, content, excerpt + video_url, event_name, event_date');
    console.log('- Podcast: Shows title, slug, content, excerpt + audio_url, podcast_name, duration');

  } catch (error) {
    console.error('Error fixing field conditions:', error.response?.data || error.message);
  }
}

// Run the fix
fixFieldConditions();
