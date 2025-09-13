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
        name: `Gatsby Directus Site`,
        short_name: `GatsbyDirectus`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
  ],
}
