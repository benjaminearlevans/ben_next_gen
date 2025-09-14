import React from "react"
import { graphql } from 'gatsby'
import Layout from "../components/layouts/Layout"
import BlockRenderer from '../components/blocks/BlockRenderer'
import SEO from '../components/SEO'

const PageTemplate = ({ data, pageContext }) => {
  // Handle case where collections don't exist yet
  if (!data?.directus?.pages_by_id) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
              <h1 className="text-3xl font-bold text-blue-900 mb-4">
                🎉 Dynamic Pages with Reusable Blocks Ready!
              </h1>
              <p className="text-blue-700 mb-6">
                The reusable blocks system has been implemented and is ready to use.
              </p>
              <div className="text-left bg-white rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Next Steps:</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Create the collections in your Directus admin (see docs/DIRECTUS_MANUAL_SETUP.md)</li>
                  <li>Set up permissions for the new collections</li>
                  <li>Create a test page with some blocks</li>
                  <li>Rebuild your Gatsby site to see the dynamic pages</li>
                </ol>
              </div>
              <p className="text-sm text-blue-600">
                Page Context: {JSON.stringify(pageContext, null, 2)}
              </p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const page = data.directus.pages_by_id

  return (
    <Layout>
      <SEO 
        title={page.title}
        description={page.meta_description}
        pathname={`/${page.slug}`}
      />
      <div className="min-h-screen">
        {page.blocks && page.blocks.length > 0 ? (
          page.blocks.map((block, index) => (
            <BlockRenderer key={`${block.collection}-${index}`} block={block} />
          ))
        ) : (
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
              <p className="text-gray-600">No blocks have been added to this page yet.</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default PageTemplate

export const query = graphql`
  query PageQuery($id: ID!) {
    directus {
      pages_by_id(id: $id) {
        id
        title
        slug
        meta_description
      }
    }
  }
`
