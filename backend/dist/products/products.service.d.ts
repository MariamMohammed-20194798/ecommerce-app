import { ProductRepository } from './product.repository';
import { ProductsQueryDto, SearchQueryDto, ReviewsQueryDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsService {
    private readonly productsRepo;
    constructor(productsRepo: ProductRepository);
    findAll(query: ProductsQueryDto): Promise<{
        data: ({
            category: {
                id: string;
                slug: string;
                name: string;
            };
            variants: {
                id: string;
                sku: string;
                size: string | null;
                color: string | null;
                priceOverride: import("@prisma/client/runtime/library").Decimal | null;
                stockQuantity: number;
                images: string[];
            }[];
            _count: {
                reviews: number;
            };
        } & {
            id: string;
            categoryId: string;
            slug: string;
            name: string;
            description: string | null;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            isActive: boolean;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
        };
    }>;
    findBySlug(slug: string): Promise<{
        category: {
            id: string;
            slug: string;
            name: string;
        };
        variants: {
            id: string;
            sku: string;
            size: string | null;
            color: string | null;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
            images: string[];
        }[];
        reviews: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            userId: string;
            rating: number;
            body: string | null;
        })[];
        _count: {
            reviews: number;
        };
    } & {
        id: string;
        categoryId: string;
        slug: string;
        name: string;
        description: string | null;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    search(query: SearchQueryDto): Promise<{
        data: ({
            category: {
                id: string;
                slug: string;
                name: string;
            };
            variants: {
                id: string;
                size: string | null;
                color: string | null;
                priceOverride: import("@prisma/client/runtime/library").Decimal | null;
                stockQuantity: number;
                images: string[];
            }[];
            _count: {
                reviews: number;
            };
        } & {
            id: string;
            categoryId: string;
            slug: string;
            name: string;
            description: string | null;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            isActive: boolean;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
        };
    }>;
    findReviews(productId: string, query: ReviewsQueryDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            productId: string;
            userId: string;
            rating: number;
            body: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            averageRating: number | null;
            totalReviews: number;
        };
    }>;
    create(dto: CreateProductDto): Promise<{
        category: {
            id: string;
            slug: string;
            name: string;
        };
        variants: {
            id: string;
            productId: string;
            sku: string;
            size: string | null;
            color: string | null;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
            images: string[];
        }[];
    } & {
        id: string;
        categoryId: string;
        slug: string;
        name: string;
        description: string | null;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            id: string;
            slug: string;
            name: string;
        };
        variants: {
            id: string;
            productId: string;
            sku: string;
            size: string | null;
            color: string | null;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
            images: string[];
        }[];
    } & {
        id: string;
        categoryId: string;
        slug: string;
        name: string;
        description: string | null;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        isActive: boolean;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
