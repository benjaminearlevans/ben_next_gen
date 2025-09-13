# Gatsby + Directus Frontend

A modern, responsive frontend built with Gatsby that connects to a Directus CMS backend. This project provides a complete solution for building fast, SEO-friendly websites with content managed through Directus.

## Features

- 🚀 **Gatsby Static Site Generation** - Fast, optimized websites
- 📝 **Directus CMS Integration** - Flexible headless CMS
- 🎨 **Modern Responsive Design** - Beautiful UI that works on all devices
- 🖼️ **Image Optimization** - Automatic image processing with gatsby-plugin-image
- 📱 **Mobile-First Design** - Optimized for mobile and desktop
- 🔍 **SEO Optimized** - Built-in SEO best practices
- 📊 **GraphQL Data Layer** - Efficient data fetching

## Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- A running Directus instance
- Directus access token

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.development
```

Edit `.env.development` and add your Directus configuration:

```env
DIRECTUS_URL=http://localhost:8055
DIRECTUS_TOKEN=your_directus_access_token_here
```

### 3. Set Up Directus Collections

Your Directus instance should have the following collections:

#### Posts Collection (`posts`)
- `id` (Primary Key)
- `title` (String)
- `slug` (String, unique)
- `content` (Rich Text/HTML)
- `excerpt` (Text)
- `status` (String: draft, published)
- `featured_image` (File)
- `author` (Many-to-One relation to Users)
- `tags` (Many-to-Many relation to Tags)
- `date_created` (DateTime)

#### Pages Collection (`pages`)
- `id` (Primary Key)
- `title` (String)
- `slug` (String, unique)
- `content` (Rich Text/HTML)
- `status` (String: draft, published)
- `featured_image` (File)

#### Tags Collection (`tags`) - Optional
- `id` (Primary Key)
- `name` (String)

### 4. Start Development Server

```bash
npm run develop
```

Your site will be available at `http://localhost:8000`

## Available Scripts

- `npm run develop` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Serve production build locally
- `npm run clean` - Clean Gatsby cache

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── header.js       # Site header with navigation
│   ├── footer.js       # Site footer
│   ├── hero.js         # Hero section component
│   ├── layout.js       # Main layout wrapper
│   └── post-card.js    # Blog post card component
├── pages/              # Static pages
│   ├── index.js        # Homepage
│   └── blog.js         # Blog listing page
├── styles/             # CSS styles
│   └── global.css      # Global styles
└── templates/          # Dynamic page templates
    ├── blog-post.js    # Individual blog post template
    └── page.js         # Static page template
```

## Customization

### Styling

The project uses vanilla CSS with modern features. Styles are located in `src/styles/global.css`. The design system includes:

- CSS Grid and Flexbox layouts
- CSS Custom Properties (variables)
- Mobile-first responsive design
- Modern color palette and typography

### Adding New Content Types

To add new content types from Directus:

1. Create the collection in Directus
2. Add GraphQL queries in your components/pages
3. Create new page templates if needed
4. Update `gatsby-node.js` to generate pages dynamically

### Modifying the Design

- Update `src/styles/global.css` for global styles
- Modify component files for specific styling
- Customize the color scheme by updating CSS custom properties

## Directus Configuration Tips

### Permissions

Ensure your Directus role has read permissions for:
- Posts collection
- Pages collection
- Files collection
- Users collection (for author information)
- Any custom collections you create

### API Token

Create a static token in Directus:
1. Go to Settings > Access Tokens
2. Create a new token
3. Set appropriate permissions
4. Copy the token to your `.env.development` file

### Content Structure

For best results:
- Use consistent slug formats (lowercase, hyphens)
- Always set a status field (draft/published)
- Include featured images for better visual appeal
- Write compelling excerpts for post cards

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Connect your Git repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `public`
4. Add environment variables in Netlify dashboard

### Deploy to Vercel

1. Connect your Git repository to Vercel
2. Vercel will auto-detect Gatsby settings
3. Add environment variables in Vercel dashboard

## Troubleshooting

### Common Issues

**GraphQL Errors**: Ensure your Directus collections match the GraphQL queries in the code.

**Build Failures**: Check that all required environment variables are set.

**Images Not Loading**: Verify that the Directus files are publicly accessible and the URL is correct.

**Empty Content**: Ensure your Directus content has `status: "published"`.

### Debug Mode

Enable Gatsby's debug mode:

```bash
DEBUG=gatsby:* npm run develop
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the [Gatsby documentation](https://www.gatsbyjs.com/docs/)
- Review [Directus documentation](https://docs.directus.io/)
- Open an issue in this repository
