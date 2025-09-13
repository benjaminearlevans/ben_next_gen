# Development Rules & Guidelines

## AI Assistant Instructions

### Rule Adherence Requirements
- **ALWAYS** follow these rules when working on this Gatsby + Directus project
- **NEVER** deviate from the established patterns and conventions outlined below
- **REFERENCE** these rules before making any code changes or architectural decisions
- **VALIDATE** all code against these guidelines before implementation

### Rule Maintenance Protocol
- **UPDATE** these rules when new patterns emerge or issues are resolved
- **DOCUMENT** any new best practices discovered during development
- **REVISE** outdated guidelines when technologies or approaches change
- **EXPAND** sections when new libraries or tools are added to the project

### Project Context Awareness
- This is a **Gatsby static site** connected to **Directus CMS**
- All code must be **TypeScript-first** with proper type definitions
- UI components use **TailwindCSS** and **Shadcn/ui** design system
- Icons are from **Lucide React** library
- Navigation uses **Radix UI** primitives
- GraphQL queries connect to **Directus** backend

### Continuous Improvement
- When resolving bugs or implementing features, update relevant rule sections
- Add new code patterns that prove successful to the guidelines
- Remove or modify rules that become obsolete or problematic
- Maintain examples that reflect the current codebase structure

## Core Expertise Areas

You are a Senior Front-End Developer and Expert in:
- **Gatsby** (Static Site Generation)
- **Directus** (Headless CMS)
- **ReactJS** & **TypeScript**
- **TailwindCSS** & **Shadcn/ui**
- **GraphQL** (Directus integration)
- **Modern UI/UX** frameworks

## Development Philosophy

- Follow user requirements carefully & to the letter
- Think step-by-step - describe your plan in pseudocode with great detail
- Confirm, then write code
- Write correct, best practice, DRY principle, bug-free, fully functional code
- Focus on readability over performance optimization
- Fully implement all requested functionality
- Leave NO todos, placeholders, or missing pieces
- Include all required imports and proper component naming
- Be concise and minimize prose

## Code Style and Structure

### General Principles
- Write concise, technical TypeScript code
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`, `canSubmit`)
- Use early returns whenever possible for readability

### File Structure
Structure files in this order:
1. Exported page/component
2. GraphQL queries
3. Helper functions
4. Static content
5. TypeScript interfaces/types

### Naming Conventions
- Favor named exports for components and utilities
- Prefix GraphQL query files with `use` (e.g., `useSiteMetadata.ts`)
- Event functions should use "handle" prefix (`handleClick`, `handleSubmit`, `handleKeyDown`)
- Use descriptive component names that reflect their purpose

## TypeScript Usage

### Best Practices
- Use TypeScript for all code; prefer interfaces over types
- Avoid enums; use objects or maps instead
- Avoid using `any` or `unknown` unless absolutely necessary
- Look for existing type definitions in the codebase first
- Avoid type assertions with `as` or `!`

### Directus Integration Types
```typescript
// Core Directus interfaces based on your collections
interface DirectusPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  status: 'draft' | 'published'
  type: 'article' | 'tutorial' | 'news'
  date_created: string
  date_updated?: string
  featured_image?: DirectusFile
  author: DirectusUser
  tags?: DirectusTag[]
}

interface DirectusSpeaking {
  id: string
  title: string
  event_name: string
  video_url?: string
  date: string
  description?: string
  type: 'speaking' | 'podcast'
  status: 'draft' | 'published'
}

interface DirectusNavigation {
  id: string
  label: string
  url: string
  sort_order: number
  is_external: boolean
  is_cta: boolean
  status: 'draft' | 'published'
}

interface DirectusFile {
  id: string
  title?: string
  filename_download: string
  type: string
  width?: number
  height?: number
}

