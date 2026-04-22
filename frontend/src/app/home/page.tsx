import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function HomeLandingPage() {
  return (
    <main className="w-full">
      <section className="relative w-full overflow-hidden">
        <Image
          src="/imageSection.jpg"
          alt="Hero section"
          priority
          width={2400}
          height={1350}
          className="h-[60vh] w-full object-cover sm:h-[68vh] md:h-[82vh]"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-background/05 to-transparent" />

        <div className="absolute inset-0">
          <div className="mx-auto flex h-full w-full max-w-6xl items-center px-4 sm:px-6">
            <div className="max-w-xl">
              <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-5xl">
                Elevate Your
                <br />
                <span className="font-bold">Style!</span>
              </h1>

              <p className="mt-4 max-w-md text-sm text-foreground/70 sm:text-base">
                Feel the Fashion
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="bg-[#D2A295]"
                >
                  <Link href="/shop">Shop Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#D2A295] bg-background/60"
                >
                  <Link href="/home#new">New Arrivels</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

