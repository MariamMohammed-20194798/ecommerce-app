"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Heart, SlidersHorizontal, ChevronDown, X, Grid3X3, LayoutGrid } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { addProductToCart, formatPriceEgp, addProductToWishlist, getCategories, getProducts, type Product } from "@/lib/products"

const sortOptions = [
  { name: "Newest", value: "newest" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
  { name: "Best Selling", value: "best-selling" },
]

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [gridCols, setGridCols] = useState<3 | 4>(4)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeProductAction, setActiveProductAction] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await getProducts()
        setProducts(data)
      } catch {
        setError("We could not load products right now. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadProducts()
  }, [])

  const categories = useMemo(() => getCategories(products), [products])

  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(p => p.category.toLowerCase() === selectedCategory)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero section */}
      <section className="relative h-[40vh] min-h-[320px] mt-16">
        <Image
          src="/images/collection-hero.jpg"
          alt="Spring Summer Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-balance">
              The Collection
            </h1>
          </div>
        </div>
      </section>

      {/* Filters and sort bar */}
      <div className="sticky top-16 z-40 bg-background border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left side: Filter button and category pills */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              
              {/* Category pills - desktop */}
              <div className="hidden md:flex items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      selectedCategory === cat.slug
                        ? "bg-muted text-foreground rounded-full"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side: Sort and grid options */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {isLoading ? "Loading..." : `${sortedProducts.length} ${sortedProducts.length === 1 ? "item" : "items"}`}
                </span>
              </div>
              
              {/* Sort dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sort by
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                        sortBy === option.value ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {option.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid toggle - desktop */}
              <div className="hidden lg:flex items-center gap-1 border-l border-border pl-4">
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 transition-colors ${gridCols === 3 ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label="3 column grid"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setGridCols(4)}
                  className={`p-1.5 transition-colors ${gridCols === 4 ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  aria-label="4 column grid"
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setShowFilters(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-background p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-medium">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider mb-4">Category</h3>
              <div className="flex flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setSelectedCategory(cat.slug)
                      setShowFilters(false)
                    }}
                    className={`text-left py-2 text-sm transition-colors ${
                      selectedCategory === cat.slug
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-8 border border-border p-4 text-sm text-muted-foreground">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="py-20 text-center text-sm text-muted-foreground">Loading products...</div>
        )}
        <div className={`grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8 lg:gap-y-12  ${
          gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
        }`}>
          {sortedProducts.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="group cursor-pointer"
            >
              {/* Product image */}
              <div className="relative aspect-[3/4] mb-4 rounded-xl overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {/* {product.isNew && (
                    <span className="bg-foreground text-background text-[10px] uppercase tracking-wider px-2 py-1">
                      New
                    </span>
                  )} */}
                  {product.isSale && (
                    <span className="bg-accent text-accent-foreground text-[10px] uppercase tracking-wider px-2 py-1">
                      Sale
                    </span>
                  )}
                </div>
                {/* Quick wishlist */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full h-9 w-9 bg-white/90 hover:bg-white"
                    aria-label="Add to wishlist"
                    onClick={async (e) => {
                      e.preventDefault()
                      setActiveProductAction(`${product.id}:wishlist`)
                      try {
                        addProductToWishlist(product)
                        toast.success("Added to wishlist")
                      } finally {
                        setActiveProductAction(null)
                      }
                    }}
                    disabled={activeProductAction === `${product.id}:wishlist`}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                {/* Quick add button */}
                <div className="absolute bottom-4 left-4 right-4 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button 
                    className="w-full h-12 rounded-full bg-white text-foreground hover:bg-foreground hover:text-white"
                    onClick={async (e) => {
                      e.preventDefault()
                      setActiveProductAction(`${product.id}:cart`)
                      try {
                        await addProductToCart(product, 1)
                        toast.success("Added to cart")
                      } catch {
                        toast.error("Could not add this product to cart")
                      } finally {
                        setActiveProductAction(null)
                      }
                    }}
                    disabled={activeProductAction === `${product.id}:cart` || !product.inStock}
                  >
                    Quick Add
                  </Button>
                </div>
              </div>
              {/* Product info */}
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  {product.category}
                </p>
                <h3 className="text-sm font-medium text-foreground">
                  {product.name}
                </h3>
                <div className="mt-1 flex items-center justify-center gap-2">
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className={`text-sm ${product.isSale ? "text-accent" : "text-foreground/60"}`}>
                    {formatPriceEgp(product.price)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