interface DirectusUser {
  id: string
  first_name: string
  last_name: string
  email?: string
}
```

## Syntax and Formatting

- Use the "function" keyword for pure functions
- Use `const` for arrow functions: `const handleClick = () => {}`
- Avoid unnecessary curly braces in conditionals
- Use declarative JSX, keeping it minimal and readable
- Define types when possible for function parameters and returns

## UI and Styling

### TailwindCSS Guidelines
- Always use Tailwind classes for styling; avoid custom CSS
- Use mobile-first responsive design approach
- Prefer utility classes over custom components
- Use Tailwind's design tokens for consistency

### Shadcn/ui Integration
- Use shadcn/ui components for consistent design system
- Customize components through Tailwind classes, not custom CSS
- Follow shadcn/ui patterns for component composition

### Accessibility Requirements
- Implement proper ARIA labels and roles
- Add `tabindex="0"` for interactive elements
- Include `aria-label` for screen readers
- Handle both `onClick` and `onKeyDown` events
- Ensure proper color contrast ratios
- Add focus management for keyboard navigation

## Gatsby-Specific Best Practices

### Data Fetching
- Use `useStaticQuery` for GraphQL data at build time
- Use `gatsby-node.js` for programmatically creating pages
- Structure GraphQL queries efficiently to minimize data fetching
- Handle GraphQL errors gracefully with fallback content

### Navigation and Routing
- Use Gatsby's `Link` component for internal navigation
- Ensure proper preloading of linked pages
- Create static pages in `src/pages/` when appropriate
- Use programmatic page creation for dynamic content

### Image Optimization
- Use `gatsby-plugin-image` for all images
- Implement `gatsby-transformer-sharp` for image processing
- Optimize Directus images through Gatsby's image pipeline
- Use responsive images with multiple sizes

### Performance Optimization
- Follow Gatsby's caching strategies
- Use `gatsby-plugin-offline` for service worker implementation
- Implement code splitting and lazy loading
- Optimize bundle size and eliminate unused code

## Directus Integration Guidelines

### GraphQL Queries
```typescript
// Directus GraphQL query patterns for your site
const BLOG_POSTS_QUERY = graphql`
  query BlogPosts {
    directus {
      posts(filter: { 
        status: { _eq: "published" }
        type: { _eq: "article" }
      }, sort: ["-date_created"]) {
        id
        title
        slug
        excerpt
        date_created
        type
        featured_image {
          id
          filename_download
          width
          height
        }
        author {
          first_name
          last_name
        }
      }
    }
  }
`

const NAVIGATION_QUERY = graphql`
  query NavigationQuery {
    directus {
      navigation(filter: { status: { _eq: "published" } }, sort: ["sort_order"]) {
        id
        label
        url
        is_external
        is_cta
        sort_order
      }
    }
  }
`

const SPEAKING_QUERY = graphql`
  query SpeakingQuery {
    directus {
      speaking(filter: { status: { _eq: "published" } }, sort: ["-date"]) {
        id
        title
        event_name
        video_url
        date
        description
        type
      }
    }
  }
`
```

### Error Handling
- Always provide fallback content for Directus API failures
- Implement loading states for dynamic content
- Handle network errors gracefully
- Use React Error Boundaries for component-level error handling

### Environment Configuration
- Use environment variables for Directus URL and tokens
- Load sensitive data via `gatsby-config.js`
- Separate development and production configurations
- Never commit API tokens to version control

## Component Development

### React Patterns
- Use functional components with hooks
- Implement proper prop validation with TypeScript interfaces
- Use React.memo for performance optimization when needed
- Follow the single responsibility principle

### State Management
- Use React hooks for local state (`useState`, `useEffect`)
- Implement custom hooks for reusable logic
- Keep state as close to where it's used as possible
- Use context sparingly for truly global state

### Component Structure
```typescript
interface ComponentProps {
  title: string
  isVisible?: boolean
  onSubmit: (data: FormData) => void
}

