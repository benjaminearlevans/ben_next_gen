import React from "react"
import { Link } from "gatsby"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { cn } from "../lib/utils"

const PostCard = ({ post }) => {
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

  // Determine the correct URL path based on post type
  const getPostUrl = () => {
    switch (post.type) {
      case 'speaking':
        return `/speaking/${post.slug}`
      case 'podcast':
        return `/podcast/${post.slug}`
      case 'article':
      default:
        return `/blog/${post.slug}`
    }
  }

  const getPostTypeColor = () => {
    switch (post.type) {
      case 'speaking':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
      case 'podcast':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
      case 'article':
      default:
        return 'bg-green-100 text-green-800 hover:bg-green-200'
    }
  }

  const getPostTypeLabel = () => {
    switch (post.type) {
      case 'speaking':
        return 'Speaking'
      case 'podcast':
        return 'Podcast'
      case 'article':
      default:
        return 'Article'
    }
  }

  const postUrl = getPostUrl()

  return (
    <Card className="h-full transition-all hover:shadow-lg">
      <Link to={postUrl} className="block h-full">
        {post.featured_image && (
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <img 
              src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${post.featured_image.id}`}
              alt={post.featured_image.title || post.title}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className={cn("text-xs", getPostTypeColor())}>
              {getPostTypeLabel()}
            </Badge>
            <time className="text-xs text-muted-foreground">{formattedDate}</time>
          </div>
          <CardTitle className="line-clamp-2 text-lg leading-tight">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {post.excerpt && (
            <CardDescription className="line-clamp-3 text-sm">
              {post.excerpt}
            </CardDescription>
          )}
          <div className="mt-4 flex items-center text-xs text-muted-foreground">
            <span>by {authorName}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default PostCard
