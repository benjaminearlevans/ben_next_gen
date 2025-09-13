import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"

const Header = ({ siteTitle }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Fetch navigation items from Directus
  const data = useStaticQuery(graphql`
    query NavigationQuery {
      directus {
        navigation(filter: { status: { _eq: "published" } }, sort: ["sort_order"]) {
          id
          label
          url
          is_external
          is_cta
          sort_order
        }
      }
    }
  `)

  // Use dynamic navigation items from Directus, fallback to static if none found
  const navigationItems = data?.directus?.navigation || [
    { id: 1, label: 'Home', url: '/', is_external: false, is_cta: false },
    { id: 2, label: 'Blog', url: '/blog/', is_external: false, is_cta: false },
    { id: 3, label: 'Speaking', url: '/speaking/', is_external: false, is_cta: false },
    { id: 4, label: 'Podcast', url: '/podcast/', is_external: false, is_cta: false },
    { id: 5, label: 'Get in Touch', url: '/contact/', is_external: false, is_cta: true }
  ]

  const dynamicSiteTitle = siteTitle || 'Benjamin Carlson'

  // Split navigation items into left and right groups
  const leftNavItems = navigationItems.filter(item => !item.is_cta)
  const rightNavItems = navigationItems.filter(item => item.is_cta)

  const renderNavigationLink = (item, isMobile = false) => {
    const baseClasses = isMobile
      ? "text-[#ffffff] hover:text-[#c4c4c4] transition-colors block px-3 py-2 text-base font-medium"
      : "text-[#ffffff] hover:text-[#c4c4c4] transition-colors"

    if (item.is_external) {
      return (
        <a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={baseClasses}
        >
          {item.label}
        </a>
      )
    }

    return (
      <Link
        key={item.id}
        to={item.url}
        className={baseClasses}
        activeClassName="text-[#c4c4c4]"
      >
        {item.label}
      </Link>
    )
  }

  return (
    <header className="bg-[#000000] sticky top-0 z-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6">
        <div className="flex space-x-8">
          {leftNavItems.map(item => renderNavigationLink(item, false))}
        </div>
        <div className="flex space-x-8">
          {rightNavItems.map(item => renderNavigationLink(item, false))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#000000]">
          <div className="px-8 py-4 space-y-2 border-t border-gray-800">
            {navigationItems.map(item => renderNavigationLink(item, true))}
          </div>
        </div>
      )}

      {/* Mobile menu button - positioned absolutely */}
      <div className="md:hidden absolute top-6 right-8">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
