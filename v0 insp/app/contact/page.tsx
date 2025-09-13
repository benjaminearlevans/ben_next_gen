"use client"

import type React from "react"

import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to a server
    console.log("Form submitted:", formData)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#ffffff] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-8 text-center">
          <h1 className="text-4xl font-bold text-[#ffffff] mb-4">Thank You!</h1>
          <p className="text-[#c4c4c4] mb-8">Your message has been sent successfully. I'll get back to you soon.</p>
          <a
            href="/"
            className="inline-block bg-[#ffffff] text-[#000000] px-6 py-3 rounded font-medium hover:bg-[#c4c4c4] transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    )
  }

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
        <h1 className="text-4xl font-bold text-[#ffffff] mb-4">Contact</h1>
        <p className="text-[#c4c4c4] mb-12 max-w-2xl">
          Get in touch to discuss speaking opportunities, collaborations, or any questions you might have.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-[#ffffff] mb-2">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#000000] border border-[#c4c4c4] rounded text-[#ffffff] focus:outline-none focus:border-[#ffffff] transition-colors"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[#ffffff] mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#000000] border border-[#c4c4c4] rounded text-[#ffffff] focus:outline-none focus:border-[#ffffff] transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="subject" className="block text-[#ffffff] mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#000000] border border-[#c4c4c4] rounded text-[#ffffff] focus:outline-none focus:border-[#ffffff] transition-colors"
              placeholder="What's this about?"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-[#ffffff] mb-2">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 bg-[#000000] border border-[#c4c4c4] rounded text-[#ffffff] focus:outline-none focus:border-[#ffffff] transition-colors resize-vertical"
              placeholder="Tell me more about your project or inquiry..."
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#ffffff] text-[#000000] py-3 rounded font-medium hover:bg-[#c4c4c4] transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}
