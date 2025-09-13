import React from "react"
import Layout from "../components/layout"
import Hero from "../components/hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Link } from "gatsby"

const IndexPage = () => {
  // Static fallback content until Directus collections are set up
  const posts = [
    {
      id: 1,
      title: "Getting Started with React and TypeScript",
      slug: "getting-started-react-typescript",
      excerpt: "Learn how to set up a modern React application with TypeScript for better development experience and type safety.",
      date_created: "2024-01-15",
      type: "article",
      featured_image: null,
      author: {
        first_name: "Benjamin",
        last_name: "Carlson"
      }
    },
    {
      id: 2,
      title: "Building Modern Web Applications with Gatsby",
      slug: "building-modern-web-apps-gatsby",
      excerpt: "Discover how Gatsby's static site generation can help you build fast, SEO-friendly websites with modern tooling.",
      date_created: "2024-01-10",
      type: "article",
      featured_image: null,
      author: {
        first_name: "Benjamin",
        last_name: "Carlson"
      }
    },
    {
      id: 3,
      title: "The Future of Web Development",
      slug: "future-of-web-development",
      excerpt: "Exploring upcoming trends and technologies that will shape the future of web development in the coming years.",
      date_created: "2024-01-05",
      type: "article",
      featured_image: null,
      author: {
        first_name: "Benjamin",
        last_name: "Carlson"
      }
    }
  ]

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Layout>
      <Hero />
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Latest Posts</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.id} className="h-full flex flex-col">
                {post.featured_image && (
                  <div className="aspect-video bg-muted rounded-t-lg"></div>
                )}
                <CardHeader className="flex-1">
                  <CardTitle className="line-clamp-2">
                    <Link 
                      to={`/blog/${post.slug}/`}
                      className="hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {post.author?.first_name} {post.author?.last_name}
                    </span>
                    <time dateTime={post.date_created}>
                      {formatDate(post.date_created)}
                    </time>
                  </div>
                  <Button asChild className="w-full mt-4" variant="outline">
                    <Link to={`/blog/${post.slug}/`}>
                      Read More
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/blog/">
                View All Posts
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default IndexPage
