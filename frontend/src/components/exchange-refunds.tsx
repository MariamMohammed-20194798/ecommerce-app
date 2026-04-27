"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

const policyItems = [
  "requests are accepted within 14 days of receiving the order",
  "the process takes up to 14 days",
  "exchange/refunds come with a 250 egp fee",
]

export function ExchangeRefunds() {
  return (
    <section className="bg-[#f5eff3] py-24">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-4xl font-semibold tracking-wide text-[#16335a] sm:text-5xl">exchange & refunds</h2>
        <p className="mx-auto mt-7 max-w-3xl text-xl leading-relaxed text-foreground/90">
          our aim is to provide you with a seamless experience from our website to your door. if you
          encounter any issue, feel free to reach out; your feedback helps us grow!
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {policyItems.slice(0, 2).map((item) => (
            <div key={item} className="rounded-xl bg-[#e8c9d2] px-8 py-6 text-2xl text-foreground/90">
              {item}
            </div>
          ))}
          <div className="sm:col-span-2 sm:flex sm:justify-start">
            <div className="rounded-xl bg-[#e8c9d2] px-8 py-6 text-2xl text-foreground/90 sm:w-[calc(50%-0.625rem)]">
              {policyItems[2]}
            </div>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="mt-14 rounded-full border-foreground/70 px-14 text-2xl font-normal hover:bg-foreground hover:text-background"
        >
          <Link href="/account">request an exchange/refund</Link>
        </Button>
      </div>
    </section>
  )
}
