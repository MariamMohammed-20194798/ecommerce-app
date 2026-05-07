import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { ProductsQueryDto, SearchQueryDto, ReviewsQueryDto, CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildOrderBy;
    private buildVariantFilter;
    findMany(query: ProductsQueryDto): Promise<{
        data: {
            basePrice: number;
            variants: {
                priceOverride: number | null;
                id: string;
                images: string[];
                sku: string;
                size: string | null;
                color: string | null;
                stockQuantity: number;
            }[];
            category: {
                id: string;
                slug: string;
                name: string;
            };
            _count: {
                reviews: number;
            };
            id: string;
            categoryId: string;
            slug: string;
            name: string;
            description: string | null;
            images: string[];
            isActive: boolean;
            metadata: Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
        };
    }>;
    findBySlug(slug: string): Promise<{
        basePrice: number;
        variants: {
            priceOverride: number | null;
            id: string;
            images: string[];
            sku: string;
            size: string | null;
            color: string | null;
            stockQuantity: number;
        }[];
        category: {
            id: string;
            slug: string;
            name: string;
        };
        reviews: ({
            user: {
                id: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            userId: string;
            rating: number;
            body: string | null;
        })[];
        _count: {
            reviews: number;
        };
        id: string;
        categoryId: string;
        slug: string;
        name: string;
        description: string | null;
        images: string[];
        isActive: boolean;
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findById(id: string): Promise<{
        id: string;
        categoryId: string;
        slug: string;
        name: string;
        description: string | null;
        images: string[];
        basePrice: Prisma.Decimal;
        isActive: boolean;
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    search(query: SearchQueryDto): Promise<{
        data: ({
            basePrice: number;
            variants: {
                priceOverride: number | null;
                id: string;
                images: string[];
                size: string | null;
                color: string | null;
                stockQuantity: number;
            }[];
            category: {
                id: string;
                slug: string;
                name: string;
            };
            _count: {
                reviews: number;
            };
            id: string;
            categoryId: string;
            slug: string;
            name: string;
            description: string | null;
            images: string[];
            isActive: boolean;
            metadata: Prisma.JsonValue | null;
            createdAt: Date;
            updatedAt: Date;
        } | null)[];
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
            updatedAt: Date;
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
        basePrice: number;
        variants: {
            priceOverride: number | null;
            id: string;
            images: string[];
            productId: string;
            sku: string;
            size: string | null;
            color: string | null;
            stockQuantity: number;
        }[];
        category: {
            id: string;
            slug: string;
            name: string;
        };
        id: string;
        categoryId: string;
        slug: string;
        name: string;
        description: string | null;
        images: string[];
        isActive: boolean;
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        basePrice: number;
        variants: {
            priceOverride: number | null;
            id: string;
            images: string[];
            productId: string;
            sku: string;
            size: string | null;
            color: string | null;
            stockQuantity: number;
        }[];
        category: {
            id: string;
            slug: string;
            name: string;
        };
        id: string;
        categoryId: string;
        slug: string;
        name: string;
        description: string | null;
        images: string[];
        isActive: boolean;
        metadata: Prisma.JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    slugExists(slug: string, excludeId?: string): Promise<boolean>;
}
