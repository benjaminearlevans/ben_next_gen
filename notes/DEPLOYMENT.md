# Deployment Guide

This guide covers the CI/CD setup for your Gatsby + Directus project with automated deployments to Vercel.

## Prerequisites

### GitHub Repository Secrets

Add these secrets in your GitHub repository (Settings → Secrets and variables → Actions):

#### Vercel Configuration
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

#### Directus Configuration
- `DIRECTUS_URL`: Your Directus instance URL
- `DIRECTUS_TOKEN`: Your Directus API token
- `GATSBY_SITE_ID`: Site identifier (e.g., `main`)

### Vercel Project Setup

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard (Settings → Environment Variables):
   - `DIRECTUS_URL`: Your Directus instance URL
   - `DIRECTUS_TOKEN`: Your Directus API token
   - `GATSBY_SITE_ID`: Site identifier

3. **Get your Vercel credentials**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and link project
   vercel login
   vercel link
   
   # Get your org and project IDs
   vercel env ls
   ```

## CI/CD Workflows

### 1. Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**Jobs:**
- **Test & Lint**: Runs ESLint, tests, and type checking
- **Build**: Builds Gatsby site with Directus data
- **Deploy Staging**: Deploys to staging on `develop` branch
- **Deploy Production**: Deploys to production on `main` branch
- **Lighthouse Audit**: Runs performance audits on production

### 2. Preview Deployments (`.github/workflows/vercel-preview.yml`)

**Triggers:**
- Pull requests to `main` or `develop`

**Features:**
- Creates preview deployments for PRs
- Comments on PR with preview URL
- Isolated environment for testing changes

### 3. Dependency Updates (`.github/workflows/dependency-update.yml`)

**Schedule:**
- Weekly on Mondays at 9 AM UTC
- Manual trigger available

**Features:**
- Updates npm dependencies
- Fixes security vulnerabilities
- Creates automated PRs with changes

## Branch Strategy

```
main (production)
├── develop (staging)
│   ├── feature/new-feature
│   └── bugfix/fix-issue
└── hotfix/critical-fix
```

- **`main`**: Production branch → Auto-deploys to production
- **`develop`**: Staging branch → Auto-deploys to staging
- **Feature branches**: Create PRs to `develop`
- **Hotfixes**: Create PRs directly to `main`

## Environment Configuration

### Production Environment
- **Branch**: `main`
- **URL**: https://benjaminearlevans.com
- **Vercel Environment**: `production`
- **GATSBY_SITE_ID**: `main`

### Staging Environment
- **Branch**: `develop`
- **URL**: Auto-generated Vercel URL
- **Vercel Environment**: `preview`
- **GATSBY_SITE_ID**: `staging`

### Preview Environment
- **Trigger**: Pull requests
- **URL**: Auto-generated per PR
- **Vercel Environment**: `preview`
- **GATSBY_SITE_ID**: `preview`

## Deployment Process

### Automatic Deployments

1. **Push to `develop`**:
   - Triggers CI/CD pipeline
   - Runs tests and builds
   - Deploys to staging environment

2. **Push to `main`**:
   - Triggers CI/CD pipeline
   - Runs tests and builds
   - Deploys to production environment
   - Runs Lighthouse performance audit

3. **Create Pull Request**:
   - Triggers preview deployment
   - Comments on PR with preview URL

### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Monitoring & Performance

### Lighthouse CI
- Runs automatically on production deployments
- Monitors Core Web Vitals
- Uploads results to temporary storage
- Configure thresholds in `lighthouserc.json`

### Build Artifacts
- Gatsby build artifacts stored for 7 days
- Available for debugging failed deployments
- Downloadable from GitHub Actions

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Directus connection
   - Verify environment variables
   - Review build logs in GitHub Actions

2. **Deployment Failures**:
   - Verify Vercel token and project ID
   - Check Vercel project settings
   - Ensure proper branch configuration

3. **Performance Issues**:
   - Review Lighthouse audit results
   - Optimize images and assets
   - Check Directus query performance

### Debug Commands

```bash
# Test build locally
npm run build

# Check environment variables
vercel env ls

# Pull Vercel configuration
vercel pull

# Test deployment locally
vercel dev
```

## Security Best Practices

- Never commit secrets to repository
- Use GitHub repository secrets for sensitive data
- Rotate API tokens regularly
- Enable branch protection rules
- Require PR reviews for production deployments

## Next Steps

1. **Set up GitHub repository secrets** with your Vercel and Directus credentials
2. **Create a `develop` branch** for staging deployments
3. **Configure Vercel project** with proper environment variables
4. **Test the pipeline** by creating a pull request
5. **Monitor deployments** and performance metrics
