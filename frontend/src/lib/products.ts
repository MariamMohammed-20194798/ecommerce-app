import api from "@/lib/api"

export interface Product {
  id: string
  slug: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images: string[]
  category: string
  subcategory: string
  description: string
  details: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  inStock: boolean
  isNew?: boolean
  isSale?: boolean
  variantIds: string[]
}

type ApiProductVariant = {
  id: string
  size: string | null
  color: string | null
  stockQuantity: number
  images: string[] | null
}

type ApiProduct = {
  id: string
  slug: string
  name: string
  description: string | null
  basePrice: number
  images: string[] | null
  createdAt?: string
  category?: {
    name?: string
  }
  variants?: ApiProductVariant[]
  metadata?: {
    details?: string[]
    subcategory?: string
    originalPriceCents?: number
  } | null
}

type ProductsResponse = {
  data?: ApiProduct[]
}

type SortOption = "newest" | "price-asc" | "price-desc" | "best-selling"

const FALLBACK_IMAGE = "/images/placeholder-product.jpg"
const WISHLIST_STORAGE_KEY = "wishlistProductIds"

const formatPriceFromCents = (priceInCents: number) =>
  Math.round((priceInCents / 100) * 100) / 100

const toColorHex = (colorName: string) => {
  const normalized = colorName.trim().toLowerCase()
  const map: Record<string, string> = {
    black: "#1a1a1a",
    white: "#ffffff",
    navy: "#1e3a5f",
    blue: "#2563eb",
    brown: "#8b5e3c",
    camel: "#c4a77d",
    grey: "#9e9e9e",
    gray: "#9e9e9e",
    red: "#b91c1c",
    green: "#166534",
    pink: "#ec4899",
    cream: "#f5f5dc",
  }

  return map[normalized] ?? "#888888"
}

const mapSort = (sort: SortOption) => {
  switch (sort) {
    case "price-asc":
      return "price_asc"
    case "price-desc":
      return "price_desc"
    case "best-selling":
      return "popular"
    default:
      return "newest"
  }
}

const dedupe = (values: string[]) => [...new Set(values.filter(Boolean))]

const mapApiProductToProduct = (product: ApiProduct): Product => {
  const variants = product.variants ?? []
  const productImages = product.images ?? []
  const variantImages = variants.flatMap((variant) => variant.images ?? [])
  const images = dedupe([...productImages, ...variantImages])
  const colorNames = dedupe(
    variants.map((variant) => variant.color ?? "").filter((color) => color.trim().length > 0),
  )
  const sizes = dedupe(
    variants.map((variant) => variant.size ?? "").filter((size) => size.trim().length > 0),
  )
  const variantIds = variants.map((variant) => variant.id)
  const originalPrice = product.metadata?.originalPriceCents
    ? formatPriceFromCents(product.metadata.originalPriceCents)
    : undefined
  const createdAtMs = product.createdAt ? new Date(product.createdAt).getTime() : 0
  const daysSinceCreated = createdAtMs ? (Date.now() - createdAtMs) / (1000 * 60 * 60 * 24) : 999

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: formatPriceFromCents(product.basePrice),
    originalPrice,
    image: images[0] ?? FALLBACK_IMAGE,
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    category: product.category?.name ?? "Uncategorized",
    subcategory: product.metadata?.subcategory ?? "",
    description: product.description ?? "No description available.",
    details: product.metadata?.details ?? [],
    sizes,
    colors: colorNames.map((name) => ({ name, hex: toColorHex(name) })),
    inStock: variants.some((variant) => variant.stockQuantity > 0),
    isNew: daysSinceCreated <= 30,
    isSale: typeof originalPrice === "number" && originalPrice > formatPriceFromCents(product.basePrice),
    variantIds,
  }
}

export async function getProducts(input?: {
  category?: string
  sort?: SortOption
  limit?: number
}): Promise<Product[]> {
  const response = await api.get<ProductsResponse>("/products", {
    params: {
      category: input?.category && input.category !== "all" ? input.category : undefined,
      sort: mapSort(input?.sort ?? "newest"),
      limit: input?.limit,
    },
  })

  return (response.data?.data ?? []).map(mapApiProductToProduct)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await api.get<ApiProduct>(`/products/${slug}`)
    return mapApiProductToProduct(response.data)
  } catch {
    return null
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return getProducts({ category })
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const sameCategory = await getProducts({ category: product.category.toLowerCase(), limit: 20 })
  return sameCategory.filter((item) => item.id !== product.id).slice(0, limit)
}

export async function addProductToCart(product: Product, quantity = 1): Promise<void> {
  const firstVariantId = product.variantIds[0]
  if (!firstVariantId) {
    throw new Error("No product variant available for cart action.")
  }

  await api.post("/cart/items", {
    variantId: firstVariantId,
    quantity,
  })
}

export function addProductToWishlist(product: Product): void {
  if (typeof window === "undefined") {
    return
  }

  const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
  const current = raw ? (JSON.parse(raw) as string[]) : []
  const next = Array.from(new Set([...current, product.id]))
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(next))
}

export const getCategories = (products: Product[]) => [
  { name: "All", slug: "all" },
  ...Array.from(new Set(products.map((product) => product.category)))
    .sort((a, b) => a.localeCompare(b))
    .map((category) => ({
      name: category,
      slug: category.toLowerCase(),
    })),
]
