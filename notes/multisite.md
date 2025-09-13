# Multi-Site Architecture Migration Todo List

## Phase 1: Initial Assessment & Analysis

### Directus Data Model Analysis
- [ ] Document all current collections and their relationships
- [ ] Identify global settings vs content collections  
- [ ] List all custom extensions, hooks, and flows
- [ ] Note the current permission structure
- [ ] Export current Directus schema for backup

### Gatsby Frontend Analysis
- [ ] Map all data queries (GraphQL/REST)
- [ ] Document component structure and shadcn usage
- [ ] Identify hardcoded site-specific elements
- [ ] Review the current routing structure

### Backup Strategy
- [ ] Export current Directus schema
- [ ] Backup database
- [ ] Create git branches for safe refactoring

## Phase 2: Directus Backend Refactoring

### Create Sites Collection
- [ ] Add collection 'sites' with UUID primary key
- [ ] Add name field (string) - Internal site identifier
- [ ] Add domain field (string) - Site URL
- [ ] Add title field (string) - Site title
- [ ] Add description field (text) - Site description
- [ ] Add theme_config field (JSON) - Store theme variables
- [ ] Add layout_type field (select) - Layout variation identifier
- [ ] Add is_active field (boolean) - Site status

### Migrate Global Settings
- [ ] Move site-specific settings from globals to sites collection
- [ ] Keep truly global items (API keys, shared resources) in globals
- [ ] Create logo field in sites collection
- [ ] Create favicon field in sites collection
- [ ] Create social_links field in sites collection
- [ ] Create analytics_id field in sites collection

### Establish Content Relationships
- [ ] Add 'site' field (many-to-one) to pages collection
- [ ] Add 'site' field (many-to-one) to posts collection
- [ ] Add 'site' field (many-to-one) to navigation collection
- [ ] Add 'site' field (many-to-one) to forms collection
- [ ] Add 'site' field (many-to-one) to media/assets (if site-specific)
- [ ] Execute SQL: `ALTER TABLE pages ADD COLUMN site UUID REFERENCES sites(id);`
- [ ] Execute SQL: `ALTER TABLE posts ADD COLUMN site UUID REFERENCES sites(id);`
- [ ] Execute SQL: `ALTER TABLE navigation ADD COLUMN site UUID REFERENCES sites(id);`

### Create Junction Tables
- [ ] Create sites_users junction table for many-to-many user relationships
- [ ] Add site_id field to junction table
- [ ] Add user_id field to junction table
- [ ] Add role field (optional for site-specific roles) to junction table

### Update Display Templates
- [ ] Configure each collection to show site name in list views
- [ ] Use tab groups for better UI organization
- [ ] Add field translations for user-friendly labels

## Phase 3: Permission Structure

### Create Bot Role
- [ ] Create one bot user per site for API access
- [ ] Set read-only permissions scoped to assigned site
- [ ] Generate static tokens for frontend authentication
- [ ] Document bot user credentials for each site

### Configure Access Policies
- [ ] Set up content editor permissions for sites collection
- [ ] Configure read permission: `"users.user = $_current_user"`
- [ ] Configure update permission: `"users.user = $_current_user"`
- [ ] Set up content editor permissions for pages collection
- [ ] Configure pages read permission: `"site.users.user = $_current_user"`
- [ ] Configure pages create permission: `"site.users.user = $_current_user"`
- [ ] Configure pages update permission: `"site.users.user = $_current_user"`
- [ ] Apply same permission pattern to posts, navigation, and other collections

### API Filtering Rules
- [ ] Ensure all content queries include site relationship
- [ ] Configure bot users to automatically filter by assigned sites
- [ ] Remove public access to content (require authentication)
- [ ] Test permission scoping with different user roles

## Phase 4: Frontend Refactoring (Gatsby + shadcn)

### Environment Configuration
- [ ] Create .env.site-a file with site-specific variables
- [ ] Create .env.site-b file with site-specific variables
- [ ] Add GATSBY_DIRECTUS_URL variable to each env file
- [ ] Add GATSBY_SITE_TOKEN variable (bot user token) to each env file
- [ ] Add GATSBY_SITE_ID variable to each env file
- [ ] Add GATSBY_THEME_VARIANT variable to each env file

### Data Layer Refactoring
- [ ] Update gatsby-source-directus config to use environment variables
- [ ] Configure URL: `process.env.GATSBY_DIRECTUS_URL`
- [ ] Configure auth token: `process.env.GATSBY_SITE_TOKEN`
- [ ] Verify queries are automatically filtered by bot permissions
- [ ] Test data fetching with different site configurations

