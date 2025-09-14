import React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import Hero from "../components/hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"

const IndexPage = () => {
  // Fetch featured posts from Directus
  const data = useStaticQuery(graphql`
    query HomepageQuery {
      directus {
        featured_posts(filter: { status: { _eq: "published" } }, sort: ["sort_order"]) {
          id
          post {
            id
            title
            slug
            excerpt
            type
            date_created
          }
          sort_order
        }
        post(filter: { 
          status: { _eq: "published" }
          type: { _eq: "article" }
        }, sort: ["-date_created"], limit: 3) {
          id
          title
          slug
          excerpt
          date_created
          type
          featured_image {
            id
            filename_download
            width
            height
          }
          author {
            first_name
            last_name
          }
        }
      }
    }
  `)

  // Use featured posts if available, otherwise fall back to latest articles
  const featuredPosts = data?.directus?.featured_posts?.map(fp => fp.post) || []
  const latestPosts = data?.directus?.post || [
    {
      id: "1",
      title: "Getting Started with Gatsby and Directus",
      slug: "gatsby-directus-guide",
      excerpt: "Learn how to build a modern website with Gatsby and Directus CMS.",
      type: "article",
      date_created: "2024-01-15"
    },
    {
      id: "2",
      title: "Building Dynamic Search with Algolia",
      slug: "algolia-search-integration",
      excerpt: "Implement powerful search functionality in your Gatsby site.",
      type: "tutorial",
      date_created: "2024-01-10"
    }
  ]
  const posts = featuredPosts.length > 0 ? featuredPosts : latestPosts

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
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-8">Latest Posts</h2>
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
