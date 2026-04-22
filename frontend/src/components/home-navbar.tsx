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

          <NavLink className="text-foreground" href="/exchanges-and-refunds">Exchanges &amp; Refunds</NavLink>
          <NavLink className="text-foreground" href="/careers">Careers</NavLink>
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

