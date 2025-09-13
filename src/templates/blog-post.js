import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"

const BlogPostTemplate = ({ data }) => {
  const post = data.directus.post_by_id
  const featuredImage = post.featured_image ? getImage(post.featured_image) : null
  const authorName = post.author 
    ? `${post.author.first_name} ${post.author.last_name}`.trim()
    : "Anonymous"
  const formattedDate = post.date_created 
    ? new Date(post.date_created).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : ""

  return (
    <Layout>
      <article className="blog-post">
        <div className="container">
          <header className="blog-post-header">
            <h1 className="blog-post-title">{post.title}</h1>
            <div className="blog-post-meta">
              <span className="post-date">{formattedDate}</span>
              <span className="post-author">by {authorName}</span>
            </div>
          </header>

          {featuredImage && (
            <div className="blog-post-image">
              <GatsbyImage 
                image={featuredImage} 
                alt={post.featured_image.title || post.title}
              />
            </div>
          )}

          <div className="blog-post-content">
            {post.content && (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="blog-post-tags">
              <h4>Tags:</h4>
              <ul>
                {post.tags.map((tag) => (
                  <li key={tag.id}>{tag.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query($id: ID!) {
    directus {
      post_by_id(id: $id) {
        id
        title
        slug
        content
        excerpt
        date_created
        featured_image {
          id
          title
          filename_disk
        }
        author {
          id
          first_name
          last_name
          email
        }
      }
    }
  }
`

export default BlogPostTemplate
