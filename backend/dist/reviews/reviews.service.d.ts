import { ReviewRepository } from './review.repository';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private readonly reviewsRepo;
    constructor(reviewsRepo: ReviewRepository);
    findMyReviews(userId: string): Promise<({
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
    create(userId: string, dto: CreateReviewDto): Promise<{
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
    update(id: string, userId: string, dto: UpdateReviewDto): Promise<{
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
    remove(id: string, userId: string, role?: string): Promise<{
        message: string;
    }>;
}
