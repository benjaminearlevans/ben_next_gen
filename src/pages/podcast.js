import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import EditorialLayout from "../components/layouts/editorial-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

const PodcastPage = () => {
  const data = useStaticQuery(graphql`
    query PodcastPageQuery {
      directus {
        post(filter: { 
          status: { _eq: "published" }
          type: { _eq: "podcast" }
        }, sort: ["-date_created"]) {
          id
          title
          excerpt
          date_created
          type
          status
          audio_url
          podcast_name
          duration
          featured_image {
            id
            title
          }
        }
      }
    }
  `)

  const podcasts = data?.directus?.post || []

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
      <EditorialLayout>
        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-article mx-auto">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6">Podcast</h1>
            <p className="text-xl text-muted-foreground leading-7 mb-8">
              Listen to my conversations about design, leadership, and building 
              great products. From deep dives into design systems to discussions 
              about scaling teams, these episodes cover the topics that matter most 
              in our industry.
            </p>
          </div>
        </section>

        {/* Podcast Episodes */}
        <section className="py-12">
          <div className="max-w-container-content mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {podcasts.length > 0 ? (
                podcasts.map((podcast) => (
                  <Card key={podcast.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      {podcast.featured_image ? (
                        <img 
                          src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${podcast.featured_image.id}`}
                          alt={podcast.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Podcast
                        </Badge>
                        {podcast.duration && (
                          <span className="text-xs text-muted-foreground">{podcast.duration}</span>
                        )}
                      </div>
                      
                      <CardTitle className="line-clamp-2">
                        <Link to={`/podcast/${podcast.id}`} className="hover:text-primary transition-colors">
                          {podcast.title}
                        </Link>
                      </CardTitle>
                      
                      <time className="text-sm text-muted-foreground">
                        {formatDate(podcast.date_created)}
                      </time>
                    </CardHeader>
                    
                    <CardContent>
                      {podcast.excerpt && (
                        <CardDescription className="line-clamp-3 mb-4">{podcast.excerpt}</CardDescription>
                      )}

                      {/* Audio Player */}
                      {podcast.audio_url && (
                        <div className="space-y-4">
                          {isDirectAudioFile(podcast.audio_url) ? (
                            <audio controls className="w-full">
                              <source src={podcast.audio_url} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          ) : getSpotifyEpisodeId(podcast.audio_url) ? (
                            <div className="w-full">
                              <iframe 
                                src={`https://open.spotify.com/embed/episode/${getSpotifyEpisodeId(podcast.audio_url)}`}
                                width="100%" 
                                height="152" 
                                frameBorder="0" 
                                allowtransparency="true" 
                                allow="encrypted-media"
                                title={`Spotify player for ${podcast.title}`}
                                className="rounded-md"
                              />
                            </div>
                          ) : (
                            <Button asChild variant="outline" className="w-full">
                              <a 
                                href={podcast.audio_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mr-2">
                                  <path d="M8 5v14l11-7z" fill="currentColor"/>
                                </svg>
                                Listen to Episode
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No podcast episodes yet</h3>
                  <p className="text-muted-foreground">Podcast episodes will appear here once added to the CMS.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </EditorialLayout>
    </Layout>
  )
}


export default PodcastPage
