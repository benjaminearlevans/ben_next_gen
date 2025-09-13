"use client"

import type React from "react"

import { useState } from "react"

export default function PortfolioPage() {
  const [password, setPassword] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple password check - in a real app, this would be more secure
    if (password === "portfolio123") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Incorrect password")
    }
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#ffffff]">
        {/* Navigation */}
        <nav className="flex justify-between items-center px-8 py-6">
          <div className="flex space-x-8">
            <a href="/" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
              Home
            </a>
            <a href="#" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
              Pricing
            </a>
            <a href="#" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
              Speaking
            </a>
            <a href="#" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
              Pricing
            </a>
            <a href="#" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
              More
            </a>
          </div>
          <div className="flex space-x-8">
            <a href="/portfolio" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
              Portfolio
            </a>
            <a href="/contact" className="text-[#ffffff] hover:text-[#c4c4c4] transition-colors">
              Contact
            </a>
          </div>
        </nav>

        <div className="max-w-[960px] mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold text-[#ffffff] mb-8">Portfolio</h1>
          <p className="text-[#c4c4c4] mb-12 max-w-2xl">
            Welcome to my portfolio. Here you can view my selected works and projects.
          </p>

          <div className="grid grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="space-y-3">
                <div className="aspect-video bg-[#c4c4c4] rounded"></div>
                <h3 className="text-[#ffffff] font-medium">Project {item}</h3>
                <p className="text-[#c4c4c4] text-sm">Description of project {item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#ffffff] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#ffffff] mb-4">Portfolio Access</h1>
          <p className="text-[#c4c4c4]">Please enter the password to view the portfolio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-[#ffffff] mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#000000] border border-[#c4c4c4] rounded text-[#ffffff] focus:outline-none focus:border-[#ffffff] transition-colors"
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#ffffff] text-[#000000] py-3 rounded font-medium hover:bg-[#c4c4c4] transition-colors"
          >
            Access Portfolio
          </button>
        </form>

        <div className="text-center mt-8">
          <a href="/" className="text-[#c4c4c4] hover:text-[#ffffff] transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
