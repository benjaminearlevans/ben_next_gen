import React from 'react'
import { Link } from 'gatsby'
import { Button } from './ui/button'

const Hero = () => {
  // Static content - will be replaced with dynamic content after Directus setup
  const heroTitle = "Hi, I'm Benjamin Carlson"
  const heroSubtitle = "I'm a developer, speaker, and content creator passionate about building great web experiences."

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            {heroTitle}
          </h1>
          <p className="text-xl text-muted-foreground leading-7 mb-8 max-w-3xl mx-auto">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-background text-primary hover:bg-muted">
              <Link to="/blog/">
                Read My Blog
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-background text-background hover:bg-background hover:text-primary">
              <Link to="/contact/">
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
