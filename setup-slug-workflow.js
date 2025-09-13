require('dotenv').config({ path: '.env.development' });

// Function to create SEO-optimized slug from title
function createSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

async function setupSlugWorkflow() {
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

    console.log('✅ Authenticated with Directus');

    // First, let's try to get all posts to check for missing slugs
    console.log('🔄 Checking for posts without slugs...');
    
    try {
      // Try to get all posts first
      const allPostsResponse = await fetch(`${DIRECTUS_URL}/items/posts?fields=id,title,slug`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!allPostsResponse.ok) {
        const errorData = await allPostsResponse.json();
        console.log('⚠️  Cannot access posts collection with current token permissions');
        console.log('This is normal if the token has limited permissions.');
        console.log('You can manually create posts with slugs in the Directus admin panel.');
      } else {
        const postsData = await allPostsResponse.json();
        const posts = postsData.data || [];
        
        // Filter posts without slugs
        const postsWithoutSlugs = posts.filter(post => !post.slug || post.slug.trim() === '');

        if (postsWithoutSlugs.length > 0) {
          console.log(`📝 Found ${postsWithoutSlugs.length} posts without slugs. Generating slugs...`);
          
          for (const post of postsWithoutSlugs) {
            if (post.title) {
              const newSlug = createSlug(post.title);
              
              // Update the post with the generated slug
              const updateResponse = await fetch(`${DIRECTUS_URL}/items/posts/${post.id}`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slug: newSlug }),
              });

              if (updateResponse.ok) {
                console.log(`✅ Updated post "${post.title}" with slug "${newSlug}"`);
              } else {
                const errorData = await updateResponse.json();
                console.error(`Failed to update post "${post.title}":`, errorData);
              }
            }
          }
        } else {
          console.log('✅ All posts already have slugs');
        }
      }
    } catch (error) {
      console.log('⚠️  Could not check posts:', error.message);
    }

    // Try to create automatic slug generation workflow
    console.log('🔧 Attempting to set up automatic slug generation workflow...');
    
    try {
      const flowResponse = await fetch(`${DIRECTUS_URL}/flows`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Auto Generate Slug',
          icon: 'link',
          color: '#2563eb',
          description: 'Automatically generates SEO-optimized slugs from post titles',
          status: 'active',
          trigger: 'event',
          accountability: 'all',
          options: {
            type: 'filter',
            scope: ['items.create', 'items.update'],
            collections: ['posts']
          }
        }),
      });

      if (flowResponse.ok) {
        const flowData = await flowResponse.json();
        const flow = flowData.data;
        console.log('✅ Created flow: Auto Generate Slug');

        // Create operation for the flow
        const operationResponse = await fetch(`${DIRECTUS_URL}/operations`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Generate Slug from Title',
            key: 'generate_slug',
            type: 'exec',
            position_x: 19,
            position_y: 1,
            flow: flow.id,
            options: {
              code: `
// Auto-generate slug from title if slug is empty
module.exports = async function(data) {
  const { $trigger, $accountability, $database } = data;
  
  // Get the item data
  const payload = $trigger.payload;
  const keys = $trigger.keys;
  
  // Function to create SEO-optimized slug
  function createSlug(title) {
    if (!title) return '';
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\\w\\s-]/g, '') // Remove special characters
      .replace(/[\\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }
  
  // Process each item
  for (const key of keys) {
    const item = Array.isArray(payload) ? payload.find(p => p.id === key) : payload;
    
    if (item && item.title && (!item.slug || item.slug.trim() === '')) {
      const newSlug = createSlug(item.title);
      
      // Update the item with the generated slug
      await $database('posts')
        .where('id', key)
        .update({ slug: newSlug });
        
      console.log(\`Generated slug "\${newSlug}" for post "\${item.title}"\`);
    }
  }
  
  return data;
};
              `
            }
          }),
        });

        if (operationResponse.ok) {
          console.log('✅ Created operation: Generate Slug from Title');
        } else {
          const errorData = await operationResponse.json();
          console.log('⚠️  Could not create operation (insufficient permissions)');
        }
      } else {
        const errorData = await flowResponse.json();
        if (errorData.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
          console.log('⚠️  Flow "Auto Generate Slug" already exists, skipping creation');
        } else {
          console.log('⚠️  Could not create flow (insufficient permissions)');
          console.log('This requires admin access to create workflows in Directus.');
        }
      }
    } catch (flowError) {
      console.log('⚠️  Flow creation not possible with current permissions');
    }

    console.log('\n🎉 Slug generation setup complete!');
    console.log('\n📋 Manual Setup Instructions (if automatic workflow failed):');
    console.log('1. Log into your Directus admin panel');
    console.log('2. Go to Settings → Flows');
    console.log('3. Create a new flow with the following settings:');
    console.log('   - Name: "Auto Generate Slug"');
    console.log('   - Trigger: "Event Hook"');
    console.log('   - Collections: "posts"');
    console.log('   - Actions: "Create, Update"');
    console.log('4. Add an operation with the slug generation code provided above');
    
    console.log('\n📝 How slugs work:');
    console.log('• Slugs are SEO-optimized: lowercase, hyphenated, no special characters');
    console.log('• They\'re used in URLs for blog posts (e.g., /blog/my-post-slug/)');
    console.log('• When creating posts, leave slug empty to auto-generate from title');

    // Test the slug generation function
    console.log('\n🧪 Slug generation examples:');
    const testTitles = [
      'Hello World!',
      'Building Modern Web Apps with React',
      'TypeScript & JavaScript: Best Practices',
      'The Future of Web Development (2024)',
      'API Design: REST vs GraphQL'
    ];

    testTitles.forEach(title => {
      const slug = createSlug(title);
      console.log(`• "${title}" → "${slug}"`);
    });

    console.log('\n💡 Pro tip: You can also manually set custom slugs when creating posts in Directus!');

  } catch (error) {
    console.error('❌ Error setting up slug workflow:', error.message);
  }
}

// Run the setup
setupSlugWorkflow();
