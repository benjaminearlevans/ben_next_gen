import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import EditorialLayout from "../components/layouts/editorial-layout"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

const PodcastPost = ({ data }) => {
  const post = data.directus.post[0]

  if (!post) {
    return (
      <Layout>
        <EditorialLayout>
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Podcast episode not found</h1>
            <p className="text-muted-foreground">The requested podcast episode could not be found.</p>
          </div>
        </EditorialLayout>
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
      <EditorialLayout>
        <article>
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">Podcast</Badge>
              {post.duration && (
                <span className="text-sm text-muted-foreground">{post.duration}</span>
              )}
            </div>
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              {post.podcast_name && (
                <span>{post.podcast_name}</span>
              )}
              <time>{formatDate(post.date_created)}</time>
            </div>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-7">{post.excerpt}</p>
            )}
          </header>

          {post.audio_url && (
            <Card className="breakout-medium mb-8">
              <CardContent className="p-6">
                {isDirectAudioFile(post.audio_url) ? (
                  <audio controls className="w-full">
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
                    className="rounded-md"
                  />
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {post.featured_image ? (
                        <img 
                          src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${post.featured_image.id}`}
                          alt={post.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{post.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{post.podcast_name}</p>
                      <Button asChild variant="outline">
                        <a 
                          href={post.audio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mr-2">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                          </svg>
                          {isApplePodcast(post.audio_url) ? 'Listen on Apple Podcasts' : 'Listen to Episode'}
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="prose prose-lg max-w-none mb-8">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Episode Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.podcast_name && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Podcast</dt>
                    <dd className="text-sm">{post.podcast_name}</dd>
                  </div>
                )}
                {post.duration && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Duration</dt>
                    <dd className="text-sm">{post.duration}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Published</dt>
                  <dd className="text-sm">{formatDate(post.date_created)}</dd>
                </div>
                {post.audio_url && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Listen</dt>
                    <dd className="text-sm">
                      <Button asChild variant="link" className="p-0 h-auto">
                        <a href={post.audio_url} target="_blank" rel="noopener noreferrer">
                          Open in Podcast App
                        </a>
                      </Button>
                    </dd>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </article>
      </EditorialLayout>
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
