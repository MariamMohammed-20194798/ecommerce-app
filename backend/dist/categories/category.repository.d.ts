import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import { CategoriesQueryDto, CategoryProductsQueryDto, CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoryRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: CategoriesQueryDto): Promise<{
        data: ({
            _count: {
                parent: number;
                children: number;
                products: number;
            };
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
            parentId: string | null;
        } & any)[];
    })[]>;
    findBySlug(slug: string): Promise<({
        _count: {
            children: number;
            products: number;
        };
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
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        parentId: string | null;
    }) | null>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
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
            isActive: boolean;
            slug: string;
            description: string | null;
            basePrice: Prisma.Decimal;
            categoryId: string;
            metadata: Prisma.JsonValue | null;
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
        parentId: string | null;
    }>;
    update(id: string, data: Partial<UpdateCategoryDto> & {
        slug?: string;
    }): Promise<{
        _count: {
            products: number;
        };
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
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        parentId: string | null;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        parentId: string | null;
    }>;
    slugExists(slug: string, excludeId?: string): Promise<boolean>;
    hasProducts(id: string): Promise<boolean>;
    hasChildren(id: string): Promise<boolean>;
}
