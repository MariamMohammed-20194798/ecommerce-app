"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, SearchIcon, UserIcon, HeartIcon, ShoppingBagIcon, ChevronDownIcon } from "lucide-react"

import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type CategoryNode = {
  id?: string
  name: string
  slug?: string
  children?: CategoryNode[]
}

function CategoryTree({
  categories,
  level = 0,
}: {
  categories: CategoryNode[]
  level?: number
}) {
  return (
    <ul className="grid gap-1">
      {categories.map((category, index) => {
        const key = category.id ?? `${category.name}-${level}-${index}`
        return (
          <li key={key}>
            <Link
              href={`/shop?category=${encodeURIComponent(category.name)}`}
              className={cn(
                "block rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground",
                level === 0 ? "font-medium" : "font-normal",
                level > 0 && "ml-3 border-l border-border/70 pl-3"
              )}
            >
              {category.name}
            </Link>

            {category.children?.length ? (
              <div className="mt-1">
                <CategoryTree categories={category.children} level={level + 1} />
              </div>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}

function NavLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-block text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground",
        "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200",
        "hover:after:scale-x-100 focus-visible:after:scale-x-100",
        className
      )}
    >
      {children}
    </Link>
  )
}

function IconButton({
  label,
  children,
  href,
}: {
  label: string
  children: React.ReactNode
  href?: string
}) {
  if (href) {
    return (
      <Button asChild variant="ghost" size="icon-sm" aria-label={label} title={label}>
        <Link href={href}>{children}</Link>
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="icon-sm" aria-label={label} title={label}>
      {children}
    </Button>
  )
}

export function HomeNavbar() {
  const [shopCategories, setShopCategories] = useState<CategoryNode[]>([])
  const pathname = usePathname()

  useEffect(() => {
    let isMounted = true

    const loadCategories = async () => {
      try {
        const response = await api.get<CategoryNode[]>("/categories/tree")
        if (!isMounted) return
        setShopCategories(response.data)
      } catch (error) {
        console.error("Failed to load categories:", error)
      }
    }

    void loadCategories()

    return () => {
      isMounted = false
    }
  }, [])

  if (pathname === "/auth" || pathname === "/verify-email" || pathname === "/account") {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-primary supports-backdrop-filter:backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Open menu"
                title="Open menu"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SheetHeader className="border-b">
                <SheetTitle className="font-semibold tracking-wide">
                  Women&apos;s
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-3">
                  <Link href="/home" className="text-sm font-medium">
                    home
                  </Link>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">shop</span>
                    <div className="grid gap-1 pl-3">
                      <CategoryTree categories={shopCategories} />
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/home"
            className="text-xl font-bold tracking-wide"
            aria-label="Go to home"
          >
            Women&apos;s
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex ">
          <NavLink className="text-foreground" href="/home">Home</NavLink>

          <div className="relative group">
            <button
              type="button"
              className={cn(
                "relative inline-flex items-center gap-1 text-sm font-medium tracking-wide text-foreground",
                "after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200",
                "hover:after:scale-x-100 focus-visible:after:scale-x-100",
                "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              )}
              aria-haspopup="menu"
            >
              Shop <ChevronDownIcon className="size-4" />
            </button>

            <div className="pointer-events-none absolute top-full z-50 hidden w-[200px] pt-4 group-hover:block group-focus-within:block">
              <div className="pointer-events-auto border bg-background shadow-xl">
                  <div className="border-r p-4">
                    <CategoryTree categories={shopCategories} />
                  </div>
              </div>
            </div>
          </div>

        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <IconButton label="Search">
            <SearchIcon />
          </IconButton>
          <IconButton label="Account" href="/account">
            <UserIcon />
          </IconButton>
          <IconButton label="Wishlist">
            <HeartIcon />
          </IconButton>
          <IconButton label="Cart">
            <ShoppingBagIcon />
          </IconButton>
        </div>
      </div>
    </header>
  )
}

