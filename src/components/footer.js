import React from "react"
import { Button } from "./ui/button"

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Benjamin. Built with ❤️
          </p>
          <div className="flex space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="https://www.gatsbyjs.com/" target="_blank" rel="noopener noreferrer">
                Gatsby
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://directus.io/" target="_blank" rel="noopener noreferrer">
                Directus
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
