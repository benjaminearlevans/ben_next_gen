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
      }
    }
  `)

  const speakingPosts = data?.directus?.speaking || [
    {
      id: "1",
      title: "Building Modern Web Applications",
      event_name: "Tech Conference 2024",
      date: "2024-01-20",
      description: "A deep dive into modern web development practices."
    }
  ]
  const podcastEpisodes = data?.directus?.post || []

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

  // Fetch companies/audiences from Directus
  const companiesData = useStaticQuery(graphql`
    query CompaniesQuery {
      directus {
        companies(filter: { status: { _eq: "published" } }, sort: ["sort_order"]) {
          id
          name
          logo {
            id
            filename_download
            width
            height
          }
          website_url
          sort_order
        }
      }
    }
  `)

  const companies = companiesData?.directus?.companies || [
    {
      id: "1",
      name: "Tech Conference 2024",
      website_url: "https://techconf.com",
      description: "Delivered a talk to help teams understand the benefits of inclusive design"
    },
    {
      name: "Adobe",
      logo_svg: '<svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor"><path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624V1.376z" /></svg>',
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Salesforce",
      logo_svg: '<svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor"><g transform="scale(0.3)"><path d="M163.6 69.2c-6.9-8.8-17.8-14.5-30.1-14.5-3.5 0-6.9.5-10.1 1.4-5.2-20.2-23.5-35.2-45.4-35.2-18.4 0-34.4 10.7-42.1 26.2-2.7-.6-5.5-.9-8.4-.9-20.1 0-36.4 16.3-36.4 36.4 0 1.1.1 2.2.2 3.3C-3.1 89.9-8 97.6-8 106.5c0 13.3 10.8 24.1 24.1 24.1h135.1c17.7 0 32-14.3 32-32 0-13.4-8.2-24.9-19.9-29.4z" /><path d="M133.5 54.7c-3.5 0-6.9.5-10.1 1.4-5.2-20.2-23.5-35.2-45.4-35.2-18.4 0-34.4 10.7-42.1 26.2-2.7-.6-5.5-.9-8.4-.9-20.1 0-36.4 16.3-36.4 36.4 0 1.1.1 2.2.2 3.3-4.4 4-7.2 9.7-7.2 16.1 0 12 9.7 21.7 21.7 21.7h127.7c16.6 0 30-13.4 30-30s-13.4-30-30-30z" /></g></svg>',
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Netflix",
      logo_svg: '<svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor"><text x="0" y="40" className="text-2xl font-bold">Netflix</text></svg>',
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Airbnb",
      logo_svg: '<svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor"><text x="0" y="40" className="text-2xl font-bold">Airbnb</text></svg>',
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Dropbox",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 2L0 6l6 4 6-4-6-4zM18 2l-6 4 6 4 6-4-6-4zM0 14l6-4 6 4-6 4-6-4zM18 10l6 4-6 4-6-4 6-4zM6 16l6 4 6-4-6-4-6 4z" />
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "SXSW",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 120 60" fill="currentColor">
          <text x="0" y="40" className="text-3xl font-bold">
            SXSW
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    }
  ]

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
