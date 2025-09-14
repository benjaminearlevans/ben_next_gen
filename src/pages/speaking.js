import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"

const SpeakingPage = () => {
  const data = useStaticQuery(graphql`
    query SpeakingPageQuery {
      directus {
        speaking(filter: { status: { _eq: "published" } }, sort: ["-date"]) {
          id
          title
          event_name
          video_url
          date
          description
          type
        }
        post(filter: { 
          status: { _eq: "published" }
          type: { _eq: "podcast" }
        }, sort: ["-date_created"]) {
          id
          title
          slug
          excerpt
          date_created
          type
        }
        companies(filter: { status: { _eq: "published" } }) {
          id
          name
        }
      }
    }
  `)

  const speakingPosts = data?.directus?.speaking || []
  const podcastEpisodes = data?.directus?.post || []
  const companies = data?.directus?.companies || []

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
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/images/default-video-thumb.jpg'
  }

  // Helper function to get Wistia thumbnail
  const getWistiaThumbnail = (url) => {
    // Extract Wistia video ID from URL
    const match = url.match(/wistia\.com\/medias\/([a-zA-Z0-9]+)/)
    if (match && match[1]) {
      return `https://embed-fastly.wistia.com/deliveries/${match[1]}/thumbnail.jpg`
    }
    return '/images/default-video-thumb.jpg'
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
      <div className="min-h-screen bg-[#000000] text-[#ffffff]">
        <div className="max-w-[960px] mx-auto px-8 py-12">
          {/* Speaking Section */}
          <section className="mb-24">
            <h2 className="text-4xl font-bold text-[#ffffff] mb-4">Speaking</h2>
            <p className="text-[#c4c4c4] mb-12 max-w-2xl">
              Keynotes, panels, and workshops to enable product leaders to build experiences that resonate with everyone,
              everywhere
            </p>

            <div className="grid grid-cols-3 gap-8">
              {speakingEngagements.map((engagement) => (
                <div key={engagement.id} className="flex flex-col gap-2 my-0 py-0">
                  <Link to={`/speaking/${engagement.id}/`}>
                    <div className="w-[280px] h-[440px] bg-[#c4c4c4] rounded hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.3)] transition-all duration-[250ms] cursor-pointer my-1"></div>
                  </Link>
                  <div className="max-w-[680px]">
                    <h3 className="text-[#ffffff] my-0 mx-0 font-normal mb-2 text-xl leading-tight">{engagement.title}</h3>
                    <p className="text-[#c4c4c4] h-4 font-normal text-sm">
                      {new Date(engagement.date_created).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Podcasts Section */}
          <section className="mb-20">
            <h2 className="text-4xl font-bold text-[#ffffff] mb-4">Podcasts</h2>
            <p className="text-[#c4c4c4] mb-12 max-w-2xl">
              Keynotes, panels, and workshops to enable product leaders to build experiences that resonate with everyone,
              everywhere.
            </p>

            <div className="grid grid-cols-3 gap-6 py-0 h-auto">
              {podcastEpisodes.map((episode) => (
                <div key={episode.id} className="space-y-3">
                  <Link to={`/podcast/${episode.id}/`}>
                    <div className="aspect-square bg-[#c4c4c4] rounded hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.3)] transition-all duration-[250ms] cursor-pointer py-0 h-auto my-1 mb-3"></div>
                  </Link>
                  <h3 className="text-[#ffffff] font-medium text-xl mb-2 mr-0 leading-tight">{episode.title}</h3>
                  <p className="text-[#c4c4c4] text-sm h-4">
                    {new Date(episode.date_created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Past Audiences Section */}
          <section>
            <h2 className="text-4xl font-bold text-[#ffffff] mb-4">Past audiences</h2>
            <p className="text-[#c4c4c4] mb-12 max-w-2xl">
              Keynotes, panels, and workshops to enable product leaders to build experiences that resonate with everyone,
              everywhere.
            </p>

            <div className="grid grid-cols-3 gap-x-12 gap-y-8">
              {pastAudiences.map((audience, index) => (
                <div key={index} className="space-y-2">
                  <div 
                    className="text-[#ffffff] h-8 flex items-center"
                    dangerouslySetInnerHTML={{ __html: audience.logo_svg || audience.logo }}
                  />
                  <p className="text-[#c4c4c4] text-sm leading-relaxed">{audience.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  )
}

export default SpeakingPage
