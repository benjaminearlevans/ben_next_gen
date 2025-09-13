const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:8001';
const DIRECTUS_URL = 'http://137.184.85.3:8055';
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN || 'your-token-here';

const directusApi = axios.create({
  baseURL: `${DIRECTUS_URL}/`,
  headers: {
    'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function testAllUrls() {
  try {
    console.log('🧪 Testing all site URLs and functionality...\n');

    // Test static pages
    const staticPages = [
      { url: '/', name: 'Homepage' },
      { url: '/blog/', name: 'Blog Page' },
      { url: '/speaking/', name: 'Speaking Page' },
      { url: '/podcast/', name: 'Podcast Page' }
    ];

    console.log('📄 Testing Static Pages:');
    for (const page of staticPages) {
      try {
        const response = await axios.get(`${BASE_URL}${page.url}`);
        console.log(`✓ ${page.name} (${page.url}) - Status: ${response.status}`);
      } catch (error) {
        console.log(`✗ ${page.name} (${page.url}) - Error: ${error.response?.status || error.message}`);
      }
    }

    // Get all posts from Directus to test dynamic URLs
    console.log('\n🔍 Fetching posts from Directus...');
    const postsResponse = await directusApi.get('/items/post?filter[status][_eq]=published');
    const posts = postsResponse.data.data;

    console.log(`Found ${posts.length} published posts\n`);

    // Test dynamic post URLs by type
    const postsByType = {
      article: posts.filter(p => p.type === 'article'),
      speaking: posts.filter(p => p.type === 'speaking'),
      podcast: posts.filter(p => p.type === 'podcast')
    };

    console.log('📝 Testing Article URLs:');
    for (const post of postsByType.article) {
      const url = `/blog/${post.slug}/`;
      try {
        const response = await axios.get(`${BASE_URL}${url}`);
        console.log(`✓ "${post.title}" (${url}) - Status: ${response.status}`);
      } catch (error) {
        console.log(`✗ "${post.title}" (${url}) - Error: ${error.response?.status || error.message}`);
      }
    }

    console.log('\n🎤 Testing Speaking URLs:');
    for (const post of postsByType.speaking) {
      const url = `/speaking/${post.slug}/`;
      try {
        const response = await axios.get(`${BASE_URL}${url}`);
        console.log(`✓ "${post.title}" (${url}) - Status: ${response.status}`);
      } catch (error) {
        console.log(`✗ "${post.title}" (${url}) - Error: ${error.response?.status || error.message}`);
      }
    }

    console.log('\n🎧 Testing Podcast URLs:');
    for (const post of postsByType.podcast) {
      const url = `/podcast/${post.slug}/`;
      try {
        const response = await axios.get(`${BASE_URL}${url}`);
        console.log(`✓ "${post.title}" (${url}) - Status: ${response.status}`);
      } catch (error) {
        console.log(`✗ "${post.title}" (${url}) - Error: ${error.response?.status || error.message}`);
      }
    }

    // Test 404 handling
    console.log('\n🚫 Testing 404 Handling:');
    const notFoundUrls = [
      '/nonexistent-page/',
      '/blog/nonexistent-post/',
      '/speaking/nonexistent-talk/',
      '/podcast/nonexistent-episode/'
    ];

    for (const url of notFoundUrls) {
      try {
        const response = await axios.get(`${BASE_URL}${url}`);
        console.log(`⚠ ${url} - Expected 404 but got: ${response.status}`);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`✓ ${url} - Correctly returns 404`);
        } else {
          console.log(`✗ ${url} - Unexpected error: ${error.response?.status || error.message}`);
        }
      }
    }

    console.log('\n📊 Test Summary:');
    console.log(`- Static pages: ${staticPages.length} tested`);
    console.log(`- Article posts: ${postsByType.article.length} tested`);
    console.log(`- Speaking posts: ${postsByType.speaking.length} tested`);
    console.log(`- Podcast posts: ${postsByType.podcast.length} tested`);
    console.log(`- 404 handling: ${notFoundUrls.length} tested`);
    console.log(`- Total URLs tested: ${staticPages.length + posts.length + notFoundUrls.length}`);

    console.log('\n🎉 URL testing complete!');
    console.log('\nNext steps:');
    console.log('1. Open http://localhost:8001 in your browser');
    console.log('2. Navigate through all pages using the menu');
    console.log('3. Click on individual posts to test templates');
    console.log('4. Test responsive design on mobile/tablet');

  } catch (error) {
    console.error('Error during URL testing:', error.response?.data || error.message);
  }
}

// Run the tests
testAllUrls();
