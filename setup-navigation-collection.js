require('dotenv').config({ path: '.env.development' });

// Simple HTTP-based setup using token authentication
async function setupNavigationCollection() {
  try {
    const DIRECTUS_URL = process.env.DIRECTUS_URL;
    const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

    if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
      console.error('❌ Missing environment variables. Please check your .env.development file:');
      console.error('- DIRECTUS_URL');
      console.error('- DIRECTUS_TOKEN');
      return;
    }

    console.log('🔐 Using token authentication with Directus...');
    const token = DIRECTUS_TOKEN;

    console.log('✅ Authenticated successfully');

    // Create navigation collection
    console.log('📦 Creating navigation collection...');
    
    const collectionResponse = await fetch(`${DIRECTUS_URL}/collections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        collection: 'navigation',
        meta: {
          accountability: 'all',
          collection: 'navigation',
          group: null,
          hidden: false,
          icon: 'menu',
          item_duplication_fields: null,
          note: 'Site navigation menu items',
          singleton: false,
          translations: null,
        },
        schema: {
          name: 'navigation',
        },
      }),
    });

    if (!collectionResponse.ok) {
      const errorData = await collectionResponse.json();
      if (errorData.errors?.[0]?.extensions?.code === 'COLLECTION_ALREADY_EXISTS') {
        console.log('⚠️  Navigation collection already exists, skipping creation');
      } else {
        throw new Error(`Failed to create collection: ${JSON.stringify(errorData)}`);
      }
    } else {
      console.log('✅ Navigation collection created');
    }

    // Create fields
    const fields = [
      {
        collection: 'navigation',
        field: 'id',
        type: 'integer',
        meta: {
          collection: 'navigation',
          field: 'id',
          special: null,
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
          validation_message: null,
        },
        schema: {
          name: 'id',
          table: 'navigation',
          data_type: 'integer',
          default_value: null,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: false,
          is_unique: false,
          is_primary_key: true,
          has_auto_increment: true,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: '',
        },
      },
      {
        collection: 'navigation',
        field: 'label',
        type: 'string',
        meta: {
          collection: 'navigation',
          field: 'label',
          special: null,
          interface: 'input',
          options: null,
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 2,
          width: 'full',
          translations: null,
          note: 'Menu item text (e.g., "Home", "About")',
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: 'label',
          table: 'navigation',
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
          comment: '',
        },
      },
      {
        collection: 'navigation',
        field: 'url',
        type: 'string',
        meta: {
          collection: 'navigation',
          field: 'url',
          special: null,
          interface: 'input',
          options: null,
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 3,
          width: 'full',
          translations: null,
          note: 'Link URL (e.g., "/", "/about/", "https://external.com")',
          conditions: null,
          required: true,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: 'url',
          table: 'navigation',
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
          comment: '',
        },
      },
      {
        collection: 'navigation',
        field: 'sort_order',
        type: 'integer',
        meta: {
          collection: 'navigation',
          field: 'sort_order',
          special: null,
          interface: 'input',
          options: null,
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 4,
          width: 'half',
          translations: null,
          note: 'Display order (1, 2, 3...)',
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: 'sort_order',
          table: 'navigation',
          data_type: 'integer',
          default_value: 1,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: '',
        },
      },
      {
        collection: 'navigation',
        field: 'is_external',
        type: 'boolean',
        meta: {
          collection: 'navigation',
          field: 'is_external',
          special: null,
          interface: 'boolean',
          options: null,
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 5,
          width: 'half',
          translations: null,
          note: 'Opens in new tab if true',
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: 'is_external',
          table: 'navigation',
          data_type: 'boolean',
          default_value: false,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: '',
        },
      },
      {
        collection: 'navigation',
        field: 'is_cta',
        type: 'boolean',
        meta: {
          collection: 'navigation',
          field: 'is_cta',
          special: null,
          interface: 'boolean',
          options: null,
          display: null,
          display_options: null,
          readonly: false,
          hidden: false,
          sort: 6,
          width: 'half',
          translations: null,
          note: 'Styled as call-to-action button',
          conditions: null,
          required: false,
          group: null,
          validation: null,
          validation_message: null,
        },
        schema: {
          name: 'is_cta',
          table: 'navigation',
          data_type: 'boolean',
          default_value: false,
          max_length: null,
          numeric_precision: null,
          numeric_scale: null,
          is_nullable: true,
          is_unique: false,
          is_primary_key: false,
          has_auto_increment: false,
          foreign_key_column: null,
          foreign_key_table: null,
          comment: '',
        },
      },
      {
        collection: 'navigation',
        field: 'status',
        type: 'string',
        meta: {
          collection: 'navigation',
          field: 'status',
          special: null,
          interface: 'select-dropdown',
          options: {
            choices: [
              { text: 'Published', value: 'published' },
              { text: 'Draft', value: 'draft' },
            ],
          },
          display: 'labels',
          display_options: {
            choices: [
              { text: 'Published', value: 'published', foreground: '#FFFFFF', background: '#00C897' },
              { text: 'Draft', value: 'draft', foreground: '#18222F', background: '#D3DAE4' },
            ],
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
          validation_message: null,
        },
        schema: {
          name: 'status',
          table: 'navigation',
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
          comment: '',
        },
      },
    ];

    console.log('🔧 Creating fields...');
    
    for (const field of fields) {
      try {
        const fieldResponse = await fetch(`${DIRECTUS_URL}/fields/${field.collection}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(field),
        });

        if (!fieldResponse.ok) {
          const errorData = await fieldResponse.json();
          if (errorData.errors?.[0]?.extensions?.code === 'FIELD_ALREADY_EXISTS') {
            console.log(`⚠️  Field '${field.field}' already exists, skipping`);
          } else {
            console.error(`Failed to create field '${field.field}':`, errorData);
          }
        } else {
          console.log(`✅ Created field: ${field.field}`);
        }
      } catch (error) {
        console.error(`Error creating field '${field.field}':`, error.message);
      }
    }

    // Create default navigation items
    console.log('📝 Creating default navigation items...');
    
    const defaultItems = [
      { label: 'Home', url: '/', sort_order: 1, is_external: false, is_cta: false, status: 'published' },
      { label: 'Blog', url: '/blog/', sort_order: 2, is_external: false, is_cta: false, status: 'published' },
      { label: 'Speaking', url: '/speaking/', sort_order: 3, is_external: false, is_cta: false, status: 'published' },
      { label: 'Podcast', url: '/podcast/', sort_order: 4, is_external: false, is_cta: false, status: 'published' },
      { label: 'Get in Touch', url: '/contact/', sort_order: 5, is_external: false, is_cta: true, status: 'published' },
    ];

    for (const item of defaultItems) {
      try {
        const itemResponse = await fetch(`${DIRECTUS_URL}/items/navigation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(item),
        });

        if (itemResponse.ok) {
          console.log(`✅ Created navigation item: ${item.label}`);
        } else {
          const errorData = await itemResponse.json();
          console.error(`Failed to create navigation item '${item.label}':`, errorData);
        }
      } catch (error) {
        console.error(`Error creating navigation item '${item.label}':`, error.message);
      }
    }

    console.log('\n🎉 Navigation collection setup complete!');
    console.log('\nYou can now:');
    console.log('1. Go to your Directus admin panel');
    console.log('2. Navigate to Content → Navigation');
    console.log('3. Edit, add, or reorder menu items');
    console.log('4. The frontend will automatically fetch these items');

  } catch (error) {
    console.error('❌ Error setting up navigation collection:', error.message);
  }
}

// Run the setup
setupNavigationCollection();
