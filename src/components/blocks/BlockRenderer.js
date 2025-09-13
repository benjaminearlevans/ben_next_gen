import React from "react"
import HeroBlock from "./HeroBlock"
import RichTextBlock from "./RichTextBlock"
import CardGroupBlock from "./CardGroupBlock"

// Map block collection names to their corresponding components
const blockComponents = {
  block_hero: HeroBlock,
  block_richtext: RichTextBlock,
  block_cardgroup: CardGroupBlock,
}

const BlockRenderer = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks)) {
    return null
  }

  return (
    <div>
      {blocks.map((block, index) => {
        const { collection, item } = block
        const BlockComponent = blockComponents[collection]

        if (!BlockComponent) {
          console.warn(`No component found for block type: ${collection}`)
          return null
        }

        return (
          <BlockComponent
            key={block.id || index}
            data={item}
          />
        )
      })}
    </div>
  )
}

export default BlockRenderer
