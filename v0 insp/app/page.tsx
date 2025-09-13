export default function HomePage() {
  const speakingVideos = [
    { title: "Video title", date: "November 21 2024" },
    { title: "Video title 2", date: "November 21 2024" },
    { title: "Video title", date: "November 21 2024" },
    { title: "Video title 2", date: "November 21 2024" },
    { title: "Video title", date: "November 21 2024" },
    { title: "Video title 2", date: "November 21 2024" },
  ]

  const podcastVideos = [
    { title: "Video title", date: "November 21 2024" },
    { title: "Video title", date: "November 21 2024" },
    { title: "Video title", date: "November 21 2024" },
    { title: "Video title", date: "November 21 2024" },
    { title: "Video title", date: "November 21 2024" },
    { title: "Video title", date: "November 21 2024" },
  ]

  const pastAudiences = [
    {
      name: "Berkeley",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-2xl font-bold">
            UC Berkeley
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Berkeley",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-2xl font-bold">
            UC Berkeley
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "AIGA",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 120 60" fill="currentColor">
          <text x="0" y="40" className="text-3xl font-bold">
            AIGA
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Adobe",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624V1.376z" />
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Adobe",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624V1.376z" />
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "AIGA",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 120 60" fill="currentColor">
          <text x="0" y="40" className="text-3xl font-bold">
            AIGA
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Adobe",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624V1.376z" />
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Salesforce",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <g transform="scale(0.3)">
            <path d="M163.6 69.2c-6.9-8.8-17.8-14.5-30.1-14.5-3.5 0-6.9.5-10.1 1.4-5.2-20.2-23.5-35.2-45.4-35.2-18.4 0-34.4 10.7-42.1 26.2-2.7-.6-5.5-.9-8.4-.9-20.1 0-36.4 16.3-36.4 36.4 0 1.1.1 2.2.2 3.3C-3.1 89.9-8 97.6-8 106.5c0 13.3 10.8 24.1 24.1 24.1h135.1c17.7 0 32-14.3 32-32 0-13.4-8.2-24.9-19.9-29.4z" />
            <path d="M133.5 54.7c-3.5 0-6.9.5-10.1 1.4-5.2-20.2-23.5-35.2-45.4-35.2-18.4 0-34.4 10.7-42.1 26.2-2.7-.6-5.5-.9-8.4-.9-20.1 0-36.4 16.3-36.4 36.4 0 1.1.1 2.2.2 3.3-4.4 4-7.2 9.7-7.2 16.1 0 12 9.7 21.7 21.7 21.7h127.7c16.6 0 30-13.4 30-30s-13.4-30-30-30z" />
          </g>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Stanford",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-2xl font-bold">
            Stanford
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Artifact Conference",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-xl font-bold">
            Artifact
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "InteractionIX",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-xl font-bold">
            IxDA
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "DesignerFund",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-xl font-bold">
            Designer Fund
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Invitation",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-xl font-bold">
            Invitation
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Product Craft",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-xl font-bold">
            Product Craft
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Front Conf",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-xl font-bold">
            Front Conf
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "R&D Conference",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-xl font-bold">
            R&D Conf
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "LinkedIn",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "worksCO",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-xl font-bold">
            worksCO
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Tech Inclusion",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-lg font-bold">
            Tech Inclusion
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "SF Design Week",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-lg font-bold">
            SF Design Week
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Wired",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 120 60" fill="currentColor">
          <text x="0" y="40" className="text-3xl font-bold">
            WIRED
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Design Matters - Mexico",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-lg font-bold">
            Design Matters
          </text>
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Meta",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624V1.376z" />
        </svg>
      ),
      description: "Delivered a talk to help teams understand the benefits of inclusive design",
    },
    {
      name: "Product Equity Summit",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-lg font-bold">
            Product Equity
          </text>
        </svg>
      ),
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
      name: "Designer Fund",
      logo: (
        <svg className="h-8 w-auto" viewBox="0 0 200 60" fill="currentColor">
          <text x="0" y="40" className="text-xl font-bold">
            Designer Fund
          </text>
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
    },
  ]

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff]">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6">
        <div className="flex space-x-8 items-center">
          <a href="/" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
            Home
          </a>
          <a href="#" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
            Making
          </a>
          <a href="#" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
            Speaking
          </a>
          <a href="#" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
            Search
          </a>
          <a href="#" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors flex items-center gap-1">
            More
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </a>
        </div>
        <div className="flex space-x-8">
          <a href="/contact" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
            Contact
          </a>
        </div>
      </nav>

      <div className="max-w-[960px] mx-auto px-8 py-12">
        {/* Speaking Section */}
        <section className="mb-24">
          <h2 className="text-4xl font-bold text-[#ffffff] mb-4">Speaking</h2>
          <p className="text-[#c4c4c4] mb-12 max-w-2xl">
            Keynotes, panels, and workshops to enable product leaders to build experiences that resonate with everyone,
            everywhere
          </p>

          <div className="grid grid-cols-3 gap-8">
            {speakingVideos.map((video, index) => (
              <div key={index} className="flex flex-col gap-2 my-0 py-0">
                <div className="w-[280px] h-[440px] bg-[#c4c4c4] rounded hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.3)] transition-all duration-[250ms] cursor-pointer my-1"></div>
                <div className="max-w-[680px]">
                  <h3 className="text-[#ffffff] my-0 mx-0 space-y-0 h-6 font-normal mb-2 text-xl">{video.title}</h3>
                  <p className="text-[#c4c4c4] h-4 font-normal text-sm text-muted-foreground">{video.date}</p>
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
            {podcastVideos.map((video, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-square bg-[#c4c4c4] rounded hover:shadow-[0_0_20px_4px_rgba(255,255,255,0.3)] transition-all duration-[250ms] cursor-pointer py-0 h-auto my-1 mb-3"></div>
                <h3 className="text-[#ffffff] font-medium h-6 text-xl mb-2 mr-0">{video.title}</h3>
                <p className="text-[#c4c4c4] text-sm text-muted-foreground h-4">{video.date}</p>
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
                <div className="text-[#ffffff] h-8 flex items-center">{audience.logo}</div>
                <p className="text-[#c4c4c4] text-sm leading-relaxed">{audience.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
