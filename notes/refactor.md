# Refactoring Prompt for Editorial Layout Migration

## Task Overview

Refactor the existing layout and typography system to meet the editorial styleguide specifications while strictly adhering to shadcn/ui, Tailwind CSS, and Gatsby best practices. The goal is to create a clean, maintainable editorial reading experience with a 680px article container and proper breakout patterns.

## Analysis Phase Instructions

Before refactoring, analyze the current codebase and identify:

1. **Current Layout Structure:**
   - Document existing container widths and wrapper components
   - Note any custom CSS or styled-components that need migration
   - Identify hardcoded pixel values that should become design tokens

2. **Typography Implementation:**
   - Review current font sizes, line heights, and spacing
   - Check for inconsistent typography scales
   - Find any non-Tailwind typography classes

3. **Component Patterns:**
   - List all custom components that need shadcn/ui equivalents
   - Identify layout components that need consolidation
   - Note any anti-patterns (inline styles, CSS-in-JS, etc.)

## Refactoring Requirements

### Core Principles

1. **NEVER create custom CSS classes when Tailwind utilities exist**
2. **ALWAYS use shadcn/ui components as your foundation**
3. **NEVER hardcode values - use Tailwind config extensions**
4. **ALWAYS use cn() utility for conditional classes**
5. **NEVER mix CSS modules with Tailwind classes**

### Step-by-Step Refactoring Process

#### 1. Tailwind Configuration

First, update tailwind.config.js:

```
// Extend the theme with editorial specifications
theme: {
  extend: {
    maxWidth: {
      'article': '680px',
      'breakout-md': '840px',
      'breakout-lg': '960px',
      'container-content': '960px',
      'container-outer': '1440px',
    },
    // Add typography overrides for prose class
    typography: {
      DEFAULT: {
        css: {
          maxWidth: '680px',
          fontSize: '18px',
          lineHeight: '1.7',
        },
      },
    },
  },
}
```

#### 2. Layout Component Migration

Replace existing layout wrappers with:

```
// CORRECT: Using composition and Tailwind utilities
export function EditorialLayout({ children, className, sidebar }) {
  return (
    <div className={cn(
      "mx-auto max-w-container-outer", // Use extended Tailwind values
      className
    )}>
      <main className="mx-auto w-full max-w-article px-5 md:px-0">
        {children}
      </main>
    </div>
  )
}

// INCORRECT: Don't do this
<div style={{ maxWidth: '680px' }}>  // No inline styles
<div className="custom-container">     // No custom CSS classes
```

#### 3. Typography Refactoring

Replace custom typography with Tailwind/shadcn patterns:

```
// BEFORE (incorrect):
<h1 className="article-title">{title}</h1>
<p className="custom-paragraph">{text}</p>

// AFTER (correct):
<h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
  {title}
</h1>
<p className="leading-7 [&:not(:first-child)]:mt-6">
  {text}
</p>
```

#### 4. Component Migration to shadcn/ui

Replace custom components with shadcn/ui equivalents:

```
// BEFORE: Custom card component
<div className="custom-card">
  <div className="card-header">Title</div>
  <div className="card-body">Content</div>
</div>

// AFTER: shadcn/ui Card
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

#### 5. Breakout Pattern Implementation

Implement the breakout pattern for wider content:

```
// Utility classes in globals.css
@layer utilities {
  .breakout-medium {
    @apply relative left-[50%] right-[50%] mx-[-50vw] w-screen max-w-breakout-md;
  }
}

// Usage in components
<figure className="breakout-medium my-8">
  <img src={image} alt={alt} className="w-full" />
</figure>
```

### Gatsby-Specific Best Practices

1. **GraphQL Fragments for Typography:**

```
export const articleFragment = graphql`
  fragment ArticleContent on MarkdownRemark {
    html
    frontmatter {
      title
      description
      date(formatString: "MMMM DD, YYYY")
    }
    timeToRead
  }
`
```

2. **Use Gatsby Image for Optimized Images:**

```
import { GatsbyImage, getImage } from "gatsby-plugin-image"

// In your component
<GatsbyImage
  image={getImage(data.image)}
  alt={alt}
  className="breakout-medium rounded-lg"
/>
```

3. **Proper Template Structure:**

```
// src/templates/article-template.jsx
export default function ArticleTemplate({ data, pageContext }) {
  return (
    <EditorialLayout>
      {/* Content */}
    </EditorialLayout>
  )
}
```

### Migration Checklist

For each file you refactor, ensure:

- [ ] **Remove all custom CSS files** - migrate to Tailwind utilities
- [ ] **Replace styled-components** with className and Tailwind
- [ ] **Convert pixel values** to Tailwind spacing scale (8px = 2, 16px = 4, etc.)
- [ ] **Use design tokens** from tailwind.config.js (max-w-article not max-w-[680px])
- [ ] **Import shadcn/ui components** instead of creating custom ones
- [ ] **Use cn() utility** for all conditional classes
- [ ] **Apply prose classes** for markdown content
- [ ] **Implement responsive patterns** with Tailwind breakpoints (sm:, md:, lg:)
- [ ] **Remove CSS modules** and migrate to Tailwind

### Common Anti-Patterns to Fix

```
// ❌ WRONG: Avoid these patterns
<div style={{ marginBottom: '24px' }}>           // Inline styles
<div className="container" width="680">          // Custom CSS classes
<div className={`${styles.article} prose`}>      // CSS modules
<Box maxWidth={680}>                             // UI library components
<div className="max-w-[680px]">                  // Hardcoded Tailwind values

// ✅ CORRECT: Use these patterns instead
<div className="mb-6">                           // Tailwind utilities
<div className="container-article">              // Extended Tailwind config
<div className="prose prose-lg">                 // Tailwind typography
<div className="max-w-article">                  // Design tokens
<div className={cn("base", condition && "mod")}> // cn() utility
```

### File Organization

Ensure proper Gatsby/React structure:

```
src/
├── components/
│   ├── ui/                 # Only shadcn/ui components
│   ├── layouts/
│   │   └── editorial-layout.jsx
│   └── article/           # Article-specific components
├── templates/             # Gatsby page templates
├── pages/                 # Gatsby pages
├── styles/
│   └── globals.css        # Only for @layer utilities
└── lib/
    └── utils.js           # cn() and other utilities
```

### Validation After Refactoring

Run through this checklist for each refactored component:

1. **No custom CSS remains** (except utility classes in globals.css)
2. **All spacing uses Tailwind scale** (space-y-6, mt-8, p-4)
3. **Typography uses prose or shadcn conventions**
4. **Container widths use config values** (max-w-article, not max-w-[680px])
5. **Responsive design uses Tailwind breakpoints** (md:, lg:)
6. **Components use shadcn/ui primitives**
7. **Conditional styling uses cn() utility**
8. **No inline styles or style props**
9. **Images use Gatsby Image where applicable**
10. **Layout follows 680px article / 840px medium / 960px large pattern**

### Example Refactoring

Show me your current component, and I'll refactor it following this pattern:

```
// I will transform your code to:
// 1. Use EditorialLayout wrapper
// 2. Apply max-w-article constraint
// 3. Replace custom components with shadcn/ui
// 4. Use Tailwind utilities for all spacing
// 5. Implement breakout patterns where needed
// 6. Ensure mobile responsiveness
// 7. Follow Gatsby best practices
```

---

**Remember:** The goal is a clean, maintainable codebase that leverages the full power of Tailwind CSS and shadcn/ui within Gatsby, while maintaining the precise editorial layout specifications of 680px article width with elegant breakout patterns for rich media.