import { CategoryRepository } from './category.repository';
import { CategoriesQueryDto, CategoryProductsQueryDto, CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
export declare class CategoriesService {
    private readonly categoryRepo;
    constructor(categoryRepo: CategoryRepository);
    private generateSlug;
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
    findBySlug(slug: string): Promise<{
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
    }>;
    findProducts(slug: string, query: CategoryProductsQueryDto): Promise<{
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
                priceOverride: import("@prisma/client/runtime/library").Decimal | null;
                stockQuantity: number;
            }[];
        } & {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            categoryId: string;
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
    create(dto: CreateCategoryDto): Promise<{
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
    update(id: string, dto: UpdateCategoryDto): Promise<{
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
        message: string;
    }>;
}
