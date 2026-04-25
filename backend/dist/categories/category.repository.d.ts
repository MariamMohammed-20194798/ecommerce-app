import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CategoriesQueryDto, CategoryProductsQueryDto, CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoryRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: CategoriesQueryDto): Promise<{
        data: ({
            parent: {
                id: string;
                name: string;
                slug: string;
            } | null;
            _count: {
                parent: number;
                children: number;
                products: number;
            };
        } & {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            images: string[];
            parentId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
        };
    }>;
    findTree(): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        parentId: string | null;
    } & {
        children: ({
            _count: {
                products: number;
            };
        } & {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            images: string[];
            parentId: string | null;
        } & any)[];
    })[]>;
    findBySlug(slug: string): Promise<({
        parent: {
            id: string;
            name: string;
            slug: string;
        } | null;
        children: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
        }[];
        _count: {
            children: number;
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        parentId: string | null;
    }) | null>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        parentId: string | null;
    } | null>;
    findProductsBySlug(slug: string, query: CategoryProductsQueryDto): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            description: string;
        };
        data: ({
            _count: {
                reviews: number;
            };
            variants: {
                id: string;
                images: string[];
                size: string | null;
                color: string | null;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
            }[];
        } & {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            categoryId: string;
            basePrice: Prisma.Decimal;
            isActive: boolean;
            metadata: Prisma.JsonValue | null;
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
    } | null>;
    create(dto: CreateCategoryDto & {
        slug: string;
    }): Promise<{
        parent: {
            id: string;
            name: string;
            slug: string;
        } | null;
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        parentId: string | null;
    }>;
    update(id: string, data: Partial<UpdateCategoryDto> & {
        slug?: string;
        images?: string[];
    }): Promise<{
        parent: {
            id: string;
            name: string;
            slug: string;
        } | null;
        children: {
            id: string;
            name: string;
            slug: string;
        }[];
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        parentId: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        images: string[];
        parentId: string | null;
    }>;
    slugExists(slug: string, excludeId?: string): Promise<boolean>;
    hasProducts(id: string): Promise<boolean>;
    hasChildren(id: string): Promise<boolean>;
}
