"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import api from "@/lib/api"

type CategoryNode = {
  id?: string
  name: string
  description: string
  images: string[]
  slug?: string
  children?: CategoryNode[]
}

type CategoryCard = {
  key: string
  name: string
  description: string
  image: string
  href: string
}

function normalizeKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-")
}

function flattenSubcategories(nodes: CategoryNode[]): CategoryNode[] {
  return nodes.flatMap((node) => {
    if (node.children?.length) {
      return node.children
    }
    return []
  })
}

export function Categories() {
  const [categoriesTree, setCategoriesTree] = useState<CategoryNode[]>([])

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const response = await api.get<CategoryNode[]>("/categories/tree")
        if (!isMounted) return
        setCategoriesTree(response.data)
      } catch (error) {
        console.error("Failed to load categories section:", error)
      }
    }

    void loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  const categoryCards = useMemo<CategoryCard[]>(() => {
    const subcategories = flattenSubcategories(categoriesTree)
    const sourceCategories = subcategories.length ? subcategories : categoriesTree

    return sourceCategories.slice(0, 3).map((category, index) => {
      const key = normalizeKey(category.slug ?? category.name)
      return {
        key: category.id ?? `${key}-${index}`,
        name: category.name,
        description: category.description,
        image: category.images[0],
        href: `/shop?category=${encodeURIComponent(category.name)}`,
      }
    })
  }, [categoriesTree])

  return (
    <section className="bg-muted py-24" id="collections">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Explore
          </p>
          <h2 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categoryCards.map((category) => (
            <Link
              key={category.key}
              href={category.href}
              className="group relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/30 transition-colors duration-300 group-hover:bg-foreground/40" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
                <h3 className="mb-2 text-2xl font-light tracking-wider">{category.name}</h3>
                <p className="mb-4 text-center text-sm text-white/80">{category.description}</p>
                <span className="inline-flex items-center text-sm uppercase tracking-wider opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
