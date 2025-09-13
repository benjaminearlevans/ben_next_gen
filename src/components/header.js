import React, { useState } from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"

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
    const baseClasses = cn(
      "text-foreground hover:text-muted-foreground transition-colors",
      isMobile && "block px-3 py-2 text-base font-medium"
    )

    if (item.is_cta) {
      if (item.is_external) {
        return (
          <Button key={item.id} asChild size="sm">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          </Button>
        )
      }
      return (
        <Button key={item.id} asChild size="sm">
          <Link to={item.url}>
            {item.label}
          </Link>
        </Button>
      )
    }

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
        activeClassName="text-muted-foreground"
      >
        {item.label}
      </Link>
    )
  }

  return (
    <header className="bg-[#000000] text-[#ffffff] sticky top-0 z-50">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-6">
        <div className="flex space-x-8 items-center">
          {leftNavItems.map(item => (
            item.is_external ? (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                to={item.url}
                className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors"
                activeClassName="text-[#c4c4c4]"
              >
                {item.label}
              </Link>
            )
          ))}
          <a href="#" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors flex items-center gap-1">
            More
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </a>
        </div>
        <div className="flex space-x-8">
          {rightNavItems.map(item => (
            item.is_external ? (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.id}
                to={item.url}
                className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors"
                activeClassName="text-[#c4c4c4]"
              >
                {item.label}
              </Link>
            )
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#000000]">
          <div className="px-8 py-4 space-y-2 border-t border-[#333333]">
            {navigationItems.map(item => (
              item.is_external ? (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 text-base font-medium text-[#ffffff] hover:text-[#c4c4c4] transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.url}
                  className="block px-3 py-2 text-base font-medium text-[#ffffff] hover:text-[#c4c4c4] transition-colors"
                  activeClassName="text-[#c4c4c4]"
                >
                  {item.label}
                </Link>
              )
            ))}
          </div>
        </div>
      )}

      {/* Mobile menu button - positioned absolutely */}
      <div className="md:hidden absolute top-6 right-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          className="text-[#ffffff] hover:text-[#c4c4c4] hover:bg-transparent"
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
        </Button>
      </div>
    </header>
  )
}

export default Header
