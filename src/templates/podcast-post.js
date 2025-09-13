import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const PodcastPost = ({ data }) => {
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

  // Check if audio URL is a direct audio file
  const isDirectAudioFile = (url) => {
    if (!url) return false
    return url.match(/\.(mp3|wav|ogg|m4a)$/i)
  }

  // Extract Spotify episode ID
  const getSpotifyEpisodeId = (url) => {
    if (!url) return null
    const match = url.match(/spotify\.com\/episode\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  }

  // Extract Apple Podcasts ID (more complex, simplified here)
  const isApplePodcast = (url) => {
    return url && url.includes('podcasts.apple.com')
  }

  return (
    <Layout>
      <article className="podcast-post">
        <div className="container">
          <header className="podcast-post-header">
            <h1 className="podcast-post-title">{post.title}</h1>
            <div className="podcast-post-meta">
              {post.podcast_name && (
                <span className="podcast-name">{post.podcast_name}</span>
              )}
              {post.duration && (
                <span className="podcast-duration">{post.duration}</span>
              )}
              <time className="podcast-date">
                {formatDate(post.date_created)}
              </time>
              <span className="post-type-badge podcast">Podcast</span>
            </div>
            {post.excerpt && (
              <p className="podcast-post-excerpt">{post.excerpt}</p>
            )}
          </header>

          {post.audio_url && (
            <div className="podcast-player-section">
              <div className="audio-player">
                {isDirectAudioFile(post.audio_url) ? (
                  <audio controls className="native-audio-player">
                    <source src={post.audio_url} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : getSpotifyEpisodeId(post.audio_url) ? (
                  <iframe 
                    src={`https://open.spotify.com/embed/episode/${getSpotifyEpisodeId(post.audio_url)}`}
                    width="100%" 
                    height="232" 
                    frameBorder="0" 
                    allowtransparency="true" 
                    allow="encrypted-media"
                    title={`Spotify player for ${post.title}`}
                  />
                ) : isApplePodcast(post.audio_url) ? (
                  <div className="podcast-link-player">
                    <div className="podcast-artwork">
                      {post.featured_image ? (
                        <img 
                          src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${post.featured_image.id}`}
                          alt={post.title}
                        />
                      ) : (
                        <div className="default-artwork">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="podcast-info">
                      <h4>{post.title}</h4>
                      <p>{post.podcast_name}</p>
                      <a 
                        href={post.audio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="listen-button"
                      >
                        Listen on Apple Podcasts
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="external-podcast-player">
                    <div className="podcast-artwork">
                      {post.featured_image ? (
                        <img 
                          src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${post.featured_image.id}`}
                          alt={post.title}
                        />
                      ) : (
                        <div className="default-artwork">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="podcast-info">
                      <h4>{post.title}</h4>
                      <p>{post.podcast_name}</p>
                      <a 
                        href={post.audio_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="listen-button"
                      >
                        Listen to Episode
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="podcast-post-content">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <div className="podcast-details">
            <h3>Episode Details</h3>
            <div className="details-grid">
              {post.podcast_name && (
                <div className="detail-item">
                  <strong>Podcast:</strong> {post.podcast_name}
                </div>
              )}
              {post.duration && (
                <div className="detail-item">
                  <strong>Duration:</strong> {post.duration}
                </div>
              )}
              <div className="detail-item">
                <strong>Published:</strong> {formatDate(post.date_created)}
              </div>
              {post.audio_url && (
                <div className="detail-item">
                  <strong>Listen:</strong> 
                  <a href={post.audio_url} target="_blank" rel="noopener noreferrer">
                    Open in Podcast App
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
  query PodcastPostQuery($id: String!) {
    directus {
      post(filter: { id: { _eq: $id }, type: { _eq: "podcast" } }) {
        id
        title
        slug
        content
        excerpt
        status
        date_created
        type
        audio_url
        podcast_name
        duration
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

export default PodcastPost
