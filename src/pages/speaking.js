import React from "react"
import { Link } from "gatsby"
import Layout from "../components/layout"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"

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
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Speaking</h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              I've had the privilege of sharing insights and connecting with amazing 
              communities around the world. Here's a collection of my recent talks, 
              podcast appearances, and speaking engagements.
            </p>
          </div>
        </section>

        {/* Speaking Engagements */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Speaking</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {speakingEngagements.map((engagement) => (
                <Card key={engagement.id} className="bg-card border-border overflow-hidden group cursor-pointer">
                  <Link to={`/speaking/${engagement.slug}/`}>
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-background/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-background/20 transition-colors">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-foreground ml-1">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {engagement.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-1">{engagement.event_name}</p>
                      <p className="text-muted-foreground/80 text-sm">
                        {new Date(engagement.event_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Podcasts */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Podcasts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              {podcastEpisodes.map((episode) => (
                <Card key={episode.id} className="bg-card border-border overflow-hidden group cursor-pointer">
                  <Link to={`/podcast/${episode.slug}/`}>
                    <div className="aspect-video bg-muted relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-primary/20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-background/10 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-background/20 transition-colors">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-foreground ml-0.5">
                            <path d="M8 5v14l11-7z" fill="currentColor"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-secondary transition-colors line-clamp-2">
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
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Past audiences</h2>
            <p className="text-muted-foreground mb-8 max-w-3xl leading-relaxed">
              I've been fortunate to speak at events and connect with incredible 
              communities across various industries and disciplines.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastAudiences.map((audience, index) => (
                <div key={index} className="border-l-2 border-border pl-4 py-2">
                  <h3 className="text-foreground font-semibold mb-1">{audience.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{audience.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default SpeakingPage
