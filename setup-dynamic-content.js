const { createDirectus, rest, authentication, createCollection, createField, createItem } = require('@directus/sdk');
require('dotenv').config({ path: '.env.development' });

const directus = createDirectus(process.env.DIRECTUS_URL).with(rest()).with(authentication());

async function setupDynamicContent() {
  try {
    // Authenticate
    await directus.login(process.env.DIRECTUS_ADMIN_EMAIL, process.env.DIRECTUS_ADMIN_PASSWORD);

    console.log('🚀 Setting up dynamic content collections...\n');

    // Setup Navigation Collection
    console.log('📋 Creating navigation collection...');
    
    try {
      await directus.collections.createOne({
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
      });

      // Navigation fields
      const navigationFields = [
        {
          collection: 'navigation',
          field: 'id',
          type: 'integer',
          meta: {
            collection: 'navigation',
            field: 'id',
            special: null,
            interface: 'input',
            readonly: true,
            hidden: true,
            sort: 1,
          },
          schema: {
            name: 'id',
            table: 'navigation',
            data_type: 'integer',
            is_nullable: false,
            is_primary_key: true,
            has_auto_increment: true,
          },
        },
        {
          collection: 'navigation',
          field: 'status',
          type: 'string',
          meta: {
            collection: 'navigation',
            field: 'status',
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: 'Published', value: 'published' },
                { text: 'Draft', value: 'draft' },
                { text: 'Archived', value: 'archived' }
              ]
            },
            sort: 2,
          },
          schema: {
            name: 'status',
            table: 'navigation',
            data_type: 'varchar',
            default_value: 'draft',
            max_length: 255,
            is_nullable: false,
          },
        },
        {
          collection: 'navigation',
          field: 'sort',
          type: 'integer',
          meta: {
            collection: 'navigation',
            field: 'sort',
            interface: 'input',
            sort: 3,
            note: 'Order of menu items (lower numbers appear first)',
          },
          schema: {
            name: 'sort',
            table: 'navigation',
            data_type: 'integer',
            is_nullable: true,
          },
        },
        {
          collection: 'navigation',
          field: 'label',
          type: 'string',
          meta: {
            collection: 'navigation',
            field: 'label',
            interface: 'input',
            sort: 4,
            note: 'The text displayed in the navigation menu',
            required: true,
          },
          schema: {
            name: 'label',
            table: 'navigation',
            data_type: 'varchar',
            max_length: 255,
            is_nullable: false,
          },
        },
        {
          collection: 'navigation',
          field: 'url',
          type: 'string',
          meta: {
            collection: 'navigation',
            field: 'url',
            interface: 'input',
            sort: 5,
            note: 'Internal path (e.g., /about) or external URL (e.g., https://example.com)',
            required: true,
          },
          schema: {
            name: 'url',
            table: 'navigation',
            data_type: 'varchar',
            max_length: 500,
            is_nullable: false,
          },
        },
        {
          collection: 'navigation',
          field: 'is_external',
          type: 'boolean',
          meta: {
            collection: 'navigation',
            field: 'is_external',
            interface: 'boolean',
            sort: 6,
            note: 'Check if this is an external link (opens in new tab)',
          },
          schema: {
            name: 'is_external',
            table: 'navigation',
            data_type: 'boolean',
            default_value: false,
            is_nullable: true,
          },
        },
        {
          collection: 'navigation',
          field: 'is_cta',
          type: 'boolean',
          meta: {
            collection: 'navigation',
            field: 'is_cta',
            interface: 'boolean',
            sort: 7,
            note: 'Mark as call-to-action button (styled differently)',
          },
          schema: {
            name: 'is_cta',
            table: 'navigation',
            data_type: 'boolean',
            default_value: false,
            is_nullable: true,
          },
        }
      ];

      for (const field of navigationFields) {
        await directus.fields.createOne(field);
      }

      // Create default navigation items
      const defaultNavItems = [
        { label: 'Home', url: '/', sort: 1, status: 'published', is_external: false, is_cta: false },
        { label: 'Blog', url: '/blog/', sort: 2, status: 'published', is_external: false, is_cta: false },
        { label: 'Speaking', url: '/speaking/', sort: 3, status: 'published', is_external: false, is_cta: false },
        { label: 'Podcast', url: '/podcast/', sort: 4, status: 'published', is_external: false, is_cta: false },
        { label: 'Get in Touch', url: '/contact/', sort: 5, status: 'published', is_external: false, is_cta: true }
      ];

      for (const item of defaultNavItems) {
        await directus.items('navigation').createOne(item);
      }

      console.log('✅ Navigation collection created successfully!');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Navigation collection already exists, skipping...');
      } else {
        throw error;
      }
    }

    // Setup Site Metadata Collection
    console.log('\n⚙️  Creating site metadata collection...');
    
    try {
      await directus.collections.createOne({
        collection: 'site_metadata',
        meta: {
          accountability: 'all',
          collection: 'site_metadata',
          group: null,
          hidden: false,
          icon: 'settings',
          item_duplication_fields: null,
          note: 'Global site settings and metadata',
          singleton: true,
          translations: null,
        },
        schema: {
          name: 'site_metadata',
        },
      });

      // Site metadata fields
      const metadataFields = [
        {
          collection: 'site_metadata',
          field: 'id',
          type: 'integer',
          meta: {
            collection: 'site_metadata',
            field: 'id',
            interface: 'input',
            readonly: true,
            hidden: true,
            sort: 1,
          },
          schema: {
            name: 'id',
            table: 'site_metadata',
            data_type: 'integer',
            is_nullable: false,
            is_primary_key: true,
            has_auto_increment: true,
          },
        },
        {
          collection: 'site_metadata',
          field: 'site_title',
          type: 'string',
          meta: {
            collection: 'site_metadata',
            field: 'site_title',
            interface: 'input',
            sort: 2,
            note: 'The main title of your website',
            required: true,
          },
          schema: {
            name: 'site_title',
            table: 'site_metadata',
            data_type: 'varchar',
            max_length: 255,
            is_nullable: false,
          },
        },
        {
          collection: 'site_metadata',
          field: 'site_description',
          type: 'text',
          meta: {
            collection: 'site_metadata',
            field: 'site_description',
            interface: 'input-multiline',
            sort: 3,
            note: 'A brief description of your website for SEO',
          },
          schema: {
            name: 'site_description',
            table: 'site_metadata',
            data_type: 'text',
            is_nullable: true,
          },
        },
        {
          collection: 'site_metadata',
          field: 'hero_title',
          type: 'string',
          meta: {
            collection: 'site_metadata',
            field: 'hero_title',
            interface: 'input',
            sort: 4,
            note: 'Main headline for the homepage hero section',
          },
          schema: {
            name: 'hero_title',
            table: 'site_metadata',
            data_type: 'varchar',
            max_length: 500,
            is_nullable: true,
          },
        },
        {
          collection: 'site_metadata',
          field: 'hero_subtitle',
          type: 'text',
          meta: {
            collection: 'site_metadata',
            field: 'hero_subtitle',
            interface: 'input-multiline',
            sort: 5,
            note: 'Subtitle or description for the homepage hero section',
          },
          schema: {
            name: 'hero_subtitle',
            table: 'site_metadata',
            data_type: 'text',
            is_nullable: true,
          },
        }
      ];

      for (const field of metadataFields) {
        await directus.fields.createOne(field);
      }

      // Create default site metadata
      await directus.items('site_metadata').createOne({
        site_title: 'Benjamin Carlson',
        site_description: 'Personal website and blog of Benjamin Carlson - developer, speaker, and content creator.',
        hero_title: "Hi, I'm Benjamin Carlson",
        hero_subtitle: "I'm a developer, speaker, and content creator passionate about building great web experiences."
      });

      console.log('✅ Site metadata collection created successfully!');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Site metadata collection already exists, skipping...');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Dynamic content setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Run your Gatsby development server: npm run develop');
    console.log('2. Visit your Directus admin panel to customize navigation and site metadata');
    console.log('3. Your site will now pull content dynamically from Directus!');

  } catch (error) {
    console.error('❌ Error setting up dynamic content:', error);
    process.exit(1);
  }
}

setupDynamicContent();
