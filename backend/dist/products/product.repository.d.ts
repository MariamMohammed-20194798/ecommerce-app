import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { ProductsQueryDto, SearchQueryDto, ReviewsQueryDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildOrderBy;
    private buildVariantFilter;
    findMany(query: ProductsQueryDto): Promise<{
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
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
                images: string[];
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            slug: string;
            categoryId: string;
            basePrice: Prisma.Decimal;
            metadata: Prisma.JsonValue | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
        };
    }>;
    findBySlug(slug: string): Promise<({
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
            updatedAt: Date;
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
            priceOverride: Prisma.Decimal | null;
            stockQuantity: number;
            images: string[];
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        slug: string;
        categoryId: string;
        basePrice: Prisma.Decimal;
        metadata: Prisma.JsonValue | null;
    }) | null>;
    findById(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        slug: string;
        categoryId: string;
        basePrice: Prisma.Decimal;
        metadata: Prisma.JsonValue | null;
    } | null>;
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
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
                images: string[];
            }[];
        } & {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            slug: string;
            categoryId: string;
            basePrice: Prisma.Decimal;
            metadata: Prisma.JsonValue | null;
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
            userId: string;
            createdAt: Date;
            updatedAt: Date;
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
            id: string;
            name: string;
            slug: string;
        };
        variants: {
            id: string;
            size: string | null;
            color: string | null;
            sku: string;
            priceOverride: Prisma.Decimal | null;
            stockQuantity: number;
            images: string[];
            productId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        slug: string;
        categoryId: string;
        basePrice: Prisma.Decimal;
        metadata: Prisma.JsonValue | null;
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
            sku: string;
            priceOverride: Prisma.Decimal | null;
            stockQuantity: number;
            images: string[];
            productId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        name: string;
        updatedAt: Date;
        description: string | null;
        isActive: boolean;
        slug: string;
        categoryId: string;
        basePrice: Prisma.Decimal;
        metadata: Prisma.JsonValue | null;
    }>;
    slugExists(slug: string, excludeId?: string): Promise<boolean>;
}
