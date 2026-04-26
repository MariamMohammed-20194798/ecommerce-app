import { ReviewRepository } from './review.repository';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private readonly reviewsRepo;
    constructor(reviewsRepo: ReviewRepository);
    findMyReviews(userId: string): Promise<({
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
    create(userId: string, dto: CreateReviewDto): Promise<{
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
    update(id: string, userId: string, dto: UpdateReviewDto): Promise<{
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
    remove(id: string, userId: string, role?: string): Promise<{
        message: string;
    }>;
}
