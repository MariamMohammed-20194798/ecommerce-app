"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWishlistProductIds, subscribeToWishlistUpdates } from "@/lib/products"

const navigation = [
  { name: "Home", href: "/home" },
  { name: "New Arrivals", href: "#new" },
  { name: "Collections", href: "/collections" },
  { name: "Size Guide", href: "/size-guide" },
  { name: "Wishlist", href: "/wishlist" },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [wishlistedProductIds, setWishlistedProductIds] = useState<string[]>([])

  useEffect(() => {
    const syncWishlist = () => {
      setWishlistedProductIds(getWishlistProductIds())
    }

    syncWishlist()
    window.addEventListener("storage", syncWishlist)
    window.addEventListener("focus", syncWishlist)
    const unsubscribe = subscribeToWishlistUpdates(syncWishlist)

    return () => {
      window.removeEventListener("storage", syncWishlist)
      window.removeEventListener("focus", syncWishlist)
      unsubscribe()
    }
  }, [])

  if (pathname === "/auth" || pathname === "/verify-email" || pathname === "/account") {
    return null
  }


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="/" className="text-2xl font-light tracking-[0.3em] text-foreground">
              Women&apos;s
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/wishlist" className="hidden sm:block">
              <Button variant="ghost" size="icon" aria-label="Wishlist" className="relative">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                {wishlistedProductIds.length}
              </span>
              </Button>
            </Link>
            <Link href='/account'>
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
            </Button></Link>
            
            <Button variant="ghost" size="icon" className="relative" aria-label="Shopping bag">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                2
              </span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>  )
}

