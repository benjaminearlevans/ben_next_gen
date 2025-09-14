const axios = require('axios');

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://137.184.85.3';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || '_wkaWodWWha8H1Q5txNZnCrhAKLYRPuj';

const api = axios.create({
  baseURL: `${DIRECTUS_URL}`,
  headers: {
    'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function addSampleData() {
  try {
    console.log('🚀 Adding sample data to Directus collections...\n');

    // Add site settings
    console.log('📝 Adding site settings...');
    try {
      await api.post('/items/site_settings', {
        site_title: 'Benjamin Carlson',
        site_description: 'Developer, speaker, and content creator passionate about building great web experiences.',
        hero_title: "Hi, I'm Benjamin Carlson",
        hero_subtitle: "I'm a developer, speaker, and content creator passionate about building great web experiences.",
        hero_cta_primary_text: 'Read My Blog',
        hero_cta_primary_url: '/blog/',
        hero_cta_secondary_text: 'Get in Touch',
        hero_cta_secondary_url: '/contact/',
        status: 'published'
      });
      console.log('✅ Site settings added');
    } catch (error) {
      console.log('ℹ️ Site settings may already exist');
    }

    // Add navigation items
    console.log('📝 Adding navigation items...');
    const navItems = [
      { label: 'Blog', url: '/blog/', is_external: false, is_cta: false, sort_order: 1, status: 'published' },
      { label: 'Speaking', url: '/speaking/', is_external: false, is_cta: false, sort_order: 2, status: 'published' },
      { label: 'Podcast', url: '/podcast/', is_external: false, is_cta: false, sort_order: 3, status: 'published' },
      { label: 'Contact', url: '/contact/', is_external: false, is_cta: true, sort_order: 4, status: 'published' }
    ];

    for (const item of navItems) {
      try {
        await api.post('/items/navigation', item);
        console.log(`✅ Navigation item "${item.label}" added`);
      } catch (error) {
        console.log(`ℹ️ Navigation item "${item.label}" may already exist`);
      }
    }

    // Add companies
    console.log('📝 Adding companies...');
    const companies = [
      { name: 'Adobe', website_url: 'https://adobe.com', status: 'published' },
      { name: 'Microsoft', website_url: 'https://microsoft.com', status: 'published' },
      { name: 'Google', website_url: 'https://google.com', status: 'published' },
      { name: 'Shopify', website_url: 'https://shopify.com', status: 'published' },
      { name: 'Stripe', website_url: 'https://stripe.com', status: 'published' }
    ];

    for (const company of companies) {
      try {
        await api.post('/items/companies', company);
        console.log(`✅ Company "${company.name}" added`);
      } catch (error) {
        console.log(`ℹ️ Company "${company.name}" may already exist`);
      }
    }

    // Add blog posts
    console.log('📝 Adding blog posts...');
    const posts = [
      {
        title: 'Getting Started with Gatsby and Directus',
        slug: 'gatsby-directus-guide',
        excerpt: 'Learn how to build a modern website with Gatsby and Directus CMS.',
        content: 'This is a comprehensive guide to building modern websites with Gatsby and Directus...',
        type: 'article',
        status: 'published',
        date_created: new Date('2024-01-15').toISOString(),
        date_updated: new Date('2024-01-15').toISOString()
      },
      {
        title: 'Building Dynamic Search with Algolia',
        slug: 'algolia-search-integration',
        excerpt: 'Implement powerful search functionality in your Gatsby site.',
        content: 'Algolia provides powerful search capabilities for modern web applications...',
        type: 'article',
        status: 'published',
        date_created: new Date('2024-01-10').toISOString(),
        date_updated: new Date('2024-01-10').toISOString()
      },
      {
        title: 'Modern Web Development Practices',
        slug: 'modern-web-dev-podcast',
        excerpt: 'Discussion about the latest trends in web development.',
        content: 'In this podcast episode, we explore the latest trends and best practices...',
        type: 'podcast',
        status: 'published',
        date_created: new Date('2024-01-05').toISOString(),
        date_updated: new Date('2024-01-05').toISOString()
      }
    ];

    for (const post of posts) {
      try {
        await api.post('/items/post', post);
        console.log(`✅ Post "${post.title}" added`);
      } catch (error) {
        console.log(`ℹ️ Post "${post.title}" may already exist`);
      }
    }

    // Add speaking engagements
    console.log('📝 Adding speaking engagements...');
    const speakingEvents = [
      {
        title: 'Building Inclusive Design Systems',
        event_name: 'Design Systems Conference 2024',
        event_url: 'https://designsystems.com',
        description: 'A talk about creating accessible and inclusive design systems for modern web applications.',
        date: new Date('2024-03-15').toISOString(),
        status: 'published'
      },
      {
        title: 'The Future of Web Development',
        event_name: 'Web Summit 2024',
        event_url: 'https://websummit.com',
        description: 'Exploring emerging technologies and trends shaping the future of web development.',
        date: new Date('2024-02-20').toISOString(),
        status: 'published'
      }
    ];

    for (const event of speakingEvents) {
      try {
        await api.post('/items/speaking', event);
        console.log(`✅ Speaking event "${event.title}" added`);
      } catch (error) {
        console.log(`ℹ️ Speaking event "${event.title}" may already exist`);
      }
    }

    // Get first post for featured posts
    console.log('📝 Adding featured posts...');
    try {
      const firstPost = await api.get('/items/post?filter[type][_eq]=article&limit=1');

      if (firstPost.data && firstPost.data.data && firstPost.data.data.length > 0) {
        await api.post('/items/featured_posts', {
          post: firstPost.data.data[0].id,
          sort_order: 1,
          status: 'published'
        });
        console.log('✅ Featured post added');
      }
    } catch (error) {
      console.log('ℹ️ Featured post may already exist or posts not available');
    }

    console.log('\n🎉 Sample data added successfully!');
    console.log('📋 Summary:');
    console.log('   - Site settings configured');
    console.log('   - Navigation items added');
    console.log('   - Companies added');
    console.log('   - Blog posts and podcast episodes added');
    console.log('   - Speaking engagements added');
    console.log('   - Featured posts configured');

  } catch (error) {
    console.error('❌ Error adding sample data:', error.message);
    process.exit(1);
  }
}

// Run the script
addSampleData();
