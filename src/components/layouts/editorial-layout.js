import React from "react"
import { cn } from "../../lib/utils"

export function EditorialLayout({ children, className, sidebar }) {
  return (
    <div className={cn(
      "mx-auto max-w-container-outer", // Use extended Tailwind values
      className
    )}>
      <main className="mx-auto w-full max-w-article px-5 md:px-0">
        {children}
      </main>
    </div>
  )
}

export default EditorialLayout
