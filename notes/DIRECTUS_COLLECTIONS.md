# Directus Collections Setup for Speaking Page

## Speaking Collection

Create a new collection called `speaking` with the following fields:

### Required Fields

| Field Name | Type | Interface | Options |
|------------|------|-----------|---------|
| `id` | UUID | Input | Primary Key (auto-generated) |
| `status` | String | Select Dropdown | Options: `draft`, `published` |
| `title` | String | Input | Required, max 255 characters |
| `event_name` | String | Input | Required (e.g., "TechConf 2024", "Design Podcast") |
| `video_url` | String | Input | YouTube or Wistia URL |
| `date` | Date | Date | Event date |
| `description` | Text | Textarea | Optional description |
| `type` | String | Select Dropdown | Options: `speaking`, `podcast` |
| `date_created` | Timestamp | Datetime | Auto-generated |
| `date_updated` | Timestamp | Datetime | Auto-generated |

### Field Configuration Details

#### Status Field

- **Interface**: Select Dropdown
- **Options**:
  - `draft` (Draft)
  - `published` (Published)
- **Default**: `draft`

#### Type Field

- **Interface**: Select Dropdown
- **Options**:
  - `speaking` (Speaking Engagement)
  - `podcast` (Podcast Appearance)
- **Default**: `speaking`

#### Video URL Field

- **Interface**: Input
- **Placeholder**: [https://www.youtube.com/watch?v=... or https://company.wistia.com/medias/...](https://www.youtube.com/watch?v=...)
- **Note**: The page automatically extracts thumbnails from YouTube and Wistia URLs

## Collection Permissions

Set the following permissions for the `speaking` collection:

### Public Role

- **Read**: Allow (filtered by `status = published`)
- **Create**: Deny
- **Update**: Deny
- **Delete**: Deny

### Administrator Role

- **Read**: Allow
- **Create**: Allow
- **Update**: Allow
- **Delete**: Allow

## Sample Data

Here are some example entries you can create:

### Speaking Engagement Example

```json
{
  "title": "The Future of Design Systems",
  "event_name": "DesignOps Conference 2024",
  "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "date": "2024-03-15",
  "description": "A deep dive into scalable design systems and their impact on product development.",
  "type": "speaking",
  "status": "published"
}
```

### Podcast Example
```json
{
  "title": "Building Design Teams at Scale",
  "event_name": "The Design Leadership Podcast",
  "video_url": "https://company.wistia.com/medias/abcd1234",
  "date": "2024-02-20",
  "description": "Discussion about hiring, managing, and scaling design teams in fast-growing companies.",
  "type": "podcast",
  "status": "published"
}
```

## GraphQL Query Structure

The speaking page uses this GraphQL query structure:

```graphql
query SpeakingPageQuery {
  directus {
    speaking(filter: { status: { _eq: "published" } }, sort: ["-date"]) {
      id
      title
      event_name
      video_url
      date
      description
      status
    }
    podcast: speaking(filter: { 
      status: { _eq: "published" }, 
      type: { _eq: "podcast" } 
    }, sort: ["-date"]) {
      id
      title
      podcast_name: event_name
      video_url
      date
      description
      status
    }
  }
}
```

## Video Thumbnail Support

The page automatically extracts thumbnails from:

### YouTube URLs
- Format: `https://www.youtube.com/watch?v=VIDEO_ID`
- Format: `https://youtu.be/VIDEO_ID`
- Thumbnail: `https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg`

### Wistia URLs
- Format: `https://company.wistia.com/medias/VIDEO_ID`
- Thumbnail: `https://embed-fastly.wistia.com/deliveries/VIDEO_ID.jpg`

## Setup Instructions

1. **Create Collection**: In Directus Admin → Settings → Data Model → Create Collection
2. **Add Fields**: Add each field listed above with the specified configurations
3. **Set Permissions**: Configure permissions for Public and Administrator roles
4. **Add Content**: Create speaking engagements and podcast entries
5. **Publish**: Set status to "published" for items you want to display

## Notes

- The page will show empty states with helpful messages when no content is available
- Videos open in new tabs when clicked
- Thumbnails have fallback images if video thumbnail extraction fails
- The page is fully responsive and matches the dark theme from your Figma design
- Past audiences are currently hardcoded but can be made dynamic by creating an additional `audiences` collection if needed
