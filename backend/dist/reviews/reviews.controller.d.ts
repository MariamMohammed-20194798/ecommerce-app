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
            id: string;
            email: string;
        };
        product: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        productId: string;
        body: string | null;
    })[]>;
    create(dto: CreateReviewDto, req: Request): Promise<{
        user: {
            id: string;
            email: string;
        };
        product: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        productId: string;
        body: string | null;
    }>;
    update(id: string, dto: UpdateReviewDto, req: Request): Promise<{
        user: {
            id: string;
            email: string;
        };
        product: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        productId: string;
        body: string | null;
    }>;
    remove(id: string, req: Request): Promise<{
        message: string;
    }>;
}
