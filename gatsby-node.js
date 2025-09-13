const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  // Create dynamic post pages based on type
  const postResult = await graphql(`
    query {
      directus {
        post(filter: { status: { _eq: "published" } }) {
          id
          slug
          type
        }
      }
    }
  `)

  if (postResult.errors) {
    console.error(postResult.errors)
    return
  }

  // Template mapping based on post type
  const templateMap = {
    article: path.resolve(`src/templates/article-post.js`),
    speaking: path.resolve(`src/templates/speaking-post.js`),
    podcast: path.resolve(`src/templates/podcast-post.js`)
  }

  // Path mapping based on post type
  const pathMap = {
    article: (slug) => `/blog/${slug}`,
    speaking: (slug) => `/speaking/${slug}`,
    podcast: (slug) => `/podcast/${slug}`
  }
  
  postResult.data.directus.post.forEach((post) => {
    const template = templateMap[post.type] || templateMap.article
    const pathGenerator = pathMap[post.type] || pathMap.article
    
    createPage({
      path: pathGenerator(post.slug),
      component: template,
      context: {
        id: post.id,
        slug: post.slug,
        type: post.type,
      },
    })
  })

  // Note: Dynamic post pages created based on type:
  // - Articles: /blog/{slug} using article-post.js
  // - Speaking: /speaking/{slug} using speaking-post.js  
  // - Podcasts: /podcast/{slug} using podcast-post.js
}
