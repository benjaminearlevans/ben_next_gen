# Deployment Guide

## GitHub Repository Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `gatsby-directus-frontend` (or your preferred name)
3. Make it public or private as needed
4. **Do NOT** initialize with README, .gitignore, or license (we already have these)

### 2. Push to GitHub

```bash
# Add the GitHub remote (replace with your actual repository URL)
git remote add origin https://github.com/yourusername/gatsby-directus-frontend.git

# Push to GitHub
git push -u origin main
```

## Environment Variables Setup

### Required Secrets in GitHub Repository

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

#### Directus Configuration
- `DIRECTUS_URL`: Your Directus instance URL (e.g., `https://your-directus.com`)
- `DIRECTUS_TOKEN`: Your Directus API token
- `GATSBY_SITE_ID`: Site identifier for multi-site setup

#### Netlify Configuration (for deployment)
- `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
- `NETLIFY_PRODUCTION_SITE_ID`: Production site ID from Netlify
- `NETLIFY_STAGING_SITE_ID`: Staging site ID from Netlify (optional)

### Getting Netlify Tokens

1. **Personal Access Token**:
   - Go to Netlify → User Settings → Applications
   - Generate new access token
   - Add as `NETLIFY_AUTH_TOKEN` secret

2. **Site IDs**:
   - Go to your Netlify site → Site Settings → General
   - Copy the Site ID
   - Add as `NETLIFY_PRODUCTION_SITE_ID` secret

## CI/CD Pipeline Features

### Automated Workflows

1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`):
   - Runs tests and linting on every push/PR
   - Builds Gatsby site with environment variables
   - Deploys to staging on `develop` branch
   - Deploys to production on `main` branch
   - Runs Lighthouse audits on production deployments

2. **Dependency Updates** (`.github/workflows/dependency-update.yml`):
   - Weekly automated dependency updates
   - Creates PRs with updated packages
   - Runs security audits

### Branch Strategy

- `main`: Production branch (auto-deploys to production)
- `develop`: Staging branch (auto-deploys to staging)
- Feature branches: Create PRs to `develop`

## Local Development

### Environment Setup

1. Copy `.env.example` to `.env.development`:
```bash
cp .env.example .env.development
```

2. Add your Directus configuration:
```env
DIRECTUS_URL=https://your-directus.com
DIRECTUS_TOKEN=your-api-token
GATSBY_SITE_ID=your-site-id
```

### Available Scripts

```bash
# Development
npm run develop          # Start development server
npm run build           # Build for production
npm run serve           # Serve production build locally

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run type-check      # TypeScript type checking

# Testing
npm test               # Run tests (when implemented)
```

## Deployment Platforms

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `public`
4. Add environment variables in Netlify dashboard
5. Enable branch deploys for staging

### Alternative Platforms

- **Vercel**: Similar setup, change deploy action in workflow
- **GitHub Pages**: Use `gatsby-plugin-gh-pages`
- **AWS S3 + CloudFront**: Use AWS CLI in workflow
- **Self-hosted**: Use SSH deployment in workflow

## Performance Monitoring

### Lighthouse CI

- Automated performance audits on production deployments
- Configurable thresholds in `lighthouserc.json`
- Results stored in temporary public storage

### Recommended Monitoring

- **Sentry**: Error tracking and performance monitoring
- **Google Analytics**: User behavior tracking
- **Hotjar**: User experience insights
- **Uptime Robot**: Site availability monitoring

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to repository
2. **API Tokens**: Use least-privilege access tokens
3. **Dependencies**: Regular security audits via automated updates
4. **Content Security Policy**: Configure in Gatsby config
5. **HTTPS**: Always use HTTPS in production

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check environment variables are set correctly
   - Verify Directus API is accessible
   - Check for TypeScript errors

2. **Deployment Issues**:
   - Verify Netlify tokens and site IDs
   - Check build logs in GitHub Actions
   - Ensure all required secrets are set

3. **Performance Issues**:
   - Review Lighthouse audit results
   - Optimize images and assets
   - Check Gatsby build analysis

### Support

- Check GitHub Actions logs for detailed error messages
- Review Netlify deploy logs
- Use Gatsby CLI for local debugging: `gatsby clean && gatsby develop`
