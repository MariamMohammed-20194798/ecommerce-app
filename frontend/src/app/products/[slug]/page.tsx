"use client"

import { use, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Minus, Plus, ChevronRight, Truck, RotateCcw, Shield } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  addProductToCart,
  addProductToWishlist,
  getProductBySlug,
  getRelatedProducts,
  type Product,
} from "@/lib/products"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

function ProductDetails({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? { name: "Default", hex: "#888888" })
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "details" | "shipping">("description")
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20">
        {/* Breadcrumb */}
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/collections" className="hover:text-foreground transition-colors">
                Collections
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link 
                href={`/collections?category=${product.category.toLowerCase()}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category}
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        {/* Product section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Product images */}
            <div className="space-y-4">
              <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {product.isNew && (
                  <span className="absolute top-4 left-4 bg-foreground text-background text-xs uppercase tracking-wider px-3 py-1.5">
                    New
                  </span>
                )}
                {product.isSale && (
                  <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs uppercase tracking-wider px-3 py-1.5">
                    Sale
                  </span>
                )}
              </div>
              {/* Thumbnail gallery placeholder */}
              <div className="flex gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className="relative w-20 aspect-square bg-muted overflow-hidden border-2 border-foreground"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="mb-6">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  {product.category}
                </p>
                <h1 className="text-3xl lg:text-4xl font-light text-foreground tracking-tight mb-4">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                  <span className={`text-2xl ${product.isSale ? "text-accent" : "text-foreground"}`}>
                    ${product.price}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Color selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Color</span>
                  <span className="text-sm text-muted-foreground">{selectedColor.name}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor.name === color.name 
                          ? "border-foreground scale-110" 
                          : "border-transparent hover:border-muted-foreground"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-foreground">Size</span>
                  <button className="text-sm text-muted-foreground underline hover:text-foreground transition-colors">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3rem] px-4 py-2.5 text-sm border transition-colors ${
                        selectedSize === size
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and add to bag */}
              <div className="flex gap-4 mb-6">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <Button 
                  className="flex-1 rounded-none bg-foreground text-background hover:bg-foreground/90 h-auto py-4 text-sm uppercase tracking-wider"
                  disabled={!selectedSize}
                  onClick={async () => {
                    setIsAddingToCart(true)
                    try {
                      await addProductToCart(product, quantity)
                      toast.success("Added to cart")
                    } catch {
                      toast.error("Could not add this product to cart")
                    } finally {
                      setIsAddingToCart(false)
                    }
                  }}
                >
                  {selectedSize ? (isAddingToCart ? "Adding..." : "Add to Bag") : "Select a Size"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-none h-auto aspect-square border-border"
                  aria-label="Add to wishlist"
                  onClick={() => {
                    setIsAddingToWishlist(true)
                    try {
                      addProductToWishlist(product)
                      toast.success("Added to wishlist")
                    } finally {
                      setIsAddingToWishlist(false)
                    }
                  }}
                  disabled={isAddingToWishlist}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Shipping info */}
              <div className="border-t border-border pt-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="h-5 w-5" />
                  <span>Free shipping on orders over $200</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <RotateCcw className="h-5 w-5" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5" />
                  <span>Secure checkout</span>
                </div>
              </div>

              {/* Product tabs */}
              <div className="border-t border-border mt-8 pt-8">
                <div className="flex border-b border-border">
                  {(["description", "details", "shipping"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-[2px] ${
                        activeTab === tab 
                          ? "text-foreground border-foreground" 
                          : "text-muted-foreground border-transparent hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="py-6">
                  {activeTab === "description" && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  )}
                  {activeTab === "details" && (
                    <ul className="space-y-2">
                      {product.details.map((detail, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-foreground">-</span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                  {activeTab === "shipping" && (
                    <div className="text-sm text-muted-foreground space-y-4">
                      <p>Standard shipping: 5-7 business days</p>
                      <p>Express shipping: 2-3 business days</p>
                      <p>Free shipping on orders over $200</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-border py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-light text-foreground text-center mb-12">
                You May Also Like
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.slug}`}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-muted">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {relatedProduct.category}
                      </p>
                      <h3 className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="mt-1 text-sm text-foreground">${relatedProduct.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const loadedProduct = await getProductBySlug(resolvedParams.slug)
        if (!loadedProduct) {
          setError("This product could not be found.")
          setProduct(null)
          setRelatedProducts([])
          return
        }
        setProduct(loadedProduct)
        const related = await getRelatedProducts(loadedProduct, 4)
        setRelatedProducts(related)
      } catch {
        setError("We could not load this product right now. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadProduct()
  }, [resolvedParams.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">Loading product...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-light text-foreground mb-3">Product unavailable</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {error ?? "This product could not be found."}
          </p>
          <Link href="/collections" className="text-sm underline text-foreground">
            Back to Collections
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  return <ProductDetails key={product.id} product={product} relatedProducts={relatedProducts} />
}
