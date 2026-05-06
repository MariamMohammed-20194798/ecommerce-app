"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-fashion.jpg"
          alt="Fashion model in elegant attire"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
              Spring/Summer 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-[0.95] mt-6 text-balance"
          >
            Timeless elegance
            <br />
            <span className="italic font-normal">redefined</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-md md:text-lg text-muted-foreground mt-8 max-w-md leading-relaxed"
          >
            Discover our curated collection of contemporary silhouettes crafted
            for the modern woman.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mt-10"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group rounded-md flex items-center justify-center gap-3 bg-primary text-primary-foreground px-4 py-3 text-sm tracking-widest uppercase transition-all duration-300"
              onClick={() => router.push("/collections")}
              suppressHydrationWarning
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-3 border border-foreground/20 px-4 py-4 rounded-md text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300"
              onClick={() => router.push("/lookbook")}
              suppressHydrationWarning
            >
              View Lookbook
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            Scroll
          </span>
          <div className="w-px h-12 bg-foreground/30 relative overflow-hidden">
            <motion.div
              animate={{ y: [-48, 48] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-full h-1/2 bg-foreground"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
