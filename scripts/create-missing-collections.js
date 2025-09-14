const axios = require('axios');

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://137.184.85.3';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-admin-token';

const api = axios.create({
  baseURL: `${DIRECTUS_URL}`,
  headers: {
    'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function createCollection(collectionData) {
  try {
    console.log(`Creating collection: ${collectionData.collection}`);
    const response = await api.post('/collections', collectionData);
    console.log(`✅ Created collection: ${collectionData.collection}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log(`⚠️  Collection ${collectionData.collection} already exists`);
      return null;
    }
    console.error(`❌ Error creating collection ${collectionData.collection}:`, error.response?.data || error.message);
    throw error;
  }
}

async function createField(collection, fieldData) {
  try {
    console.log(`Creating field: ${collection}.${fieldData.field}`);
    const response = await api.post(`/fields/${collection}`, fieldData);
    console.log(`✅ Created field: ${collection}.${fieldData.field}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      console.log(`⚠️  Field ${collection}.${fieldData.field} already exists`);
      return null;
    }
    console.error(`❌ Error creating field ${collection}.${fieldData.field}:`, error.response?.data || error.message);
    throw error;
  }
}

async function createMissingCollections() {
  try {
    console.log('🚀 Creating missing Directus collections...\n');

    // 1. Site Settings (Singleton)
    await createCollection({
      collection: 'site_settings',
      meta: {
        singleton: true,
        icon: 'settings',
        note: 'Global site configuration and hero content'
      },
      schema: {
        name: 'site_settings'
      }
    });

    const siteSettingsFields = [
      {
        field: 'site_title',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Site title (e.g., "Benjamin Carlson")'
        }
      },
      {
        field: 'hero_title',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Hero section main title'
        }
      },
      {
        field: 'hero_subtitle',
        type: 'text',
        meta: {
          interface: 'textarea',
          display: 'raw',
          note: 'Hero section subtitle/description'
        }
      },
      {
        field: 'hero_cta_primary_text',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Primary CTA button text'
        }
      },
      {
        field: 'hero_cta_primary_url',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Primary CTA button URL'
        }
      },
      {
        field: 'hero_cta_secondary_text',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Secondary CTA button text'
        }
      },
      {
        field: 'hero_cta_secondary_url',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Secondary CTA button URL'
        }
      }
    ];

    for (const field of siteSettingsFields) {
      await createField('site_settings', field);
    }

    // 2. Navigation Collection
    await createCollection({
      collection: 'navigation',
      meta: {
        icon: 'menu',
        note: 'Site navigation items'
      },
      schema: {
        name: 'navigation'
      }
    });

    const navigationFields = [
      {
        field: 'label',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Navigation item label'
        }
      },
      {
        field: 'url',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Navigation item URL'
        }
      },
      {
        field: 'is_external',
        type: 'boolean',
        meta: {
          interface: 'boolean',
          display: 'boolean',
          note: 'Whether link opens in new tab'
        }
      },
      {
        field: 'is_cta',
        type: 'boolean',
        meta: {
          interface: 'boolean',
          display: 'boolean',
          note: 'Whether this is a call-to-action button'
        }
      },
      {
        field: 'sort_order',
        type: 'integer',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Sort order for navigation items'
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
              { text: 'Archived', value: 'archived' }
            ]
          }
        },
        schema: {
          default_value: 'draft'
        }
      }
    ];

    for (const field of navigationFields) {
      await createField('navigation', field);
    }

    // 3. Speaking Collection
    await createCollection({
      collection: 'speaking',
      meta: {
        icon: 'mic',
        note: 'Speaking engagements and presentations'
      },
      schema: {
        name: 'speaking'
      }
    });

    const speakingFields = [
      {
        field: 'title',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Presentation title'
        }
      },
      {
        field: 'event_name',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Event or conference name'
        }
      },
      {
        field: 'description',
        type: 'text',
        meta: {
          interface: 'textarea',
          display: 'raw',
          note: 'Presentation description'
        }
      },
      {
        field: 'video_url',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'YouTube or Wistia video URL'
        }
      },
      {
        field: 'date',
        type: 'date',
        meta: {
          interface: 'datetime',
          display: 'datetime',
          note: 'Presentation date'
        }
      },
      {
        field: 'type',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          options: {
            choices: [
              { text: 'Conference', value: 'conference' },
              { text: 'Meetup', value: 'meetup' },
              { text: 'Workshop', value: 'workshop' },
              { text: 'Webinar', value: 'webinar' }
            ]
          }
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
              { text: 'Archived', value: 'archived' }
            ]
          }
        },
        schema: {
          default_value: 'draft'
        }
      }
    ];

    for (const field of speakingFields) {
      await createField('speaking', field);
    }

    // 4. Companies Collection
    await createCollection({
      collection: 'companies',
      meta: {
        icon: 'business',
        note: 'Past speaking audiences and companies'
      },
      schema: {
        name: 'companies'
      }
    });

    const companiesFields = [
      {
        field: 'name',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Company name'
        }
      },
      {
        field: 'website_url',
        type: 'string',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Company website URL'
        }
      },
      {
        field: 'logo',
        type: 'uuid',
        meta: {
          interface: 'file-image',
          display: 'image',
          note: 'Company logo image'
        }
      },
      {
        field: 'sort_order',
        type: 'integer',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Sort order for display'
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
              { text: 'Archived', value: 'archived' }
            ]
          }
        },
        schema: {
          default_value: 'draft'
        }
      }
    ];

    for (const field of companiesFields) {
      await createField('companies', field);
    }

    // 5. Featured Posts Collection (Junction Table)
    await createCollection({
      collection: 'featured_posts',
      meta: {
        icon: 'star',
        note: 'Featured posts for homepage'
      },
      schema: {
        name: 'featured_posts'
      }
    });

    const featuredPostsFields = [
      {
        field: 'post',
        type: 'uuid',
        meta: {
          interface: 'select-dropdown-m2o',
          display: 'related-values',
          note: 'Related post'
        },
        schema: {
          foreign_key_table: 'post',
          foreign_key_column: 'id'
        }
      },
      {
        field: 'sort_order',
        type: 'integer',
        meta: {
          interface: 'input',
          display: 'raw',
          note: 'Sort order for featured posts'
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          interface: 'select-dropdown',
          display: 'labels',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
              { text: 'Archived', value: 'archived' }
            ]
          }
        },
        schema: {
          default_value: 'draft'
        }
      }
    ];

    for (const field of featuredPostsFields) {
      await createField('featured_posts', field);
    }

    console.log('\n✅ All collections created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Configure collection permissions in Directus admin');
    console.log('2. Enable GraphQL access for each collection');
    console.log('3. Add sample data to test the collections');
    console.log('4. Re-enable dynamic queries in Gatsby components');

  } catch (error) {
    console.error('❌ Error creating collections:', error.message);
    process.exit(1);
  }
}

// Run the script
createMissingCollections();
