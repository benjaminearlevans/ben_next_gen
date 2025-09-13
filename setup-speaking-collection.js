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

async function createSpeakingCollection() {
  try {
    console.log('Creating speaking collection...');
    
    // 1. Create the collection
    const collectionResponse = await api.post('/collections', {
      collection: 'speaking',
      meta: {
        collection: 'speaking',
        icon: 'record_voice_over',
        note: 'Speaking engagements and podcast appearances',
        display_template: '{{title}} - {{event_name}}',
        hidden: false,
        singleton: false,
        translations: null,
        archive_field: null,
        archive_app_filter: true,
        archive_value: null,
        unarchive_value: null,
        sort_field: 'date',
        accountability: 'all',
        color: null,
        item_duplication_fields: null,
        sort: null,
        group: null,
        collapse: 'open'
      },
      schema: {
        name: 'speaking'
      }
    });
    
    console.log('✓ Collection created');

    // 2. Create fields
    const fields = [
      {
        field: 'id',
        type: 'uuid',
        meta: {
          field: 'id',
          special: ['uuid'],
          interface: 'input',
          options: null,
          display: null,
          display_options: null,
          readonly: true,
          hidden: true,
          sort: 1,
          width: 'full',
          translations: null,
          note: null,
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'id',
          table: 'speaking',
          data_type: 'uuid',
          default_value: null,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: true,
          is_primary_key: true,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: ''
        }
      },
      {
        field: 'status',
        type: 'string',
        meta: {
          field: 'status',
          special: null,
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Draft', value: 'draft' },
              { text: 'Published', value: 'published' }
            ]
          },
          display: 'labels',
          display_options: {
            choices: [
              { text: 'Draft', value: 'draft', foreground: '#18222c', background: '#d3dae4' },
              { text: 'Published', value: 'published', foreground: '#ffffff', background: '#00c897' }
            ]
          },
          readonly: false,
          hidden: false,
          sort: 2,
          width: 'half',
          translations: null,
          note: null,
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'status',
          table: 'speaking',
          data_type: 'varchar',
          default_value: 'draft',
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
      },
      {
        field: 'title',
        type: 'string',
        meta: {
          field: 'title',
          special: null,
          interface: 'input',
          options: {
            placeholder: 'Enter talk or podcast title'
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 3,
          width: 'full',
          translations: null,
          note: null,
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'title',
          table: 'speaking',
          data_type: 'varchar',
          default_value: null,
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
      },
      {
        field: 'event_name',
        type: 'string',
        meta: {
          field: 'event_name',
          special: null,
          interface: 'input',
          options: {
            placeholder: 'Conference or podcast name'
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 4,
          width: 'half',
          translations: null,
          note: null,
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'event_name',
          table: 'speaking',
          data_type: 'varchar',
          default_value: null,
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
      },
      {
        field: 'type',
        type: 'string',
        meta: {
          field: 'type',
          special: null,
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Speaking Engagement', value: 'speaking' },
              { text: 'Podcast Appearance', value: 'podcast' }
            ]
          },
          display: 'labels',
          display_options: {
            choices: [
              { text: 'Speaking', value: 'speaking', foreground: '#ffffff', background: '#667eea' },
              { text: 'Podcast', value: 'podcast', foreground: '#ffffff', background: '#764ba2' }
            ]
          },
          readonly: false,
          hidden: false,
          sort: 5,
          width: 'half',
          translations: null,
          note: null,
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'type',
          table: 'speaking',
          data_type: 'varchar',
          default_value: 'speaking',
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
      },
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
          sort: 6,
          width: 'full',
          translations: null,
          note: 'YouTube or Wistia video URL',
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'video_url',
          table: 'speaking',
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
        field: 'date',
        type: 'date',
        meta: {
          field: 'date',
          special: null,
          interface: 'datetime',
          options: null,
          display: 'datetime',
          display_options: {
            format: 'YYYY-MM-DD'
          },
          readonly: false,
          hidden: false,
          sort: 7,
          width: 'half',
          translations: null,
          note: null,
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'date',
          table: 'speaking',
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
      },
      {
        field: 'description',
        type: 'text',
        meta: {
          field: 'description',
          special: null,
          interface: 'input-multiline',
          options: {
            placeholder: 'Optional description of the talk or podcast'
          },
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 8,
          width: 'full',
          translations: null,
          note: null,
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'description',
          table: 'speaking',
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
        field: 'date_created',
        type: 'timestamp',
        meta: {
          field: 'date_created',
          special: ['date-created'],
          interface: 'datetime',
          options: null,
          display: 'datetime',
          display_options: null,
          readonly: true,
          hidden: true,
          sort: 9,
          width: 'half',
          translations: null,
          note: null,
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'date_created',
          table: 'speaking',
          data_type: 'timestamp',
          default_value: 'CURRENT_TIMESTAMP',
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
        field: 'date_updated',
        type: 'timestamp',
        meta: {
          field: 'date_updated',
          special: ['date-updated'],
          interface: 'datetime',
          options: null,
          display: 'datetime',
          display_options: null,
          readonly: true,
          hidden: true,
          sort: 10,
          width: 'half',
          translations: null,
          note: null,
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null
        },
        schema: {
          name: 'date_updated',
          table: 'speaking',
          data_type: 'timestamp',
          default_value: 'CURRENT_TIMESTAMP',
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

    // Create each field
    for (const field of fields) {
      try {
        await api.post('/fields/speaking', field);
        console.log(`✓ Created field: ${field.field}`);
      } catch (error) {
        console.log(`⚠ Field ${field.field} might already exist:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    // 3. Set up permissions for public role
    try {
      await api.post('/permissions', {
        role: null, // null = public role
        collection: 'speaking',
        action: 'read',
        permissions: {
          status: {
            _eq: 'published'
          }
        },
        validation: {},
        presets: null,
        fields: ['*']
      });
      console.log('✓ Public read permissions set');
    } catch (error) {
      console.log('⚠ Public permissions might already exist:', error.response?.data?.errors?.[0]?.message || error.message);
    }

    // 4. Add sample data
    const sampleData = [
      {
        title: 'The Future of Design Systems',
        event_name: 'DesignOps Conference 2024',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        date: '2024-03-15',
        description: 'A deep dive into scalable design systems and their impact on product development.',
        type: 'speaking',
        status: 'published'
      },
      {
        title: 'Building Design Teams at Scale',
        event_name: 'The Design Leadership Podcast',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        date: '2024-02-20',
        description: 'Discussion about hiring, managing, and scaling design teams in fast-growing companies.',
        type: 'podcast',
        status: 'published'
      },
      {
        title: 'User Research in Remote Teams',
        event_name: 'UX Research Summit',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        date: '2024-01-10',
        description: 'Best practices for conducting user research with distributed teams.',
        type: 'speaking',
        status: 'published'
      }
    ];

    for (const item of sampleData) {
      try {
        await api.post('/items/speaking', item);
        console.log(`✓ Created sample item: ${item.title}`);
      } catch (error) {
        console.log(`⚠ Sample item might already exist: ${item.title}`);
      }
    }

    console.log('\n🎉 Speaking collection setup complete!');
    console.log('You can now:');
    console.log('1. Visit your Directus admin to see the collection');
    console.log('2. Add more speaking engagements');
    console.log('3. View the speaking page at http://localhost:8000/speaking');

  } catch (error) {
    console.error('Error setting up collection:', error.response?.data || error.message);
  }
}

// Run the setup
createSpeakingCollection();
