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

async function setupUnifiedPosts() {
  try {
    console.log('Setting up unified post collection with dynamic fields...');

    // 1. Add type field to existing post collection
    try {
      await api.post('/fields/post', {
        field: 'type',
        type: 'string',
        meta: {
          field: 'type',
          special: null,
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Article', value: 'article' },
              { text: 'Speaking', value: 'speaking' },
              { text: 'Podcast', value: 'podcast' }
            ]
          },
          display: 'labels',
          display_options: {
            choices: [
              { text: 'Article', value: 'article', foreground: '#ffffff', background: '#3b82f6' },
              { text: 'Speaking', value: 'speaking', foreground: '#ffffff', background: '#667eea' },
              { text: 'Podcast', value: 'podcast', foreground: '#ffffff', background: '#764ba2' }
            ]
          },
          readonly: false,
          hidden: false,
          sort: 3,
          width: 'half',
          translations: null,
          note: 'Determines which fields are shown and which template is used',
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'type',
          table: 'post',
          data_type: 'varchar',
          default_value: 'article',
          max_length: 255,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: ''
        }
      });
      console.log('✓ Added type field to post collection');
    } catch (error) {
      console.log('⚠ Type field might already exist:', error.response?.data?.errors?.[0]?.message || error.message);
    }

    // 2. Add speaking-specific fields
    const speakingFields = [
      {
        field: 'video_url',
        type: 'string',
        meta: {
          field: 'video_url',
          special: null,
          interface: 'input',
          options: {
            placeholder: 'https://www.youtube.com/watch?v=... or https://company.wistia.com/medias/...'
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 20,
          width: 'full',
          translations: null,
          note: 'YouTube or Wistia video URL for speaking engagements',
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
          ],
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'video_url',
          table: 'post',
          data_type: 'text',
          default_value: null,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: ''
        }
      },
      {
        field: 'event_name',
        type: 'string',
        meta: {
          field: 'event_name',
          special: null,
          interface: 'input',
          options: {
            placeholder: 'Conference or event name'
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 21,
          width: 'half',
          translations: null,
          note: 'Name of the conference or event',
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
          ],
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'event_name',
          table: 'post',
          data_type: 'varchar',
          default_value: null,
          max_length: 255,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: ''
        }
      },
      {
        field: 'event_date',
        type: 'date',
        meta: {
          field: 'event_date',
          special: null,
          interface: 'datetime',
          options: null,
          display: 'datetime',
          display_options: {
            format: 'YYYY-MM-DD'
          },
          readonly: false,
          hidden: false,
          sort: 22,
          width: 'half',
          translations: null,
          note: 'Date of the speaking engagement',
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
          ],
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'event_date',
          table: 'post',
          data_type: 'date',
          default_value: null,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: ''
        }
      }
    ];

    // 3. Add podcast-specific fields
    const podcastFields = [
      {
        field: 'audio_url',
        type: 'string',
        meta: {
          field: 'audio_url',
          special: null,
          interface: 'input',
          options: {
            placeholder: 'https://example.com/podcast.mp3 or Spotify/Apple Podcasts URL'
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 30,
          width: 'full',
          translations: null,
          note: 'Audio file URL or podcast platform link',
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
          ],
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'audio_url',
          table: 'post',
          data_type: 'text',
          default_value: null,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: ''
        }
      },
      {
        field: 'podcast_name',
        type: 'string',
        meta: {
          field: 'podcast_name',
          special: null,
          interface: 'input',
          options: {
            placeholder: 'Name of the podcast show'
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 31,
          width: 'half',
          translations: null,
          note: 'Name of the podcast show',
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
          ],
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'podcast_name',
          table: 'post',
          data_type: 'varchar',
          default_value: null,
          max_length: 255,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: ''
        }
      },
      {
        field: 'duration',
        type: 'string',
        meta: {
          field: 'duration',
          special: null,
          interface: 'input',
          options: {
            placeholder: 'e.g., 45 minutes'
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 32,
          width: 'half',
          translations: null,
          note: 'Duration of the podcast episode',
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
          ],
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'duration',
          table: 'post',
          data_type: 'varchar',
          default_value: null,
          max_length: 100,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: ''
        }
      }
    ];

    // Create all fields
    const allFields = [...speakingFields, ...podcastFields];
    
    for (const field of allFields) {
      try {
        await api.post('/fields/post', field);
        console.log(`✓ Created field: ${field.field}`);
      } catch (error) {
        console.log(`⚠ Field ${field.field} might already exist:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    // 4. Update existing posts to have type 'article'
    try {
      await api.patch('/items/post', {
        keys: [],
        data: {
          type: 'article'
        }
      });
      console.log('✓ Updated existing posts to type "article"');
    } catch (error) {
      console.log('⚠ Could not update existing posts:', error.response?.data?.errors?.[0]?.message || error.message);
    }

    // 5. Add sample speaking post
    try {
      await api.post('/items/post', {
        title: 'The Future of Design Systems',
        slug: 'future-of-design-systems',
        content: 'In this talk, I explore how design systems are evolving and their impact on product development teams.',
        excerpt: 'A deep dive into scalable design systems and their impact on product development.',
        type: 'speaking',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        event_name: 'DesignOps Conference 2024',
        event_date: '2024-03-15',
        status: 'published'
      });
      console.log('✓ Created sample speaking post');
    } catch (error) {
      console.log('⚠ Sample speaking post might already exist');
    }

    // 6. Add sample podcast post
    try {
      await api.post('/items/post', {
        title: 'Building Design Teams at Scale',
        slug: 'building-design-teams-scale',
        content: 'In this podcast episode, we discuss the challenges and strategies for building and scaling design teams in fast-growing companies.',
        excerpt: 'Discussion about hiring, managing, and scaling design teams in fast-growing companies.',
        type: 'podcast',
        audio_url: 'https://example.com/podcast-episode.mp3',
        podcast_name: 'The Design Leadership Podcast',
        duration: '45 minutes',
        status: 'published'
      });
      console.log('✓ Created sample podcast post');
    } catch (error) {
      console.log('⚠ Sample podcast post might already exist');
    }

    console.log('\n🎉 Unified post collection setup complete!');
    console.log('Your post collection now supports:');
    console.log('- Article posts (blog content)');
    console.log('- Speaking posts (with video URLs and event details)');
    console.log('- Podcast posts (with audio URLs and podcast details)');
    console.log('\nNext: Update Gatsby templates and routing');

  } catch (error) {
    console.error('Error setting up unified posts:', error.response?.data || error.message);
  }
}

// Run the setup
setupUnifiedPosts();
