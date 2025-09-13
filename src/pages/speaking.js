import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import EditorialLayout from "../components/layouts/editorial-layout"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

const SpeakingPage = () => {
  // Static fallback content until Directus collections are set up
  const speakingEngagements = [
    {
      id: 1,
      title: "Building Modern Web Applications",
      slug: "building-modern-web-applications",
      event_name: "React Conference 2024",
      video_url: "https://youtube.com/watch?v=example1",
      event_date: "2024-01-15",
      excerpt: "Deep dive into modern React patterns and performance optimization techniques."
    },
    {
      id: 2,
      title: "The Future of Frontend Development",
      slug: "future-of-frontend-development",
      event_name: "Frontend Masters Live",
      video_url: "https://youtube.com/watch?v=example2",
      event_date: "2024-01-10",
      excerpt: "Exploring upcoming trends in frontend development and tooling."
    },
    {
      id: 3,
      title: "Design Systems at Scale",
      slug: "design-systems-at-scale",
      event_name: "Design Systems Conference",
      video_url: "https://youtube.com/watch?v=example3",
      event_date: "2023-12-20",
      excerpt: "How to build and maintain design systems for large organizations."
    },
    {
      id: 4,
      title: "TypeScript Best Practices",
      slug: "typescript-best-practices",
      event_name: "TypeScript Summit",
      video_url: "https://youtube.com/watch?v=example4",
      event_date: "2023-12-15",
      excerpt: "Advanced TypeScript patterns for better code quality and developer experience."
    }
  ]

  const podcastEpisodes = [
    {
      id: 1,
      title: "The Developer's Journey",
      slug: "developers-journey",
      podcast_name: "Code & Coffee",
      audio_url: "https://example.com/podcast1.mp3",
      date_created: "2024-01-20",
      excerpt: "Discussing career growth and learning paths in software development."
    },
    {
      id: 2,
      title: "Web Performance Optimization",
      slug: "web-performance-optimization",
      podcast_name: "Frontend Focus",
      audio_url: "https://example.com/podcast2.mp3",
      date_created: "2024-01-12",
      excerpt: "Techniques and tools for optimizing web application performance."
    },
    {
      id: 3,
      title: "Building Accessible Interfaces",
      slug: "building-accessible-interfaces",
      podcast_name: "A11y Talks",
      audio_url: "https://example.com/podcast3.mp3",
      date_created: "2024-01-05",
      excerpt: "Best practices for creating inclusive and accessible web experiences."
    },
    {
      id: 4,
      title: "The State of React in 2024",
      slug: "state-of-react-2024",
      podcast_name: "React Roundup",
      audio_url: "https://example.com/podcast4.mp3",
      date_created: "2023-12-28",
      excerpt: "Exploring React's evolution and what's coming next in the ecosystem."
    },
    {
      id: 5,
      title: "CSS Grid and Flexbox Mastery",
      slug: "css-grid-flexbox-mastery",
      podcast_name: "CSS Podcast",
      audio_url: "https://example.com/podcast5.mp3",
      date_created: "2023-12-20",
      excerpt: "Advanced layout techniques using modern CSS Grid and Flexbox."
    },
    {
      id: 6,
      title: "JavaScript Frameworks Comparison",
      slug: "javascript-frameworks-comparison",
      podcast_name: "JS Party",
      audio_url: "https://example.com/podcast6.mp3",
      date_created: "2023-12-15",
      excerpt: "Comparing popular JavaScript frameworks and their use cases."
    }
  ]

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

  const pastAudiences = [
    { name: "Bullhorn", description: "Recruiting and staffing technology conference" },
    { name: "BookClub", description: "Book club discussion on leadership" },
    { name: "UXD", description: "User experience design meetup" },
    { name: "Adobe", description: "Creative technology summit" },
    { name: "Dribbble", description: "Design community event" },
    { name: "Adobe", description: "Creative professionals workshop" },
    { name: "Education", description: "Educational technology conference" },
    { name: "Breakfast", description: "Morning networking event" },
    { name: "Awwwards Conference", description: "Web design and development conference" },
    { name: "LinkedIn", description: "Professional networking event" },
    { name: "Product Club", description: "Product management meetup" },
    { name: "Front-End", description: "Frontend development conference" },
    { name: "HCI Conference", description: "Human-computer interaction symposium" },
    { name: "Figma", description: "Design tool user conference" },
    { name: "Football Media Summit", description: "Sports media and technology event" },
    { name: "Dribbble", description: "Design showcase event" },
    { name: "Design Thinking + Meetup", description: "Design methodology workshop" },
    { name: "Figma", description: "Design system conference" },
    { name: "Dribbble", description: "Creative community gathering" }
  ]

  return (
    <Layout>
      <EditorialLayout>
        {/* Hero Section */}
        <section className="py-16">
          <div className="max-w-article mx-auto">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-6">Speaking</h1>
            <p className="text-xl text-muted-foreground leading-7 mb-8">
              I've had the privilege of sharing insights and connecting with amazing 
              communities around the world. Here's a collection of my recent talks, 
              podcast appearances, and speaking engagements.
            </p>
          </div>
        </section>

        {/* Speaking Engagements */}
        <section className="py-12">
          <div className="max-w-container-content mx-auto">
            <div className="mb-12">
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4">Recent Talks</h2>
              <p className="text-muted-foreground leading-7">
                Sharing knowledge and insights with developer communities worldwide.
              </p>
            </div>
            <div className="space-y-8">
              {speakingEngagements.map((engagement) => (
                <Card key={engagement.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/speaking/${engagement.slug}/`} className="block">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 aspect-video md:aspect-square bg-muted relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-background/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-foreground ml-0.5">
                              <path d="M8 5v14l11-7z" fill="currentColor"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                      <CardContent className="md:w-2/3 p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            Speaking
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(engagement.event_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                          {engagement.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3">{engagement.event_name}</p>
                        <p className="text-sm leading-relaxed">{engagement.excerpt}</p>
                      </CardContent>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Podcasts */}
        <section className="py-12 border-t">
          <div className="max-w-container-content mx-auto">
            <div className="mb-12">
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4">Podcast Appearances</h2>
              <p className="text-muted-foreground leading-7">
                Conversations about design, development, and building great products.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcastEpisodes.map((episode) => (
                <Card key={episode.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <Link to={`/podcast/${episode.slug}/`} className="block">
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-primary/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-background/80 rounded-full flex items-center justify-center backdrop-blur-sm">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-foreground ml-0.5">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          Podcast
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-1 hover:text-primary transition-colors line-clamp-2">
                        {episode.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">{episode.podcast_name}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Past Audiences */}
        <section className="py-12 border-t">
          <div className="max-w-article mx-auto">
            <div className="mb-12">
              <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight mb-4">Past Audiences</h2>
              <p className="text-muted-foreground leading-7">
                I've been fortunate to speak at events and connect with incredible 
                communities across various industries and disciplines.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastAudiences.map((audience, index) => (
                <div key={index} className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <h3 className="font-semibold mb-2">{audience.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{audience.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </EditorialLayout>
    </Layout>
  )
}

export default SpeakingPage
