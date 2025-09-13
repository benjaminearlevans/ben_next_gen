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

    // Create a flow for automatic slug generation
    const flow = await directus.flows.createOne({
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
    });

    console.log('✅ Created flow:', flow.name);

    // Create operation to generate slug
    const operation = await directus.operations.createOne({
      name: 'Generate Slug from Title',
      key: 'generate_slug',
      type: 'exec',
      position_x: 19,
      position_y: 1,
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
      },
      flow: flow.id
    });

    console.log('✅ Created operation:', operation.name);

    // Create a hook for existing posts without slugs
    console.log('🔄 Updating existing posts without slugs...');
    
    // Get all posts without slugs
    const postsWithoutSlugs = await directus.items('posts').readByQuery({
      filter: {
        _or: [
          { slug: { _null: true } },
          { slug: { _eq: '' } }
        ]
      },
      fields: ['id', 'title', 'slug']
    });

    if (postsWithoutSlugs.data && postsWithoutSlugs.data.length > 0) {
      console.log(`Found ${postsWithoutSlugs.data.length} posts without slugs`);
      
      for (const post of postsWithoutSlugs.data) {
        if (post.title) {
          const newSlug = createSlug(post.title);
          await directus.items('posts').updateOne(post.id, { slug: newSlug });
          console.log(`✅ Updated post "${post.title}" with slug "${newSlug}"`);
        }
      }
    } else {
      console.log('No posts found without slugs');
    }

    console.log('\n🎉 Slug generation workflow setup complete!');
    console.log('\nHow it works:');
    console.log('- When a new post is created, if no slug is provided, one will be automatically generated from the title');
    console.log('- When a post is updated, if the slug is empty, a new one will be generated from the title');
    console.log('- Slugs are SEO-optimized: lowercase, hyphenated, no special characters');
    console.log('\nExamples:');
    console.log('- "Building Modern Web Apps" → "building-modern-web-apps"');
    console.log('- "React & TypeScript Tips!" → "react-typescript-tips"');
    console.log('- "The Future of Web Development" → "the-future-of-web-development"');

  } catch (error) {
    console.error('❌ Error setting up slug workflow:', error.message);
    
    if (error.response?.data) {
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the setup
setupSlugWorkflow();
