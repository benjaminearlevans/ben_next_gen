import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const ArticlePost = ({ data }) => {
  const post = data.directus.post[0]

  if (!post) {
    return (
      <Layout>
        <div className="container">
          <h1>Post not found</h1>
        </div>
      </Layout>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Layout>
      <article className="blog-post">
        <div className="container">
          <header className="blog-post-header">
            <h1 className="blog-post-title">{post.title}</h1>
            <div className="blog-post-meta">
              <time className="blog-post-date">
                {formatDate(post.date_created)}
              </time>
              {post.author && (
                <span className="blog-post-author">
                  by {post.author.first_name} {post.author.last_name}
                </span>
              )}
              <span className="post-type-badge article">Article</span>
            </div>
            {post.excerpt && (
              <p className="blog-post-excerpt">{post.excerpt}</p>
            )}
          </header>

          {post.featured_image && (
            <div className="blog-post-image">
              <img 
                src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${post.featured_image.id}`}
                alt={post.featured_image.title || post.title}
              />
            </div>
          )}

          <div className="blog-post-content">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

        </div>
      </article>
    </Layout>
  )
}

export const query = graphql`
  query ArticlePostQuery($id: String!) {
    directus {
      post(filter: { id: { _eq: $id }, type: { _eq: "article" } }) {
        id
        title
        slug
        content
        excerpt
        status
        date_created
        type
        author {
          id
          first_name
          last_name
        }
        featured_image {
          id
          title
        }
      }
    }
  }
`

export default ArticlePost
