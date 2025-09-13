import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

const PodcastPage = () => {
  // Static fallback content until Directus collections are set up
  const podcasts = [
    {
      id: 1,
      title: "Getting Started with Modern Web Development",
      slug: "getting-started-modern-web-dev",
      description: "In this episode, we discuss the fundamentals of modern web development and the tools that make it possible.",
      date_created: "2024-01-20",
      audio_url: "https://example.com/podcast1.mp3",
      duration: "45:30",
      episode_number: 1
    },
    {
      id: 2,
      title: "React Best Practices and Performance",
      slug: "react-best-practices-performance",
      description: "Deep dive into React performance optimization techniques and best practices for building scalable applications.",
      date_created: "2024-01-15",
      audio_url: "https://example.com/podcast2.mp3",
      duration: "52:15",
      episode_number: 2
    }
  ]

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

  // Check if it's an Apple Podcast URL
  const isApplePodcast = (url) => {
    return url && url.includes('podcasts.apple.com')
  }

  return (
    <Layout>
      <div className="podcast-page">
        {/* Hero Section */}
        <section className="podcast-hero">
          <div className="container">
            <h1 className="podcast-title">Podcast</h1>
            <p className="podcast-description">
              Listen to my conversations about design, leadership, and building 
              great products. From deep dives into design systems to discussions 
              about scaling teams, these episodes cover the topics that matter most 
              in our industry.
            </p>
          </div>
        </section>

        {/* Podcast Episodes */}
        <section className="podcast-section">
          <div className="container">
            <div className="podcast-grid">
              {podcasts.length > 0 ? (
                podcasts.map((podcast) => (
                  <article key={podcast.id} className="podcast-card">
                    <div className="podcast-artwork">
                      {podcast.featured_image ? (
                        <img 
                          src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${podcast.featured_image.id}`}
                          alt={podcast.title}
                        />
                      ) : (
                        <div className="default-artwork">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <div className="podcast-content">
                      <div className="podcast-meta">
                        {podcast.podcast_name && (
                          <span className="podcast-show">{podcast.podcast_name}</span>
                        )}
                        {podcast.duration && (
                          <span className="podcast-duration">{podcast.duration}</span>
                        )}
                        <time className="podcast-date">
                          {formatDate(podcast.date_created)}
                        </time>
                      </div>
                      
                      <h2 className="podcast-episode-title">
                        <Link to={`/podcast/${podcast.slug}`}>
                          {podcast.title}
                        </Link>
                      </h2>
                      
                      {podcast.excerpt && (
                        <p className="podcast-excerpt">{podcast.excerpt}</p>
                      )}

                      {/* Audio Player */}
                      {podcast.audio_url && (
                        <div className="podcast-player">
                          {isDirectAudioFile(podcast.audio_url) ? (
                            <audio controls className="native-audio-player">
                              <source src={podcast.audio_url} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          ) : getSpotifyEpisodeId(podcast.audio_url) ? (
                            <div className="spotify-player">
                              <iframe 
                                src={`https://open.spotify.com/embed/episode/${getSpotifyEpisodeId(podcast.audio_url)}`}
                                width="100%" 
                                height="152" 
                                frameBorder="0" 
                                allowtransparency="true" 
                                allow="encrypted-media"
                                title={`Spotify player for ${podcast.title}`}
                              />
                            </div>
                          ) : (
                            <div className="external-player">
                              <a 
                                href={podcast.audio_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="listen-button"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                  <path d="M8 5v14l11-7z" fill="currentColor"/>
                                </svg>
                                Listen to Episode
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state">
                  <h3>No podcast episodes yet</h3>
                  <p>Podcast episodes will appear here once added to the CMS.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}


export default PodcastPage
