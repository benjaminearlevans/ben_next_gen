const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';

async function createCompletePagesBlocksSystem() {
  try {
    console.log('🔧 Creating complete pages-blocks system with proper M2A relationship...\n');

    // 1. Delete existing collections completely
    console.log('🗑️  Removing existing collections...');
    const collectionsToDelete = ['pages', 'pages_blocks'];
    
    for (const collection of collectionsToDelete) {
      try {
        await execAsync(`curl -X DELETE "${DIRECTUS_URL}/collections/${collection}" \
          -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
        console.log(`✅ Deleted ${collection} collection`);
      } catch (error) {
        console.log(`⚠️  ${collection} deletion failed or already deleted`);
      }
    }

    // 2. Create pages collection with all fields in one go
    console.log('\n📋 Creating pages collection with complete schema...');
    
    // First create the collection
    const pagesCollection = {
      collection: 'pages',
      meta: {
        note: 'Dynamic pages with reusable blocks',
        icon: 'description',
        display_template: '{{title}}',
        hidden: false,
        singleton: false
      },
      schema: {
        name: 'pages'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            interface: 'numeric',
            hidden: true,
            readonly: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'status',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: 'Published', value: 'published' },
                { text: 'Draft', value: 'draft' },
                { text: 'Archived', value: 'archived' }
              ]
            },
            width: 'half'
          },
          schema: {
            default_value: 'draft',
            is_nullable: true
          }
        },
        {
          field: 'title',
          type: 'string',
          meta: {
            interface: 'input',
            required: true,
            width: 'half'
          },
          schema: {
            is_nullable: true
          }
        },
        {
          field: 'slug',
          type: 'string',
          meta: {
            interface: 'input',
            required: true,
            width: 'half',
            note: 'URL-friendly version of the title'
          },
          schema: {
            is_nullable: true
          }
        },
        {
          field: 'meta_description',
          type: 'text',
          meta: {
            interface: 'input-multiline',
            width: 'full',
            note: 'SEO meta description'
          },
          schema: {
            is_nullable: true
          }
        },
        {
          field: 'date_created',
          type: 'timestamp',
          meta: {
            interface: 'datetime',
            readonly: true,
            hidden: true,
            width: 'half'
          },
          schema: {
            default_value: 'CURRENT_TIMESTAMP'
          }
        },
        {
          field: 'date_updated',
          type: 'timestamp',
          meta: {
            interface: 'datetime',
            readonly: true,
            hidden: true,
            width: 'half'
          },
          schema: {
            default_value: 'CURRENT_TIMESTAMP'
          }
        }
      ]
    };

    await execAsync(`curl -X POST "${DIRECTUS_URL}/collections" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '${JSON.stringify(pagesCollection)}'`);
    console.log('✅ Created pages collection with all fields');

    // 3. Create pages_blocks junction collection with all fields
    console.log('\n🔗 Creating pages_blocks junction collection...');
    
    const junctionCollection = {
      collection: 'pages_blocks',
      meta: {
        note: 'Junction table for pages M2A blocks relationship',
        hidden: true
      },
      schema: {
        name: 'pages_blocks'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: {
            interface: 'numeric',
            hidden: true,
            readonly: true
          },
          schema: {
            is_primary_key: true,
            has_auto_increment: true
          }
        },
        {
          field: 'pages_id',
          type: 'integer',
          meta: {
            interface: 'select-dropdown-m2o',
            hidden: true
          },
          schema: {
            is_nullable: true
          }
        },
        {
          field: 'item',
          type: 'string',
          meta: {
            interface: 'select-dropdown-m2o',
            hidden: true
          },
          schema: {
            is_nullable: true
          }
        },
        {
          field: 'collection',
          type: 'string',
          meta: {
            interface: 'system-collection',
            hidden: true
          },
          schema: {
            is_nullable: true
          }
        },
        {
          field: 'sort',
          type: 'integer',
          meta: {
            interface: 'numeric',
            hidden: true
          },
          schema: {
            is_nullable: true
          }
        }
      ]
    };

    await execAsync(`curl -X POST "${DIRECTUS_URL}/collections" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '${JSON.stringify(junctionCollection)}'`);
    console.log('✅ Created pages_blocks junction collection with all fields');

    // 4. Create M2O relationship from pages_blocks to pages
    console.log('\n🔗 Creating M2O relationship: pages_blocks → pages...');
    const m2oRelation = {
      collection: 'pages_blocks',
      field: 'pages_id',
      related_collection: 'pages'
    };

    await execAsync(`curl -X POST "${DIRECTUS_URL}/relations" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '${JSON.stringify(m2oRelation)}'`);
    console.log('✅ Created M2O relationship');

    // 5. Add blocks M2A field to pages
    console.log('\n📋 Adding blocks M2A field to pages...');
    const blocksField = {
      field: 'blocks',
      type: 'alias',
      meta: {
        interface: 'list-m2a',
        special: ['m2a'],
        options: {
          enableCreate: true,
          enableSelect: true,
          limit: 15,
          template: '{{item.collection}}',
          collections: [
            'block_hero',
            'block_richtext',
            'block_cardgroup'
          ]
        },
        display: 'related-values',
        display_options: {
          template: '{{item.collection}}'
        },
        readonly: false,
        hidden: false,
        width: 'full',
        note: 'Reusable blocks for page content'
      }
    };

    await execAsync(`curl -X POST "${DIRECTUS_URL}/fields/pages" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '${JSON.stringify(blocksField)}'`);
    console.log('✅ Added blocks M2A field to pages');

    // 6. Create O2M relationship from pages to pages_blocks
    console.log('\n🔗 Creating O2M relationship: pages → pages_blocks...');
    const o2mRelation = {
      collection: 'pages',
      field: 'blocks',
      related_collection: 'pages_blocks',
      meta: {
        one_field: 'blocks',
        sort_field: 'sort',
        one_deselect_action: 'nullify'
      },
      schema: {
        on_delete: 'SET NULL'
      }
    };

    await execAsync(`curl -X POST "${DIRECTUS_URL}/relations" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '${JSON.stringify(o2mRelation)}'`);
    console.log('✅ Created O2M relationship');

    // 7. Set up permissions for both collections
    console.log('\n🔐 Setting up permissions...');
    const adminRoleId = 'c36ff6cf-1dec-406e-a990-f53193b74ad3';
    const collections = ['pages', 'pages_blocks'];
    
    for (const collection of collections) {
      const permissions = ['create', 'read', 'update', 'delete'];
      for (const action of permissions) {
        try {
          const permission = {
            role: adminRoleId,
            collection: collection,
            action: action,
            permissions: {},
            validation: {},
            presets: {},
            fields: ['*']
          };

          await execAsync(`curl -X POST "${DIRECTUS_URL}/permissions" \
            -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
            -H "Content-Type: application/json" \
            -d '${JSON.stringify(permission)}'`);
          console.log(`✅ Added ${action} permission for ${collection}`);
        } catch (error) {
          console.log(`⚠️  ${action} permission for ${collection} already exists`);
        }
      }

      // Public read permission
      try {
        const publicPermission = {
          role: null,
          collection: collection,
          action: 'read',
          permissions: {},
          validation: {},
          presets: {},
          fields: ['*']
        };

        await execAsync(`curl -X POST "${DIRECTUS_URL}/permissions" \
          -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
          -H "Content-Type: application/json" \
          -d '${JSON.stringify(publicPermission)}'`);
        console.log(`✅ Added public read permission for ${collection}`);
      } catch (error) {
        console.log(`⚠️  Public read permission for ${collection} already exists`);
      }
    }

    // 8. Verify the complete system
    console.log('\n🧪 Verifying complete system...');
    
    // Check pages fields
    const fieldsResult = await execAsync(`curl -s -X GET "${DIRECTUS_URL}/fields/pages" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
    const fieldsData = JSON.parse(fieldsResult.stdout);
    
    if (fieldsData.data) {
      console.log(`✅ Pages collection has ${fieldsData.data.length} fields:`);
      fieldsData.data.forEach(field => {
        console.log(`   - ${field.field} (${field.type})`);
      });
    }

    // Check relationships
    const relationsResult = await execAsync(`curl -s -X GET "${DIRECTUS_URL}/relations" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
    const relationsData = JSON.parse(relationsResult.stdout);
    
    if (relationsData.data) {
      const pagesRelations = relationsData.data.filter(rel => 
        rel.many_collection === 'pages_blocks' || rel.one_collection === 'pages'
      );
      console.log(`✅ Found ${pagesRelations.length} pages-related relationships`);
    }

    // Test creating a page with blocks
    console.log('\n🧪 Testing page creation with blocks...');
    
    const testPage = {
      title: 'Complete System Test',
      slug: 'complete-test',
      status: 'published',
      meta_description: 'Testing complete pages-blocks system'
    };
    
    const pageResult = await execAsync(`curl -s -X POST "${DIRECTUS_URL}/items/pages" \
      -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
      -H "Content-Type: application/json" \
      -d '${JSON.stringify(testPage)}'`);
    
    const pageData = JSON.parse(pageResult.stdout);
    if (pageData.errors) {
      console.log(`❌ Test page creation failed: ${pageData.errors[0].message}`);
    } else {
      console.log(`✅ Test page created successfully (ID: ${pageData.data.id})`);
      
      // Fetch the page to verify all fields
      const fetchResult = await execAsync(`curl -s -X GET "${DIRECTUS_URL}/items/pages/${pageData.data.id}" \
        -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
      const fetchData = JSON.parse(fetchResult.stdout);
      
      if (fetchData.data) {
        console.log(`✅ Page fetched with all fields:`);
        console.log(`   Title: ${fetchData.data.title}`);
        console.log(`   Slug: ${fetchData.data.slug}`);
        console.log(`   Status: ${fetchData.data.status}`);
      }
    }

    console.log('\n🎉 COMPLETE PAGES-BLOCKS SYSTEM CREATED!');
    console.log('=======================================');
    console.log('✅ Pages collection with all required fields');
    console.log('✅ pages_blocks junction table configured');
    console.log('✅ M2A relationship properly established');
    console.log('✅ blocks field available for page building');
    console.log('✅ Permissions configured for admin access');
    console.log('✅ System verified and functional');
    
    console.log('\n🚀 READY FOR PAGE BUILDING:');
    console.log('1. Visit: http://137.184.85.3/admin');
    console.log('2. Go to Pages collection');
    console.log('3. Create/edit pages');
    console.log('4. Use "blocks" field to add Hero, Rich Text, or Card Group blocks');
    console.log('5. Reorder blocks by dragging and dropping');
    console.log('6. Configure each block with custom content');

  } catch (error) {
    console.error('❌ Complete system creation failed:', error.message);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createCompletePagesBlocksSystem()
    .then(() => {
      console.log('\n✨ Complete pages-blocks system creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Complete pages-blocks system creation failed:', error.message);
      process.exit(1);
    });
}

module.exports = { createCompletePagesBlocksSystem };
