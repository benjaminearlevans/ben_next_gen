import React from "react"
import Header from "./header"
import Footer from "./footer"
import "../styles/global.css"
import { cn } from "../lib/utils"
import { Analytics } from "@vercel/analytics/react"

const Layout = ({ children, className }) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Analytics />
    </div>
  )
}

export default Layout
