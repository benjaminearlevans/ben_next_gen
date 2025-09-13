import React from "react"
import { Button } from "../ui/button"

const HeroBlock = ({ data }) => {
  const { headline, content, buttons, image } = data

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {headline}
            </h1>
            <div 
              className="text-lg text-gray-300 mb-8 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {buttons && buttons.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    variant={button.variant || "default"}
                    asChild
                  >
                    <a href={button.href}>
                      {button.label}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </div>
          {image && (
            <div className="relative">
              <img
                src={`${process.env.GATSBY_DIRECTUS_URL}/assets/${image}`}
                alt={headline}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroBlock
