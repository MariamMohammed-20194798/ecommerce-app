import type { Request } from 'express';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    private getAuthUser;
    private getAuthUserId;
    findMyReviews(req: Request): Promise<({
        product: {
            id: string;
            slug: string;
            name: string;
        };
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        productId: string;
        userId: string;
        rating: number;
        body: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    create(dto: CreateReviewDto, req: Request): Promise<{
        product: {
            id: string;
            slug: string;
            name: string;
        };
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        productId: string;
        userId: string;
        rating: number;
        body: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateReviewDto, req: Request): Promise<{
        product: {
            id: string;
            slug: string;
            name: string;
        };
        user: {
            id: string;
            email: string;
        };
    } & {
        id: string;
        productId: string;
        userId: string;
        rating: number;
        body: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string, req: Request): Promise<{
        message: string;
    }>;
}
