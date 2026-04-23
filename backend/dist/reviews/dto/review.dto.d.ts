export declare class CreateReviewDto {
    productId: string;
    rating: number;
    body?: string;
}
declare const UpdateReviewDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateReviewDto, "productId">>>;
export declare class UpdateReviewDto extends UpdateReviewDto_base {
    rating?: number;
    body?: string;
}
export {};
