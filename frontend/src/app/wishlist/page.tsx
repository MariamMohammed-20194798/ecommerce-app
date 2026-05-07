"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { HeartOff, ShoppingBag, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  fetchWishlist,
  removeFromWishlist,
} from "@/lib/wishlist"
import {
  addProductToCart,
  formatPriceEgp,
  type Product,
} from "@/lib/products"

export default function WishlistPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeActionId, setActiveActionId] = useState<string | null>(null)

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const items = await fetchWishlist()
        
        // Map WishlistItem to Product shape for the UI
        const mappedProducts: Product[] = items.map(item => {
          const p = item.variant.product;
          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.basePrice),
            image: item.image || p.images[0] || "/images/placeholder-product.jpg",
            images: p.images,
            category: "Uncategorized", // Backend doesn't return category in wishlist include currently
            subcategory: "",
            description: "",
            details: [],
            sizes: [],
            colors: [],
            variants: [],
            inStock: true, // Simplified
            variantIds: [item.variantId]
          } as Product
        })

        setProducts(mappedProducts)
      } catch {
        setError("Please login to see your wishlist.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadWishlist()
  }, [])

  const hasItems = useMemo(() => products.length > 0, [products.length])

  const handleRemove = async (productId: string) => {
    try {
      // Find the variantId for this product in the current list
      const product = products.find(p => p.id === productId)
      if (product && product.variantIds[0]) {
        await removeFromWishlist(product.variantIds[0])
        setProducts((current) => current.filter((p) => p.id !== productId))
        toast.success("Removed from wishlist")
      }
    } catch {
      toast.error("Failed to remove item")
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
      <div className="mb-12 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Your saved picks</p>
          <h1 className="mt-2 text-4xl font-light tracking-tight text-foreground sm:text-5xl">Wishlist</h1>
        </div>
        <p className="text-sm text-muted-foreground">{products.length} items</p>
      </div>

      {error && <div className="mb-8 border border-border px-4 py-3 text-sm text-muted-foreground">{error}</div>}

      {isLoading && <div className="py-20 text-center text-sm text-muted-foreground">Loading wishlist...</div>}

      {!isLoading && !hasItems && (
        <div className="rounded-2xl border border-border bg-background px-6 py-16 text-center">
          <HeartOff className="mx-auto h-10 w-10 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-light text-foreground">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">Save your favorites and they will appear here.</p>
          <Button asChild className="mt-7 rounded-full px-8">
            <Link href="/collections">Browse collection</Link>
          </Button>
        </div>
      )}

      {hasItems && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-border bg-background">
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <Image src={product.image} alt={product.name} fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" />
                </div>
              </Link>
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.category}</p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-1 text-xl font-light text-foreground">{product.name}</h3>
                  </Link>
                  <p className="mt-2 text-base text-foreground">{formatPriceEgp(product.price)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    className="flex-1 rounded-full"
                    disabled={activeActionId === `${product.id}:cart` || !product.inStock}
                    onClick={async () => {
                      setActiveActionId(`${product.id}:cart`)
                      try {
                        await addProductToCart(product, 1)
                        toast.success("Added to cart")
                      } catch {
                        toast.error("Could not add this product to cart")
                      } finally {
                        setActiveActionId(null)
                      }
                    }}
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Quick Add
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleRemove(product.id)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
