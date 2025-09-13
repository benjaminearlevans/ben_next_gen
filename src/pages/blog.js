import React, { useState } from "react"
import Layout from "../components/layout"
import { Link, useStaticQuery, graphql } from "gatsby"

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch posts from Directus
  const data = useStaticQuery(graphql`
    query BlogPostsQuery {
      directus {
        post(
          filter: { 
            status: { _eq: "published" }
            type: { _eq: "article" }
          }
          sort: ["-date_created"]
        ) {
          id
          title
          slug
          excerpt
          date_created
          type
          status
        }
      }
    }
  `)

  // Use dynamic posts from Directus, fallback to empty array if none found
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
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Writing</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Brain dumps, explorations, and how-to guides. I write about different topics, such as web development, 
            JavaScript, React, and developer experience.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Posts List */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No posts found matching your search.' : 'No posts yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <article key={post.id} className="group">
                <Link 
                  to={`/blog/${post.slug}/`}
                  className="block hover:bg-gray-50 -mx-4 px-4 py-3 rounded-lg transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1">
                      <h2 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                    <time 
                      dateTime={post.date_created}
                      className="text-sm text-gray-500 whitespace-nowrap sm:ml-4 mt-1 sm:mt-0"
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
    </Layout>
  )
}

export default BlogPage
