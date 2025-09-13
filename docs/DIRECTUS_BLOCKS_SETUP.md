# Directus Reusable Blocks Setup Guide

This guide explains how to set up the reusable blocks system in your Directus CMS to create dynamic pages with modular content.

## Required Directus Collections

### 1. Block Collections

Create these collections in your Directus admin:

#### `block_hero`
- `id` (UUID, Primary Key)
- `headline` (String, Input interface)
- `content` (Text, WYSIWYG interface)
- `buttons` (JSON, Repeater interface)
  - `label` (String)
  - `href` (String) 
  - `variant` (String) - Options: 'default', 'primary', 'outline'
- `image` (File, Single File interface)

#### `block_richtext`
- `id` (UUID, Primary Key)
- `headline` (String, Input interface)
- `content` (Text, WYSIWYG interface)

#### `block_cardgroup`
- `id` (UUID, Primary Key)
- `headline` (String, Input interface)
- `content` (Text, WYSIWYG interface)
- `group_type` (String, Radio interface) - Options: 'posts', 'custom'
- `posts` (M2M relationship to `post` collection)
  - Condition: Hide when `group_type` !== 'posts'
- `cards` (O2M relationship to `block_cardgroup_cards`)
  - Condition: Hide when `group_type` !== 'custom'

#### `block_cardgroup_cards` (Junction Collection)
- `id` (UUID, Primary Key)
- `title` (String, Input interface)
- `content` (Text, Textarea interface)
- `image` (File, Single File interface)

### 2. Pages Collection

#### `pages`
- `id` (UUID, Primary Key)
- `title` (String, Input interface)
- `slug` (String, Input interface, URL Safe: true)
- `status` (String, Dropdown) - Options: 'draft', 'published'
- `meta_description` (String, Textarea interface)
- `date_created` (DateTime, auto-generated)
- `date_updated` (DateTime, auto-updated)
- `blocks` (M2A relationship, Builder interface)
  - Related Collections: `block_hero`, `block_richtext`, `block_cardgroup`
  - Sort Field: `sort`

## Setup Instructions

### Step 1: Create Block Collections
1. In Directus admin, go to Settings > Data Model
2. Create each block collection with the fields listed above
3. Set appropriate interfaces and validation rules

### Step 2: Create Pages Collection
1. Create the `pages` collection with basic fields
2. Add the `blocks` field as a Many-to-Any (M2A) relationship
3. Configure the Builder interface with all block collections
4. Enable sorting with a `sort` field

### Step 3: Configure Permissions
Ensure your API user has read permissions for:
- `pages` collection
- All `block_*` collections
- `directus_files` (for images)

### Step 4: Create Sample Content
1. Create some block content in each block collection
2. Create a test page and add blocks to it
3. Verify the API response includes nested block data

## API Usage

### Fetch Page with Blocks
```graphql
query GetPage($slug: String!) {
  pages(filter: { slug: { _eq: $slug } }) {
    id
    title
    slug
    status
    meta_description
    blocks {
      id
      sort
      collection
      item {
        ... on block_hero {
          id
          headline
          content
          buttons
          image {
            id
            filename_download
          }
        }
        ... on block_richtext {
          id
          headline
          content
        }
        ... on block_cardgroup {
          id
          headline
          content
          group_type
          posts {
            id
            title
            slug
            excerpt
          }
          cards {
            id
            title
            content
            image {
              id
              filename_download
            }
          }
        }
      }
    }
  }
}
```

## Frontend Implementation

The Gatsby frontend automatically:
1. Creates dynamic pages from the `pages` collection
2. Renders blocks using the `BlockRenderer` component
3. Maps block types to their respective React components

### Available Block Components
- `HeroBlock` - Hero sections with headline, content, buttons, and image
- `RichTextBlock` - Rich text content with optional headline
- `CardGroupBlock` - Card grids from posts or custom cards

### Adding New Block Types
1. Create the collection in Directus
2. Add the collection to the M2A relationship in `pages`
3. Create a React component in `src/components/blocks/`
4. Register the component in `BlockRenderer.js`
5. Update the GraphQL query in `src/templates/page.js`

## Benefits

- **Reusable Content**: Blocks can be shared across multiple pages
- **Flexible Layouts**: Mix and match blocks to create unique page layouts
- **Content Management**: Non-technical users can build pages visually
- **Type Safety**: GraphQL provides strong typing for all block data
- **Performance**: Static generation with Gatsby for fast loading
