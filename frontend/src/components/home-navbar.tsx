"use client"

import Link from "next/link"
import { MenuIcon, SearchIcon, UserIcon, HeartIcon, ShoppingBagIcon, ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const shopCategories = [
  "all products",
  "the girls' picks",
  "accessories",
  "robes",
  "bags",
  "cards",
] as const

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
        "text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground",
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
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <Button variant="ghost" size="icon-sm" aria-label={label} title={label}>
      {children}
    </Button>
  )
}

export function HomeNavbar() {
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
                      {shopCategories.map((c) => (
                        <Link
                          key={c}
                          href={`/shop?category=${encodeURIComponent(c)}`}
                          className="text-sm text-foreground/80 hover:text-foreground"
                        >
                          {c}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link href="/size-guide" className="text-sm font-medium">
                    the size guide
                  </Link>
                  <Link
                    href="/exchanges-and-refunds"
                    className="text-sm font-medium"
                  >
                    exchanges &amp; refunds
                  </Link>
                  <Link href="/inside-self" className="text-sm font-medium">
                    inside self
                  </Link>
                  <Link href="/corporate" className="text-sm font-medium">
                    corporate
                  </Link>
                  <Link href="/careers" className="text-sm font-medium">
                    careers
                  </Link>
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

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
          <NavLink href="/home">home</NavLink>

          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-haspopup="menu"
            >
              categories <ChevronDownIcon className="size-4" />
            </button>

            <div className="pointer-events-none absolute top-full z-50 hidden w-[200px] pt-4 group-hover:block group-focus-within:block">
              <div className="pointer-events-auto border bg-background shadow-xl">
                  <div className="border-r p-4">
                    <ul className="grid gap-1">
                      {shopCategories.map((c) => (
                        <li key={c}>
                          <Link
                            href={`/shop?category=${encodeURIComponent(c)}`}
                            className="block rounded-md px-2 py-1.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground"
                          >
                            {c}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
              </div>
            </div>
          </div>

          <NavLink href="/exchanges-and-refunds">exchanges &amp; refunds</NavLink>
          <NavLink href="/inside-self">inside self</NavLink>
          <NavLink href="/corporate">corporate</NavLink>
          <NavLink href="/careers">careers</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <IconButton label="Search">
            <SearchIcon />
          </IconButton>
          <IconButton label="Account">
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

