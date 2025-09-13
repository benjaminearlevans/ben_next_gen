import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const SpeakingPost = ({ data }) => {
  const post = data.directus.post[0]

  if (!post) {
    return (
      <Layout>
        <div className="container">
          <h1>Post not found</h1>
        </div>
      </Layout>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to extract video ID from YouTube URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Helper function to get YouTube thumbnail
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url)
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  // Helper function to extract Wistia video ID
  const getWistiaVideoId = (url) => {
    if (!url) return null
    const regExp = /wistia\.com\/medias\/([a-zA-Z0-9]+)/
    const match = url.match(regExp)
    return match ? match[1] : null
  }

  // Helper function to get Wistia thumbnail
  const getWistiaThumbnail = (url) => {
    const videoId = getWistiaVideoId(url)
    return videoId ? `https://embed-fastly.wistia.com/deliveries/${videoId}.jpg` : null
  }

  // Get thumbnail based on video URL
  const getVideoThumbnail = (url) => {
    if (!url) return '/images/default-video-thumb.jpg'
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return getYouTubeThumbnail(url)
    } else if (url.includes('wistia.com')) {
      return getWistiaThumbnail(url)
    }
    return '/images/default-video-thumb.jpg'
  }

  return (
    <Layout>
      <article className="speaking-post">
        <div className="container">
          <header className="speaking-post-header">
            <h1 className="speaking-post-title">{post.title}</h1>
            <div className="speaking-post-meta">
              {post.event_name && (
                <span className="event-name">{post.event_name}</span>
              )}
              {post.event_date && (
                <time className="event-date">
                  {formatDate(post.event_date)}
                </time>
              )}
              <span className="post-type-badge speaking">Speaking</span>
            </div>
            {post.excerpt && (
              <p className="speaking-post-excerpt">{post.excerpt}</p>
            )}
          </header>

          {post.video_url && (
            <div className="speaking-video-section">
              <div className="video-player">
                <div className="video-thumbnail">
                  <img 
                    src={getVideoThumbnail(post.video_url)} 
                    alt={post.title}
                    onError={(e) => {
                      e.target.src = '/images/default-video-thumb.jpg'
                    }}
                  />
                  <div className="play-button">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M8 5v14l11-7z" fill="currentColor"/>
                    </svg>
                  </div>
                  <a 
                    href={post.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="video-overlay"
                    aria-label="Watch video"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="speaking-post-content">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          {post.featured_image && (
            <div className="speaking-post-image">
              <img 
                src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${post.featured_image.id}`}
                alt={post.featured_image.title || post.title}
              />
            </div>
          )}

          <div className="speaking-details">
            <h3>Speaking Details</h3>
            <div className="details-grid">
              {post.event_name && (
                <div className="detail-item">
                  <strong>Event:</strong> {post.event_name}
                </div>
              )}
              {post.event_date && (
                <div className="detail-item">
                  <strong>Date:</strong> {formatDate(post.event_date)}
                </div>
              )}
              {post.video_url && (
                <div className="detail-item">
                  <strong>Watch:</strong> 
                  <a href={post.video_url} target="_blank" rel="noopener noreferrer">
                    View Recording
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query SpeakingPostQuery($id: String!) {
    directus {
      post(filter: { id: { _eq: $id }, type: { _eq: "speaking" } }) {
        id
        title
        slug
        content
        excerpt
        status
        date_created
        type
        video_url
        event_name
        event_date
        author {
          id
          first_name
          last_name
        }
        featured_image {
          id
          title
        }
      }
    }
  }
`

export default SpeakingPost