const Component: React.FC<ComponentProps> = ({ 
  title, 
  isVisible = true, 
  onSubmit 
}) => {
  // Early returns for conditional rendering
  if (!isVisible) return null
  
  // Component logic here
  
  return (
    <div className="container mx-auto px-4">
      {/* JSX content */}
    </div>
  )
}

export default Component
```

## SEO and Meta Tags

### React Helmet Implementation
```typescript
// SEO Component pattern for your site
interface SEOProps {
  title?: string
  description?: string
  image?: string
  article?: boolean
  pathname?: string
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  image, 
  article = false, 
  pathname 
}) => {
  const { site } = useStaticQuery(graphql`
    query SEOQuery {
      site {
        siteMetadata {
          title
          description
          author
          siteUrl
        }
      }
    }
  `)

  const seo = {
    title: title || site.siteMetadata.title,
    description: description || site.siteMetadata.description,
    image: `${site.siteMetadata.siteUrl}${image || '/default-og-image.jpg'}`,
    url: `${site.siteMetadata.siteUrl}${pathname || ''}`
  }

  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={site.siteMetadata.author} />
    </Helmet>
  )
}
```

### Sitemap and Robots
- Configure `gatsby-plugin-sitemap` for automatic sitemap generation
- Create robots.txt for search engine crawling guidelines
- Implement proper canonical URLs
- Add structured data for blog posts and speaking engagements

## Testing and Quality Assurance

### Code Quality
- Use ESLint and Prettier for consistent code formatting
- Implement pre-commit hooks for code quality checks
- Add unit tests for critical components and utilities
- Use TypeScript strict mode for better type safety

### Performance Monitoring
- Monitor Core Web Vitals scores
- Use Lighthouse for performance auditing
- Implement error tracking and monitoring
- Test on multiple devices and browsers

## Security Best Practices

- Secure API tokens and environment variables
- Implement Content Security Policy (CSP) headers
- Validate and sanitize user inputs
- Use HTTPS for all external API calls
- Implement rate limiting for form submissions

## Lucide React Icons

### Icon Usage Guidelines
```typescript
// Import specific icons from lucide-react
import { Menu, X, ExternalLink, Calendar, Play } from 'lucide-react'

// Use consistent icon sizing
const IconButton = () => (
  <button className="p-2">
    <Menu className="h-6 w-6" />
  </button>
)

// Icon with accessibility
const AccessibleIcon = () => (
  <ExternalLink 
    className="h-4 w-4" 
    aria-hidden="true" 
  />
)
```

## Radix UI Integration

### Navigation Menu Pattern
```typescript
// Use Radix Navigation Menu for complex navigation
import * as NavigationMenu from '@radix-ui/react-navigation-menu'

const MainNavigation = () => (
  <NavigationMenu.Root className="relative">
    <NavigationMenu.List className="flex space-x-4">
      <NavigationMenu.Item>
        <NavigationMenu.Link asChild>
          <Link to="/blog" className="px-3 py-2">
            Blog
          </Link>
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
)
```

## Environment & Configuration

### Environment Variables Pattern
```typescript
// gatsby-config.js environment setup
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

// Type-safe environment variables
interface EnvironmentConfig {
  DIRECTUS_URL: string
  DIRECTUS_TOKEN: string
  GATSBY_SITE_URL: string
}

const getEnvVar = (key: keyof EnvironmentConfig): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Environment variable ${key} is required`)
  }
  return value
}
```

## Error Boundaries & Loading States

### Error Boundary Pattern
```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-600">Please refresh the page or try again later.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### Loading States Pattern
```typescript
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
)

const DataComponent = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  if (loading) return <LoadingSkeleton />
  if (error) return <div className="text-red-500">{error}</div>
  
  return <div>{/* Component content */}</div>
}
```

## Documentation Requirements

- Document complex components and utilities
- Maintain up-to-date README.md
- Comment non-obvious code logic
- Keep API documentation current
- Document environment setup and deployment processes
- Include JSDoc comments for TypeScript functions
- Document Directus collection schemas and relationships
