import type { Request } from 'express';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    private getAuthUser;
    private getAuthUserId;
    findMyReviews(req: Request): Promise<({
        user: {
            email: string;
            id: string;
        };
        product: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        body: string | null;
    })[]>;
    create(dto: CreateReviewDto, req: Request): Promise<{
        user: {
            email: string;
            id: string;
        };
        product: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        body: string | null;
    }>;
    update(id: string, dto: UpdateReviewDto, req: Request): Promise<{
        user: {
            email: string;
            id: string;
        };
        product: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        productId: string;
        rating: number;
        body: string | null;
    }>;
    remove(id: string, req: Request): Promise<{
        message: string;
    }>;
}
