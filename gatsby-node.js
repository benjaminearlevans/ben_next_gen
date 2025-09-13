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

  // Create dynamic pages from Directus pages collection with blocks
  try {
    const pagesResult = await graphql(`
      query {
        directus {
          pages(filter: { status: { _eq: "published" } }) {
            id
            title
            slug
          }
        }
      }
    `)

    if (pagesResult.errors) {
      throw pagesResult.errors
    }

    const pages = pagesResult.data.directus.pages || []

    pages.forEach(page => {
      createPage({
        path: `/${page.slug}`,
        component: path.resolve(`./src/templates/page.js`),
        context: {
          id: page.id,
          slug: page.slug,
        },
      })
    })

    console.log(`Created ${pages.length} dynamic pages with reusable blocks`)
  } catch (error) {
    console.log('Pages collection not yet available:', error.message)
    console.log('Create the pages collection in Directus as described in docs/DIRECTUS_MANUAL_SETUP.md')
  }

  // Note: Dynamic pages created:
  // - Posts: /{type}/{slug} using type-specific templates
  // - Pages: /{slug} using page.js template with reusable blocks
}
