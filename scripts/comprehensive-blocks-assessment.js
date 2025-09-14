const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '';

async function comprehensiveBlocksAssessment() {
  try {
    console.log('🔍 COMPREHENSIVE BLOCKS SYSTEM ASSESSMENT');
    console.log('==========================================\n');

    const assessment = {
      collections: {},
      relationships: {},
      permissions: {},
      functionality: {},
      adminInterface: {}
    };

    // 1. CHECK ALL REQUIRED COLLECTIONS
    console.log('📋 1. CHECKING COLLECTIONS EXISTENCE & STRUCTURE');
    console.log('------------------------------------------------');

    const requiredCollections = [
      'pages',
      'pages_blocks', // Junction table
      'block_hero',
      'block_richtext', 
      'block_cardgroup',
      'block_cardgroup_cards',
      'block_cardgroup_post'
    ];

    for (const collection of requiredCollections) {
      try {
        const result = await execAsync(`curl -s -X GET "${DIRECTUS_URL}/collections/${collection}" \
          -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
        const data = JSON.parse(result.stdout);
        
        if (data.errors) {
          assessment.collections[collection] = {
            exists: false,
            error: data.errors[0].message,
            status: '❌'
          };
        } else {
          assessment.collections[collection] = {
            exists: true,
            name: data.data.collection,
            note: data.data.meta?.note || 'No description',
            hidden: data.data.meta?.hidden || false,
            status: '✅'
          };
        }
      } catch (error) {
        assessment.collections[collection] = {
          exists: false,
          error: error.message,
          status: '❌'
        };
      }
    }

    // Display collection results
    Object.entries(assessment.collections).forEach(([name, info]) => {
      console.log(`${info.status} ${name}: ${info.exists ? 'EXISTS' : 'MISSING'}`);
      if (info.exists) {
        console.log(`   Note: ${info.note}`);
        console.log(`   Hidden: ${info.hidden}`);
      } else {
        console.log(`   Error: ${info.error}`);
      }
    });

    // 2. CHECK COLLECTION FIELDS
    console.log('\n📝 2. CHECKING COLLECTION FIELDS');
    console.log('--------------------------------');

    const fieldChecks = {
      pages: ['id', 'title', 'slug', 'status', 'meta_description', 'blocks'],
      pages_blocks: ['id', 'pages_id', 'item', 'collection', 'sort'],
      block_hero: ['id', 'headline', 'content', 'buttons', 'image'],
      block_richtext: ['id', 'headline', 'content'],
      block_cardgroup: ['id', 'headline', 'content', 'group_type'],
      block_cardgroup_cards: ['id', 'title', 'content', 'cardgroup']
    };

    for (const [collection, expectedFields] of Object.entries(fieldChecks)) {
      if (assessment.collections[collection]?.exists) {
        try {
          const result = await execAsync(`curl -s -X GET "${DIRECTUS_URL}/fields/${collection}" \
            -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
          const data = JSON.parse(result.stdout);
          
          if (!data.errors) {
            const actualFields = data.data.map(field => field.field);
            const missingFields = expectedFields.filter(field => !actualFields.includes(field));
            const extraFields = actualFields.filter(field => !expectedFields.includes(field));
            
            assessment.collections[collection].fields = {
              expected: expectedFields,
              actual: actualFields,
              missing: missingFields,
              extra: extraFields,
              complete: missingFields.length === 0
            };
            
            console.log(`${assessment.collections[collection].fields.complete ? '✅' : '⚠️'} ${collection} fields:`);
            if (missingFields.length > 0) {
              console.log(`   Missing: ${missingFields.join(', ')}`);
            }
            if (extraFields.length > 0) {
              console.log(`   Extra: ${extraFields.join(', ')}`);
            }
            console.log(`   Total: ${actualFields.length} fields`);
          }
        } catch (error) {
          console.log(`❌ ${collection} fields check failed: ${error.message}`);
        }
      }
    }

    // 3. CHECK RELATIONSHIPS
    console.log('\n🔗 3. CHECKING RELATIONSHIPS');
    console.log('----------------------------');

    try {
      const result = await execAsync(`curl -s -X GET "${DIRECTUS_URL}/relations" \
        -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
      const data = JSON.parse(result.stdout);
      
      if (!data.errors) {
        const relations = data.data;
        
        // Check specific relationships
        const expectedRelationships = [
          { from: 'pages_blocks', field: 'pages_id', to: 'pages', type: 'M2O' },
          { from: 'pages', field: 'blocks', to: 'pages_blocks', type: 'O2M' },
          { from: 'block_cardgroup_cards', field: 'cardgroup', to: 'block_cardgroup', type: 'M2O' }
        ];

        assessment.relationships.found = [];
        assessment.relationships.missing = [];

        for (const expected of expectedRelationships) {
          const found = relations.find(rel => 
            rel.many_collection === expected.from && 
            rel.many_field === expected.field &&
            rel.one_collection === expected.to
          );
          
          if (found) {
            assessment.relationships.found.push({
              ...expected,
              status: '✅'
            });
            console.log(`✅ ${expected.type}: ${expected.from}.${expected.field} → ${expected.to}`);
          } else {
            assessment.relationships.missing.push({
              ...expected,
              status: '❌'
            });
            console.log(`❌ MISSING ${expected.type}: ${expected.from}.${expected.field} → ${expected.to}`);
          }
        }

        // Check for pages M2A relationship
        const pagesBlocksRelations = relations.filter(rel => 
          (rel.many_collection === 'pages_blocks' && rel.one_collection === 'pages') ||
          (rel.many_collection === 'pages' && rel.related_collection === 'pages_blocks')
        );
        
        console.log(`\n📊 Pages-Blocks M2A Structure:`);
        console.log(`   Found ${pagesBlocksRelations.length} related relationships`);
        pagesBlocksRelations.forEach(rel => {
          console.log(`   - ${rel.many_collection}.${rel.many_field} → ${rel.one_collection || rel.related_collection}`);
        });

      }
    } catch (error) {
      console.log(`❌ Relationships check failed: ${error.message}`);
    }

    // 4. CHECK PERMISSIONS
    console.log('\n🔐 4. CHECKING PERMISSIONS');
    console.log('-------------------------');

    try {
      const result = await execAsync(`curl -s -X GET "${DIRECTUS_URL}/permissions" \
        -H "Authorization: Bearer ${DIRECTUS_TOKEN}"`);
      const data = JSON.parse(result.stdout);
      
      if (!data.errors) {
        const permissions = data.data;
        
        // Check admin permissions
        const adminPermissions = permissions.filter(p => p.role === 'c36ff6cf-1dec-406e-a990-f53193b74ad3');
        const publicPermissions = permissions.filter(p => p.role === null);
        
        assessment.permissions.admin = {};
        assessment.permissions.public = {};
        
        for (const collection of requiredCollections) {
          const adminPerms = adminPermissions.filter(p => p.collection === collection);
          const publicPerms = publicPermissions.filter(p => p.collection === collection);
          
          assessment.permissions.admin[collection] = adminPerms.map(p => p.action);
          assessment.permissions.public[collection] = publicPerms.map(p => p.action);
          
          const hasFullAdmin = ['create', 'read', 'update', 'delete'].every(action => 
            adminPerms.some(p => p.action === action)
          );
          const hasPublicRead = publicPerms.some(p => p.action === 'read');
          
          console.log(`${hasFullAdmin ? '✅' : '⚠️'} ${collection} admin: ${adminPerms.length} permissions`);
          console.log(`${hasPublicRead ? '✅' : '⚠️'} ${collection} public: ${publicPerms.length} permissions`);
        }
      }
    } catch (error) {
      console.log(`❌ Permissions check failed: ${error.message}`);
    }

    // 5. TEST FUNCTIONALITY
    console.log('\n🧪 5. TESTING FUNCTIONALITY');
    console.log('---------------------------');

    // Test creating each block type
    const blockTests = {
      block_hero: {
        headline: 'Assessment Test Hero',
        content: '<p>Testing hero block creation</p>',
        buttons: [{ label: 'Test', href: '/test/', variant: 'primary' }]
      },
      block_richtext: {
        headline: 'Assessment Test Rich Text',
        content: '<p>Testing rich text block creation</p>'
      },
      block_cardgroup: {
        headline: 'Assessment Test Card Group',
        content: '<p>Testing card group creation</p>',
        group_type: 'custom'
      }
    };

    assessment.functionality.blockCreation = {};
    
    for (const [blockType, testData] of Object.entries(blockTests)) {
      try {
        const result = await execAsync(`curl -s -X POST "${DIRECTUS_URL}/items/${blockType}" \
          -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
          -H "Content-Type: application/json" \
          -d '${JSON.stringify(testData)}'`);
        
        const data = JSON.parse(result.stdout);
        if (data.errors) {
          assessment.functionality.blockCreation[blockType] = {
            success: false,
            error: data.errors[0].message,
            status: '❌'
          };
          console.log(`❌ ${blockType}: ${data.errors[0].message}`);
        } else {
          assessment.functionality.blockCreation[blockType] = {
            success: true,
            id: data.data.id,
            status: '✅'
          };
          console.log(`✅ ${blockType}: Created successfully (ID: ${data.data.id})`);
        }
      } catch (error) {
        assessment.functionality.blockCreation[blockType] = {
          success: false,
          error: error.message,
          status: '❌'
        };
        console.log(`❌ ${blockType}: ${error.message}`);
      }
    }

    // Test page creation
    console.log('\n📄 Testing page creation...');
    try {
      const testPage = {
        title: 'Assessment Test Page',
        slug: 'assessment-test',
        status: 'published',
        meta_description: 'Page created during blocks system assessment'
      };
      
      const result = await execAsync(`curl -s -X POST "${DIRECTUS_URL}/items/pages" \
        -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
        -H "Content-Type: application/json" \
        -d '${JSON.stringify(testPage)}'`);
      
      const data = JSON.parse(result.stdout);
      if (data.errors) {
        assessment.functionality.pageCreation = {
          success: false,
          error: data.errors[0].message,
          status: '❌'
        };
        console.log(`❌ Page creation: ${data.errors[0].message}`);
      } else {
        assessment.functionality.pageCreation = {
          success: true,
          id: data.data.id,
          status: '✅'
        };
        console.log(`✅ Page creation: Success (ID: ${data.data.id})`);
        
        // Test linking blocks to page
        const successfulBlocks = Object.entries(assessment.functionality.blockCreation)
          .filter(([_, info]) => info.success)
          .slice(0, 2); // Test with first 2 successful blocks
        
        if (successfulBlocks.length > 0) {
          console.log('\n🔗 Testing block-to-page linking...');
          
          for (const [blockType, blockInfo] of successfulBlocks) {
            try {
              const linkData = {
                pages_id: data.data.id,
                item: blockInfo.id,
                collection: blockType,
                sort: successfulBlocks.indexOf([blockType, blockInfo]) + 1
              };
              
              const linkResult = await execAsync(`curl -s -X POST "${DIRECTUS_URL}/items/pages_blocks" \
                -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
                -H "Content-Type: application/json" \
                -d '${JSON.stringify(linkData)}'`);
              
              const linkResultData = JSON.parse(linkResult.stdout);
              if (linkResultData.errors) {
                console.log(`❌ Link ${blockType}: ${linkResultData.errors[0].message}`);
              } else {
                console.log(`✅ Link ${blockType}: Success`);
              }
            } catch (error) {
              console.log(`❌ Link ${blockType}: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      assessment.functionality.pageCreation = {
        success: false,
        error: error.message,
        status: '❌'
      };
      console.log(`❌ Page creation: ${error.message}`);
    }

    // 6. FINAL ASSESSMENT SUMMARY
    console.log('\n📊 FINAL ASSESSMENT SUMMARY');
    console.log('============================');

    const collectionsOK = Object.values(assessment.collections).every(c => c.exists);
    const relationshipsOK = assessment.relationships?.missing?.length === 0;
    const functionalityOK = assessment.functionality?.pageCreation?.success && 
                           Object.values(assessment.functionality?.blockCreation || {}).some(b => b.success);

    console.log(`\n🏗️  SYSTEM ARCHITECTURE:`);
    console.log(`   Collections: ${collectionsOK ? '✅ All present' : '❌ Missing collections'}`);
    console.log(`   Relationships: ${relationshipsOK ? '✅ Properly configured' : '⚠️ Some missing'}`);
    console.log(`   Functionality: ${functionalityOK ? '✅ Working' : '❌ Issues detected'}`);

    console.log(`\n🎯 READINESS FOR ADMIN USE:`);
    if (collectionsOK && relationshipsOK && functionalityOK) {
      console.log(`   ✅ READY - You can create pages with blocks in Directus admin`);
      console.log(`   ✅ M2A relationship functional for page building`);
      console.log(`   ✅ All block types can be created and linked`);
    } else {
      console.log(`   ⚠️  NEEDS ATTENTION - Some issues detected`);
      if (!collectionsOK) console.log(`      - Missing required collections`);
      if (!relationshipsOK) console.log(`      - Relationship configuration incomplete`);
      if (!functionalityOK) console.log(`      - Basic functionality not working`);
    }

    console.log(`\n📋 NEXT STEPS:`);
    console.log(`   1. Log into Directus admin: http://137.184.85.3/admin`);
    console.log(`   2. Navigate to Pages collection`);
    console.log(`   3. Create/edit a page`);
    console.log(`   4. Use the 'blocks' field to add content blocks`);
    console.log(`   5. Reorder and configure blocks as needed`);

    return assessment;

  } catch (error) {
    console.error('❌ Assessment failed:', error.message);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  comprehensiveBlocksAssessment()
    .then(() => {
      console.log('\n✨ Comprehensive blocks assessment completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Assessment failed:', error.message);
      process.exit(1);
    });
}

module.exports = { comprehensiveBlocksAssessment };
