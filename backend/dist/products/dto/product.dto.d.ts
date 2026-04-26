export declare enum SortField {
    PRICE_ASC = "price_asc",
    PRICE_DESC = "price_desc",
    NEWEST = "newest",
    POPULAR = "popular",
    RATING = "rating"
}
export declare class ProductsQueryDto {
    page?: number;
    limit?: number;
    category?: string;
    size?: string;
    color?: string;
    priceMin?: number;
    priceMax?: number;
    sort?: SortField;
    isActive?: boolean;
}
export declare class SearchQueryDto {
    q: string;
    page?: number;
    limit?: number;
}
export declare class ReviewsQueryDto {
    page?: number;
    limit?: number;
    rating?: number;
}
export declare class CreateVariantDto {
    sku: string;
    size?: string;
    color?: string;
    priceOverride?: number;
    stockQuantity: number;
    images?: string[];
}
export declare class CreateProductDto {
    name: string;
    slug?: string;
    categoryId: string;
    description?: string;
    basePrice: number;
    images?: string[];
    isActive?: boolean;
    metadata?: Record<string, unknown>;
    variants?: CreateVariantDto[];
}
export declare class UpdateProductDto {
    name?: string;
    categoryId?: string;
    description?: string;
    basePrice?: number;
    isActive?: boolean;
    images?: string[];
    metadata?: Record<string, unknown>;
}
