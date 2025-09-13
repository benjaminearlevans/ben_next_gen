import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { Button } from './ui/button'

const Hero = () => {
  // Fetch hero content from Directus site settings
  const data = useStaticQuery(graphql`
    query HeroQuery {
      directus {
        site_settings {
          hero_title
          hero_subtitle
          hero_cta_primary_text
          hero_cta_primary_url
          hero_cta_secondary_text
          hero_cta_secondary_url
        }
      }
    }
  `)

  // Fallback content if Directus collection doesn't exist yet
  const settings = data?.directus?.site_settings || {
    hero_title: "Hi, I'm Benjamin Carlson",
    hero_subtitle: "I'm a developer, speaker, and content creator passionate about building great web experiences.",
    hero_cta_primary_text: "Read My Blog",
    hero_cta_primary_url: "/blog/",
    hero_cta_secondary_text: "Get in Touch",
    hero_cta_secondary_url: "/contact/"
  }

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            {settings.hero_title}
          </h1>
          <p className="text-xl text-muted-foreground leading-7 mb-8 max-w-3xl mx-auto">
            {settings.hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-muted">
              <Link to={settings.hero_cta_primary_url}>
                {settings.hero_cta_primary_text}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-background text-background hover:bg-background hover:text-primary">
              <Link to={settings.hero_cta_secondary_url}>
                {settings.hero_cta_secondary_text}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
