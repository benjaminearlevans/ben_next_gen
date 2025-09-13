import React from "react"
import { Link } from "gatsby"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const CardGroupBlock = ({ data }) => {
  const { headline, content, group_type, posts, cards } = data

  // Use posts if group_type is 'posts', otherwise use custom cards
  const cardItems = group_type === 'posts' ? posts : cards

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {headline && (
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 text-center">
            {headline}
          </h2>
        )}
        {content && (
          <div 
            className="text-lg text-gray-300 mb-12 text-center max-w-3xl mx-auto prose prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cardItems && cardItems.map((item, index) => (
            <Card key={item.id || index} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              {item.featured_image && (
                <div className="aspect-video bg-gray-800 relative overflow-hidden rounded-t-lg">
                  <img 
                    src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${item.featured_image.id || item.featured_image}`}
                    alt={item.title || item.headline}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-white">
                  {group_type === 'posts' && item.slug ? (
                    <Link to={`/blog/${item.slug}`} className="hover:text-primary transition-colors">
                      {item.title}
                    </Link>
                  ) : (
                    item.title || item.headline
                  )}
                </CardTitle>
                
                {item.date_created && (
                  <time className="text-sm text-gray-400">
                    {new Date(item.date_created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </CardHeader>
              
              <CardContent>
                {(item.excerpt || item.content) && (
                  <CardDescription className="text-gray-300">
                    {item.excerpt || item.content}
                  </CardDescription>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CardGroupBlock
