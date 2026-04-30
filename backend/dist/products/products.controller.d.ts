import { ProductsService } from './products.service';
import { ProductsQueryDto, SearchQueryDto, ReviewsQueryDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    search(query: SearchQueryDto): Promise<{
        data: ({
            category: {
                name: string;
                id: string;
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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            images: string[];
            slug: string;
            categoryId: string;
            basePrice: import("@prisma/client/runtime/library").Decimal;
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
                name: string;
                id: string;
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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            images: string[];
            slug: string;
            categoryId: string;
            basePrice: import("@prisma/client/runtime/library").Decimal;
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
            name: string;
            id: string;
            slug: string;
        };
        reviews: ({
            user: {
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            rating: number;
            productId: string;
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        images: string[];
        slug: string;
        categoryId: string;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findReviews(id: string, query: ReviewsQueryDto): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            rating: number;
            productId: string;
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
            name: string;
            id: string;
            slug: string;
        };
        variants: {
            id: string;
            size: string | null;
            color: string | null;
            sku: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
            images: string[];
            productId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        images: string[];
        slug: string;
        categoryId: string;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        category: {
            name: string;
            id: string;
            slug: string;
        };
        variants: {
            id: string;
            size: string | null;
            color: string | null;
            sku: string;
            priceOverride: import("@prisma/client/runtime/library").Decimal | null;
            stockQuantity: number;
            images: string[];
            productId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        images: string[];
        slug: string;
        categoryId: string;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
