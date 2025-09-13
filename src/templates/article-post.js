import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import EditorialLayout from "../components/layouts/editorial-layout"
import { Badge } from "../components/ui/badge"

const ArticlePost = ({ data }) => {
  const post = data.directus.post[0]

  if (!post) {
    return (
      <Layout>
        <EditorialLayout>
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">Post not found</h1>
        </EditorialLayout>
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
      <EditorialLayout>
        <article className="py-8">
          <header className="mb-8">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
              <time dateTime={post.date_created}>
                {formatDate(post.date_created)}
              </time>
              {post.author && (
                <span>
                  by {post.author.first_name} {post.author.last_name}
                </span>
              )}
              <Badge variant="secondary">Article</Badge>
            </div>
            {post.excerpt && (
              <p className="text-xl text-muted-foreground leading-7 [&:not(:first-child)]:mt-6">
                {post.excerpt}
              </p>
            )}
          </header>

          {post.featured_image && (
            <figure className="breakout-medium my-8">
              <img 
                src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${post.featured_image.id}`}
                alt={post.featured_image.title || post.title}
                className="w-full rounded-lg"
              />
            </figure>
          )}

          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

        </article>
      </EditorialLayout>
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
