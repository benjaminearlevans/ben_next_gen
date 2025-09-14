import React, { useState } from "react"
import Layout from "../components/layout"
import EditorialLayout from "../components/layouts/editorial-layout"
import { Input } from "../components/ui/input"
import { Link, useStaticQuery, graphql } from "gatsby"

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch posts from Directus
  const data = useStaticQuery(graphql`
    query BlogPostsQuery {
      directus {
        post(filter: { status: { _eq: "published" } }, sort: ["-date_created"]) {
          id
          title
          slug
          excerpt
          content
          type
          date_created
          date_updated
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

  const posts = data?.directus?.post || []

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Filter posts based on search term
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <EditorialLayout>
        <div className="py-16">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">Writing</h1>
            <p className="text-xl text-muted-foreground leading-7">
              Brain dumps, explorations, and how-to guides. I write about different topics, such as web development, 
              JavaScript, React, and developer experience.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? 'No posts found matching your search.' : 'No posts yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <article key={post.id} className="group">
                  <Link 
                    to={`/blog/${post.slug}/`}
                    className="block hover:bg-muted/50 -mx-4 px-4 py-3 rounded-lg transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1">
                        <h2 className="text-lg font-medium group-hover:text-primary transition-colors mb-1">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>
                      <time 
                        dateTime={post.date_created}
                        className="text-sm text-muted-foreground whitespace-nowrap sm:ml-4 mt-1 sm:mt-0"
                      >
                        {formatDate(post.date_created)}
                      </time>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </EditorialLayout>
    </Layout>
  )
}

export default BlogPage
