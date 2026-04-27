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
    <section className="py-24 bg-muted text-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            stay connected
          </p>
          <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Join Our World
          </h2>
          <p className="text-foreground/70 mb-8 leading-relaxed">
            Subscribe to receive exclusive access to new collections, special offers, and styling inspiration.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-4 flex-1 rounded-xl bg-transparent border-foreground/30 text-foreground placeholder:text-foreground/50 focus:border-foreground"
              required
            />
            <Button
              type="submit"
              className="p-4 rounded-xl bg-foreground text-background hover:bg-foreground/90 px-8"
            >
              Subscribe
            </Button>
          </form>
          <p className="mt-4 text-xs text-foreground/50">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  )
}
