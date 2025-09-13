# Dynamic Collections Setup

This guide creates the missing Directus collections to eliminate all hardcoded content.

## Collections to Create

### 1. Site Settings Collection (`site_settings`)

**Purpose**: Global site configuration and hero content

**Collection Settings:**
- Collection Name: `site_settings`
- Type: Singleton (only one record)
- Icon: `settings`

**Fields:**
| Field Name | Type | Interface | Description |
|------------|------|-----------|-------------|
| `site_title` | String | Input | Site title (e.g., "Benjamin Carlson") |
| `hero_title` | String | Input | Hero section main title |
| `hero_subtitle` | Text | Textarea | Hero section subtitle/description |
| `hero_cta_primary_text` | String | Input | Primary CTA button text |
| `hero_cta_primary_url` | String | Input | Primary CTA button URL |
| `hero_cta_secondary_text` | String | Input | Secondary CTA button text |
| `hero_cta_secondary_url` | String | Input | Secondary CTA button URL |

### 2. Companies/Audiences Collection (`companies`)

**Purpose**: Past speaking audiences with logos

**Collection Settings:**
- Collection Name: `companies`
- Icon: `business`

**Fields:**
| Field Name | Type | Interface | Description |
|------------|------|-----------|-------------|
| `name` | String | Input | Company name |
| `description` | Text | Textarea | Speaking engagement description |
| `logo_svg` | Text | Code (HTML) | SVG logo code |
| `sort_order` | Integer | Input | Display order |
| `status` | String | Dropdown | draft, published |

### 3. Featured Posts Collection (`featured_posts`)

**Purpose**: Homepage featured posts selection

**Collection Settings:**
- Collection Name: `featured_posts`
- Icon: `star`

**Fields:**
| Field Name | Type | Interface | Description |
|------------|------|-----------|-------------|
| `post` | Many-to-One | Related Values | Link to post collection |
| `sort_order` | Integer | Input | Display order |
| `status` | String | Dropdown | draft, published |

## Manual Setup Steps

### Step 1: Create Site Settings
1. Create `site_settings` collection as singleton
2. Add all the fields listed above
3. Create one record with your site content

### Step 2: Create Companies Collection
1. Create `companies` collection
2. Add the fields listed above
3. Import your past audiences data

### Step 3: Create Featured Posts
1. Create `featured_posts` collection
2. Add fields with relationship to `post` collection
3. Select which posts to feature on homepage

### Step 4: Set Permissions
Ensure your API user has read permissions for:
- `site_settings`
- `companies`
- `featured_posts`

## Sample Data

### Site Settings Record:
```json
{
  "site_title": "Benjamin Carlson",
  "hero_title": "Hi, I'm Benjamin Carlson",
  "hero_subtitle": "I'm a developer, speaker, and content creator passionate about building great web experiences.",
  "hero_cta_primary_text": "Read My Blog",
  "hero_cta_primary_url": "/blog/",
  "hero_cta_secondary_text": "Get in Touch",
  "hero_cta_secondary_url": "/contact/"
}
```

### Companies Records:
```json
[
  {
    "name": "Berkeley",
    "description": "Delivered a talk to help teams understand the benefits of inclusive design",
    "logo_svg": "<svg className=\"h-8 w-auto\" viewBox=\"0 0 200 60\" fill=\"currentColor\"><text x=\"0\" y=\"40\" className=\"text-2xl font-bold\">UC Berkeley</text></svg>",
    "sort_order": 1,
    "status": "published"
  }
]
```
