import { ProductsService } from './products.service';
import { ProductsQueryDto, SearchQueryDto, ReviewsQueryDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    search(query: SearchQueryDto): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
            _count: {
                reviews: number;
            };
            variants: {
                id: string;
                size: string | null;
                color: string | null;
                priceOverride: import("@prisma/client/runtime/library").Decimal | null;
                stockQuantity: number;
                images: string[];
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            isActive: boolean;
            slug: string;
            description: string | null;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            categoryId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
        };
    }>;
    findAll(query: ProductsQueryDto): Promise<{
        data: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
            _count: {
                reviews: number;
            };
            variants: {
                id: string;
                size: string | null;
                color: string | null;
                sku: string;
                priceOverride: import("@prisma/client/runtime/library").Decimal | null;
                stockQuantity: number;
                images: string[];
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            isActive: boolean;
            slug: string;
            description: string | null;
            basePrice: import("@prisma/client/runtime/library").Decimal;
            categoryId: string;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
        };
    }>;
    findOne(slug: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        reviews: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            productId: string;
            rating: number;
            body: string | null;
        })[];
        _count: {
            reviews: number;
        };
        variants: {
            id: string;
            size: string | null;
            color: string | null;
            sku: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
            images: string[];
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        slug: string;
        description: string | null;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findReviews(id: string, query: ReviewsQueryDto): Promise<{
        data: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            userId: string;
            createdAt: Date;
            productId: string;
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
            name: string;
            slug: string;
        };
        variants: {
            id: string;
            size: string | null;
            color: string | null;
            productId: string;
            sku: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
            images: string[];
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        slug: string;
        description: string | null;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
        };
        variants: {
            id: string;
            size: string | null;
            color: string | null;
            productId: string;
            sku: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
            images: string[];
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        isActive: boolean;
        slug: string;
        description: string | null;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
