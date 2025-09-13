require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Benjamin Carlson`,
    description: `Personal website and blog of Benjamin Carlson - developer, speaker, and content creator.`,
    author: `@benjamincarlson`,
    siteUrl: `https://benjamincarlson.io`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: `Directus`,
        fieldName: `directus`,
        url: `${process.env.DIRECTUS_URL || 'http://localhost:8055'}/graphql`,
        headers: {
          Authorization: `Bearer ${process.env.DIRECTUS_TOKEN}`,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Benjamin Carlson`,
        short_name: `BenCarlson`,
        start_url: `/`,
        background_color: `#1f2937`,
        theme_color: `#3b82f6`,
        display: `minimal-ui`,
        icons: [
          {
            src: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🚀</text></svg>`,
            sizes: `192x192`,
            type: `image/svg+xml`,
          },
          {
            src: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🚀</text></svg>`,
            sizes: `512x512`,
            type: `image/svg+xml`,
          },
        ],
      },
    },
  ],
}
