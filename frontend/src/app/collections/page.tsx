"use-client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"


export default function Collections(){
  return (
    <section className="relative min-h-screen flex items-center pt-16">
    {/* Background image */}
    <div className="absolute inset-0 z-0">
      <Image
        src="/images/hero-fashion.jpg"
        alt="Woman in elegant fashion"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-foreground/20" />
    </div>

    {/* Content */}
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="max-w-xl">
        <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-md">
          All Products
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="bg-white text-foreground hover:bg-white/90 rounded-none px-8">
            Shop All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>

    {/* Scroll indicator */}
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
      <div className="w-[1px] h-16 bg-white/40 relative overflow-hidden">
        <div className="w-full h-1/2 bg-white animate-pulse" />
      </div>
    </div>
  </section>
  )
}