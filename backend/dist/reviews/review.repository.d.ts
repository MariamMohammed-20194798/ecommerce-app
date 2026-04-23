import { PrismaService } from '../database/prisma.service';
export declare class ReviewRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findById(id: string): Promise<({
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
    }) | null>;
    productExists(productId: string): Promise<{
        id: string;
    } | null>;
    hasPurchasedProduct(userId: string, productId: string): Promise<boolean>;
    findUserReviewForProduct(userId: string, productId: string): Promise<{
        id: string;
    } | null>;
    create(data: {
        userId: string;
        productId: string;
        rating: number;
        body?: string;
    }): Promise<{
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
    update(id: string, data: Partial<{
        rating: number;
        body: string | null;
    }>): Promise<{
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
    remove(id: string): Promise<{
        id: string;
        userId: string;
        createdAt: Date;
        updatedAt: Date;
        rating: number;
        productId: string;
        body: string | null;
    }>;
}