### Theme System with shadcn
- [ ] Create theme provider component
- [ ] Define default theme with shadcn HSL color values
- [ ] Define variant1 theme with different color scheme
- [ ] Define additional theme variants as needed
- [ ] Implement theme application via CSS variables
- [ ] Create useEffect hook to apply theme based on site config
- [ ] Test theme switching between different sites

### Layout Variations
- [ ] Create /src/layouts/ directory structure
- [ ] Create GridLayoutA.jsx (standard grid layout)
- [ ] Create GridLayoutB.jsx (masonry variant layout)
- [ ] Create GridLayoutC.jsx (asymmetric grid layout)
- [ ] Define base grid classes: `"grid gap-4 md:grid-cols-12"`
- [ ] Implement dynamic layout selection component
- [ ] Create layout mapping object for site.layout_type
- [ ] Test layout switching between different configurations

### Build Configuration
- [ ] Add build:site-a script to package.json
- [ ] Add build:site-b script to package.json
- [ ] Add build:all script to package.json
- [ ] Configure GATSBY_SITE_ID environment variable per build
- [ ] Test individual site builds
- [ ] Test combined build process

## Phase 5: Migration Strategy

### Data Migration Script
- [ ] Create script to assign existing content to default site
- [ ] Preserve all existing relationships during migration
- [ ] Update media references to maintain functionality
- [ ] Create rollback plan in case of migration issues
- [ ] Test migration script on backup database first

### Incremental Rollout
- [ ] Start with one test site for initial validation
- [ ] Validate permissions and API access for test site
- [ ] Test all functionality on single site before expanding
- [ ] Gradually migrate additional sites one by one
- [ ] Document any issues encountered during rollout

### Testing Checklist
- [ ] Verify bot user access restrictions work correctly
- [ ] Test content editor permissions for each site
- [ ] Validate theme switching between sites
- [ ] Check responsive layouts on all devices
- [ ] Ensure no broken relationships after migration
- [ ] Test GraphQL queries return correct site-filtered data
- [ ] Verify navigation works correctly per site
- [ ] Test image and media loading across sites

## Phase 6: Deployment Architecture

### Hosting Strategy Selection
- [ ] Evaluate Option A: Subdomain routing (site-a.domain.com)
- [ ] Evaluate Option B: Path-based routing (domain.com/site-a)
- [ ] Evaluate Option C: Domain mapping (unique domains)
- [ ] Choose hosting strategy based on requirements
- [ ] Configure DNS settings for chosen strategy
- [ ] Set up SSL certificates for all domains/subdomains

### CI/CD Pipeline Setup
- [ ] Configure webhook per site for incremental builds
- [ ] Set up separate caching for Gatsby's .cache directories
- [ ] Set up separate caching for public directories
- [ ] Configure environment-specific deployments
- [ ] Test build triggers from Directus content changes
- [ ] Set up build notifications and error handling

### CDN Configuration
- [ ] Configure cache invalidation per site
- [ ] Set up asset optimization per theme variant
- [ ] Configure cache headers for optimal performance
- [ ] Test CDN performance across different sites
- [ ] Set up monitoring for CDN performance metrics

## Key Implementation Notes & Validation

### Implementation Guidelines
- [ ] **Preserve Existing Functionality**: Never delete fields, only relocate them
- [ ] Keep database backups at each step
- [ ] **shadcn Component Consistency**: Use same component API across theme variations
- [ ] Only change CSS variables and layout compositions for themes
- [ ] **Progressive Enhancement**: Build multi-site features alongside existing ones
- [ ] Migrate gradually without breaking current functionality
- [ ] **API Compatibility**: Maintain backward compatibility during transition
- [ ] Keep original endpoints working throughout migration

### Validation Points
- [ ] Verify existing site still works after each major change
- [ ] Confirm new site structure loads correctly
- [ ] Test permissions are properly scoped per site
- [ ] Ensure frontend builds successfully for all sites
- [ ] Validate GraphQL queries return correct data
- [ ] Test theme switching works without errors
- [ ] Confirm responsive layouts work across all sites
- [ ] Verify no broken links or missing assets

### Success Criteria
- [ ] Scalable multi-site architecture implemented
- [ ] shadcn component system maintained across all sites
- [ ] Theme/layout variations working per site
- [ ] All existing functionality preserved
- [ ] Performance maintained or improved
- [ ] Content editors can manage multiple sites efficiently