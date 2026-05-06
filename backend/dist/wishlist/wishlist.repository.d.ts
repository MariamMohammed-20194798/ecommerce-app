import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class WishlistRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByUserId(userId: string): Promise<({
        variant: {
            product: {
                id: string;
                slug: string;
                name: string;
                images: string[];
                basePrice: Prisma.Decimal;
            };
        } & {
            id: string;
            images: string[];
            productId: string;
            sku: string;
            size: string | null;
            color: string | null;
            priceOverride: Prisma.Decimal | null;
            stockQuantity: number;
        };
    } & {
        id: string;
        userId: string;
        variantId: string;
        image: string | null;
        createdAt: Date;
    })[]>;
    add(userId: string, variantId: string, image?: string): Promise<{
        variant: {
            product: {
                id: string;
                slug: string;
                name: string;
                images: string[];
                basePrice: Prisma.Decimal;
            };
        } & {
            id: string;
            images: string[];
            productId: string;
            sku: string;
            size: string | null;
            color: string | null;
            priceOverride: Prisma.Decimal | null;
            stockQuantity: number;
        };
    } & {
        id: string;
        userId: string;
        variantId: string;
        image: string | null;
        createdAt: Date;
    }>;
    remove(userId: string, variantId: string): Promise<Prisma.BatchPayload>;
    exists(userId: string, variantId: string): Promise<boolean>;
}
