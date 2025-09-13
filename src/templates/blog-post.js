import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import Layout from "../components/layout"
import EditorialLayout from "../components/layouts/editorial-layout"
import { Badge } from "../components/ui/badge"

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
      <EditorialLayout>
        <article>
          <header className="mb-8">
            <div className="mb-4">
              <Badge variant="outline">Article</Badge>
            </div>
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time>{formattedDate}</time>
              <span>by {authorName}</span>
            </div>
          </header>

          {featuredImage && (
            <div className="breakout-medium mb-8">
              <GatsbyImage 
                image={featuredImage} 
                alt={post.featured_image.title || post.title}
                className="rounded-lg"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {post.content && (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag.id} variant="secondary">{tag.name}</Badge>
                ))}
              </div>
            </div>
          )}
        </article>
      </EditorialLayout>
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
