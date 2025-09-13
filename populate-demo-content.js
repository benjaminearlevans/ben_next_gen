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

async function populateDemoContent() {
  try {
    console.log('Populating site with demo content...');

    // Demo Article Posts
    const articlePosts = [
      {
        title: 'The Evolution of Design Systems in 2024',
        slug: 'evolution-design-systems-2024',
        content: `<h2>Introduction</h2>
<p>Design systems have become the backbone of modern digital product development. As we move through 2024, we're seeing unprecedented changes in how teams approach scalable design.</p>

<h2>Key Trends</h2>
<p>The most significant trend is the shift toward <strong>component-driven development</strong>. Teams are no longer just creating style guides—they're building living, breathing ecosystems that evolve with their products.</p>

<h3>Automation and AI Integration</h3>
<p>AI is revolutionizing how we maintain design systems. From automated accessibility testing to intelligent component suggestions, the future is here.</p>

<h3>Cross-Platform Consistency</h3>
<p>With the rise of multi-platform experiences, design systems must now seamlessly translate across web, mobile, and emerging platforms like AR/VR.</p>

<h2>Best Practices</h2>
<ul>
<li>Start with user needs, not components</li>
<li>Build for flexibility and scalability</li>
<li>Invest in documentation and governance</li>
<li>Measure impact and iterate continuously</li>
</ul>

<p>The future of design systems lies in their ability to adapt and evolve with changing user expectations and technological capabilities.</p>`,
        excerpt: 'Exploring how design systems are evolving in 2024, from AI integration to cross-platform consistency.',
        type: 'article',
        status: 'published'
      },
      {
        title: 'Building Inclusive Design Teams',
        slug: 'building-inclusive-design-teams',
        content: `<h2>The Foundation of Inclusive Design</h2>
<p>Creating truly inclusive products starts with building inclusive teams. Diversity in perspectives, backgrounds, and experiences directly translates to better user outcomes.</p>

<h2>Hiring for Diversity</h2>
<p>Inclusive hiring isn't just about demographics—it's about creating processes that welcome different ways of thinking and problem-solving.</p>

<h3>Practical Steps</h3>
<ol>
<li><strong>Audit your job descriptions</strong> - Remove unnecessary requirements that might exclude qualified candidates</li>
<li><strong>Expand your sourcing</strong> - Partner with organizations that support underrepresented groups</li>
<li><strong>Structured interviews</strong> - Use consistent evaluation criteria to reduce bias</li>
</ol>

<h2>Creating Psychological Safety</h2>
<p>Once you have a diverse team, the real work begins. Psychological safety is crucial for team members to bring their authentic selves to work.</p>

<blockquote>
<p>"The best teams are those where everyone feels safe to take risks, make mistakes, and share their unique perspectives."</p>
</blockquote>

<h2>Measuring Success</h2>
<p>Track both quantitative metrics (representation, retention) and qualitative feedback (belonging, psychological safety surveys).</p>`,
        excerpt: 'A comprehensive guide to building and maintaining inclusive design teams that create better products for everyone.',
        type: 'article',
        status: 'published'
      },
      {
        title: 'The Future of Remote Design Collaboration',
        slug: 'future-remote-design-collaboration',
        content: `<h2>The New Normal</h2>
<p>Remote work has fundamentally changed how design teams collaborate. What started as a temporary adjustment has become a permanent shift in how we work.</p>

<h2>Tools and Technologies</h2>
<p>The tools we use for remote collaboration have evolved rapidly:</p>

<h3>Design Tools</h3>
<ul>
<li><strong>Figma</strong> - Real-time collaboration and commenting</li>
<li><strong>Miro</strong> - Virtual whiteboarding and workshops</li>
<li><strong>Notion</strong> - Documentation and knowledge sharing</li>
</ul>

<h3>Communication Platforms</h3>
<p>Beyond Slack and Zoom, teams are experimenting with asynchronous video tools like Loom and spatial audio platforms for more natural conversations.</p>

<h2>Challenges and Solutions</h2>
<p>Remote collaboration isn't without its challenges:</p>

<h3>Time Zone Differences</h3>
<p>Solution: Embrace asynchronous work and document everything. Create overlap hours for critical discussions.</p>

<h3>Lack of Spontaneous Interaction</h3>
<p>Solution: Schedule informal "coffee chats" and use always-on video channels for casual conversations.</p>

<h2>The Hybrid Future</h2>
<p>Most teams are settling into hybrid models that combine the best of remote and in-person collaboration. The key is being intentional about when and how you bring people together.</p>`,
        excerpt: 'Exploring how remote work has transformed design collaboration and what the future holds for distributed teams.',
        type: 'article',
        status: 'published'
      }
    ];

    // Demo Speaking Posts
    const speakingPosts = [
      {
        title: 'Design Systems at Scale: Lessons from the Trenches',
        slug: 'design-systems-scale-lessons',
        content: `<p>In this talk, I share hard-won lessons from building and scaling design systems at companies ranging from startups to Fortune 500 enterprises.</p>

<h2>Key Takeaways</h2>
<ul>
<li>How to get organizational buy-in for design systems</li>
<li>Technical strategies for maintaining consistency across platforms</li>
<li>Building a community around your design system</li>
<li>Measuring the ROI of design system investments</li>
</ul>

<p>This presentation includes real-world case studies, practical frameworks, and actionable advice you can implement immediately.</p>`,
        excerpt: 'A deep dive into scaling design systems across organizations, with practical lessons and real-world case studies.',
        type: 'speaking',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        event_name: 'Design Systems Conference 2024',
        event_date: '2024-03-15',
        status: 'published'
      },
      {
        title: 'The Psychology of User Interface Design',
        slug: 'psychology-ui-design',
        content: `<p>Understanding human psychology is crucial for creating interfaces that feel intuitive and delightful. This talk explores the cognitive principles that make great UI design work.</p>

<h2>Topics Covered</h2>
<ul>
<li>Cognitive load theory and interface complexity</li>
<li>The role of mental models in user experience</li>
<li>Emotional design and user engagement</li>
<li>Accessibility through the lens of cognitive science</li>
</ul>

<p>Attendees will learn practical techniques for applying psychological principles to their design work, backed by research and real-world examples.</p>`,
        excerpt: 'Exploring the intersection of psychology and interface design to create more intuitive user experiences.',
        type: 'speaking',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        event_name: 'UX Psychology Summit',
        event_date: '2024-01-20',
        status: 'published'
      },
      {
        title: 'Leading Design Teams Through Change',
        slug: 'leading-design-teams-change',
        content: `<p>Change is the only constant in technology. This keynote addresses how design leaders can guide their teams through organizational transformations, tool migrations, and shifting priorities.</p>

<h2>Framework for Change Management</h2>
<ol>
<li><strong>Communicate the why</strong> - Help your team understand the bigger picture</li>
<li><strong>Involve people in the solution</strong> - Don't just announce changes, co-create them</li>
<li><strong>Provide psychological safety</strong> - Make it safe to express concerns and ask questions</li>
<li><strong>Celebrate small wins</strong> - Acknowledge progress along the way</li>
</ol>

<p>Drawing from experiences leading teams through major transitions, this talk provides a roadmap for navigating change successfully.</p>`,
        excerpt: 'A leadership framework for guiding design teams through organizational change and transformation.',
        type: 'speaking',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        event_name: 'Design Leadership Forum',
        event_date: '2024-02-28',
        status: 'published'
      }
    ];

    // Demo Podcast Posts
    const podcastPosts = [
      {
        title: 'The Future of Design Education',
        slug: 'future-design-education-podcast',
        content: `<p>In this episode, we dive deep into how design education is evolving to meet the demands of an ever-changing industry.</p>

<h2>Discussion Points</h2>
<ul>
<li>The gap between academic design programs and industry needs</li>
<li>The rise of online learning and bootcamps</li>
<li>Skills that will be essential for future designers</li>
<li>How AI is changing what designers need to know</li>
</ul>

<p>We explore both the challenges and opportunities in design education, with insights from educators, students, and industry professionals.</p>

<h2>Guest Insights</h2>
<p>Our conversation covers everything from the importance of critical thinking skills to the role of hands-on experience in learning design.</p>`,
        excerpt: 'A thoughtful discussion about the evolution of design education and preparing the next generation of designers.',
        type: 'podcast',
        audio_url: 'https://example.com/podcast-design-education.mp3',
        podcast_name: 'Design Futures Podcast',
        duration: '52 minutes',
        status: 'published'
      },
      {
        title: 'Building Products That Matter',
        slug: 'building-products-matter-podcast',
        content: `<p>What does it mean to build products that truly matter? In this episode, we explore the intersection of business goals, user needs, and social impact.</p>

<h2>Key Topics</h2>
<ul>
<li>Defining "meaningful" in product development</li>
<li>Balancing profit with purpose</li>
<li>The role of ethics in design decisions</li>
<li>Measuring impact beyond traditional metrics</li>
</ul>

<p>This conversation challenges listeners to think beyond features and functionality to consider the broader impact of their work.</p>

<h2>Actionable Insights</h2>
<p>We discuss practical frameworks for evaluating product decisions through multiple lenses: user value, business impact, and societal benefit.</p>`,
        excerpt: 'Exploring what it means to create products that have genuine positive impact on users and society.',
        type: 'podcast',
        audio_url: 'https://example.com/podcast-products-matter.mp3',
        podcast_name: 'Product Philosophy',
        duration: '38 minutes',
        status: 'published'
      },
      {
        title: 'The Art and Science of User Research',
        slug: 'art-science-user-research-podcast',
        content: `<p>User research sits at the intersection of art and science. This episode explores how to balance rigorous methodology with creative insight generation.</p>

<h2>Research Methods Discussed</h2>
<ul>
<li>When to use qualitative vs. quantitative methods</li>
<li>The power of mixed-method approaches</li>
<li>Emerging techniques in remote research</li>
<li>AI-assisted research analysis</li>
</ul>

<p>We also dive into the softer skills that make great researchers: empathy, curiosity, and the ability to synthesize complex information into actionable insights.</p>

<h2>Practical Applications</h2>
<p>The conversation includes real examples of how research findings have shaped product decisions and influenced design direction.</p>`,
        excerpt: 'A deep dive into user research methodology, balancing scientific rigor with creative insight generation.',
        type: 'podcast',
        audio_url: 'https://example.com/podcast-user-research.mp3',
        podcast_name: 'Research & Design',
        duration: '45 minutes',
        status: 'published'
      }
    ];

    // Create all demo posts
    const allPosts = [...articlePosts, ...speakingPosts, ...podcastPosts];

    for (const post of allPosts) {
      try {
        await api.post('/items/post', post);
        console.log(`✓ Created ${post.type} post: ${post.title}`);
      } catch (error) {
        console.log(`⚠ Could not create post "${post.title}":`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    console.log('\n🎉 Demo content population complete!');
    console.log(`Created ${allPosts.length} demo posts:`);
    console.log(`- ${articlePosts.length} article posts`);
    console.log(`- ${speakingPosts.length} speaking posts`);
    console.log(`- ${podcastPosts.length} podcast posts`);

  } catch (error) {
    console.error('Error populating demo content:', error.response?.data || error.message);
  }
}

// Run the population
populateDemoContent();
