import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { Button } from "./ui/button"
import { cn } from "../lib/utils"
import SearchButton from "./search/SearchButton"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  // Fetch navigation and site settings from Directus
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      directus {
        navigation(filter: { status: { _eq: "published" } }, sort: ["sort_order"]) {
          id
          label
          url
          is_external
          is_cta
          sort_order
        }
        site_settings {
          site_title
        }
      }
    }
  `)

  // Fallback navigation if Directus collection doesn't exist yet
  const navigation = data?.directus?.navigation || [
    { id: '1', label: 'Blog', url: '/blog/', is_external: false, is_cta: false },
    { id: '2', label: 'Speaking', url: '/speaking/', is_external: false, is_cta: false },
    { id: '3', label: 'Podcast', url: '/podcast/', is_external: false, is_cta: false },
    { id: '4', label: 'Contact', url: '/contact/', is_external: false, is_cta: true }
  ]

  const siteTitle = data?.directus?.site_settings?.site_title || "Benjamin Carlson"

  // Split navigation items into left and right groups
  const leftNavItems = navigation.filter(item => !item.is_cta)
  const rightNavItems = navigation.filter(item => item.is_cta)

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
        </div>
        <div className="flex space-x-8 items-center">
          <SearchButton className="text-[#ffffff] hover:text-[#c4c4c4]" />
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
            {navigation.map(item => (
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
