export declare class CategoriesQueryDto {
    page?: number;
    limit?: number;
    rootOnly?: boolean;
    withCounts?: boolean;
}
export declare class CategoryProductsQueryDto {
    page?: number;
    limit?: number;
    includeSubcategories?: boolean;
}
export declare class CreateCategoryDto {
    name: string;
    slug?: string;
    description?: string;
    parentId?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string | null;
}
