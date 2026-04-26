"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setEmail("")
  }

  return (
    <section className="py-24 bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-background/60 mb-3">
            Stay Connected
          </p>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight mb-4">
            Join Our World
          </h2>
          <p className="text-background/70 mb-8 leading-relaxed">
            Subscribe to receive exclusive access to new collections, special offers, and styling inspiration.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 flex-1 rounded-xl bg-transparent border-background/30 text-background placeholder:text-background/50 focus:border-background"
              required
            />
            <Button
              type="submit"
              className="p-4 rounded-xl bg-background text-foreground hover:bg-background/90 px-8"
            >
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-background/50">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  )
}
