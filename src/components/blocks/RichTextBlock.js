import React from "react"

const RichTextBlock = ({ data }) => {
  const { headline, content } = data

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {headline && (
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8 text-center">
            {headline}
          </h2>
        )}
        <div 
          className="prose prose-lg prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  )
}

export default RichTextBlock
