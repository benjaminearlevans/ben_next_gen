# Manual Directus Collections Setup

Follow these steps to create the reusable blocks collections in your Directus admin interface.

## Step 1: Create Block Collections

### 1. Create `block_hero` Collection

1. Go to Settings → Data Model
2. Click "Create Collection"
3. Collection Name: `block_hero`
4. Primary Key Field: `id` (UUID, auto-generated)
5. Add these fields:

| Field Name | Type | Interface | Options |
|------------|------|-----------|---------|
| `headline` | String | Input | Required: Yes |
| `content` | Text | Rich Text Editor (HTML) | |
| `buttons` | JSON | Repeater | Template: `{{label}} ({{variant}})` |
| `image` | Many-to-One | File | Related Collection: `directus_files` |

For the `buttons` field, configure these sub-fields:
- `label` (String, Input)
- `href` (String, Input) 
- `variant` (String, Dropdown: default, primary, outline)

### 2. Create `block_richtext` Collection

1. Create Collection: `block_richtext`
2. Add fields:

| Field Name | Type | Interface |
|------------|------|-----------|
| `headline` | String | Input |
| `content` | Text | Rich Text Editor (HTML) |

### 3. Create `block_cardgroup` Collection

1. Create Collection: `block_cardgroup`
2. Add fields:

| Field Name | Type | Interface | Options |
|------------|------|-----------|---------|
| `headline` | String | Input | |
| `content` | Text | Rich Text Editor (HTML) | |
| `group_type` | String | Radio Buttons | Options: posts, custom |

## Step 2: Create Pages Collection

1. Create Collection: `pages`
2. Add fields:

| Field Name | Type | Interface | Options |
|------------|------|-----------|---------|
| `status` | String | Dropdown | Options: draft, published |
| `title` | String | Input | Required: Yes |
| `slug` | String | Input | Required: Yes |
| `meta_description` | Text | Textarea | |
| `date_created` | Timestamp | DateTime | Special: Date Created |
| `date_updated` | Timestamp | DateTime | Special: Date Updated |

## Step 3: Create Many-to-Any Relationship

1. In the `pages` collection, add a new field:
   - Field Name: `blocks`
   - Type: **Many to Any (M2A)**
   - Interface: **Many to Any**
   - Allow these collections:
     - `block_hero`
     - `block_richtext` 
     - `block_cardgroup`

## Step 4: Set Permissions

Make sure your API user has read permissions for:
- `pages`
- `block_hero`
- `block_richtext`
- `block_cardgroup`
- `directus_files` (for images)

## Step 5: Test Data

Create a test page:
1. Go to Content → Pages
2. Create new page:
   - Title: "Test Page"
   - Slug: "test-page"
   - Status: "published"
   - Add some blocks in the `blocks` field

## Ready to Enable Frontend

Once you've completed these steps, let me know and I'll:
1. Enable the dynamic page creation in `gatsby-node.js`
2. Update the page template to use the real GraphQL query
3. Test the full integration
