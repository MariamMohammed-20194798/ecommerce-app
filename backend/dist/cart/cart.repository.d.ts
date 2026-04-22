import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class CartRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findOrCreate(userId?: string, sessionId?: string): Promise<{
        items: ({
            variant: {
                product: {
                    id: string;
                    name: string;
                    slug: string;
                };
            } & {
                id: string;
                size: string | null;
                color: string | null;
                productId: string;
                sku: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
                images: string[];
            };
        } & {
            id: string;
            cartId: string;
            variantId: string;
            quantity: number;
            customization: Prisma.JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        expiresAt: Date | null;
        createdAt: Date;
        sessionId: string | null;
    }>;
    findById(cartId: string): Promise<({
        items: ({
            variant: {
                product: {
                    id: string;
                    name: string;
                    slug: string;
                };
            } & {
                id: string;
                size: string | null;
                color: string | null;
                productId: string;
                sku: string;
                priceOverride: Prisma.Decimal | null;
                stockQuantity: number;
                images: string[];
            };
        } & {
            id: string;
            cartId: string;
            variantId: string;
            quantity: number;
            customization: Prisma.JsonValue | null;
        })[];
    } & {
        id: string;
        userId: string | null;
        expiresAt: Date | null;
        createdAt: Date;
        sessionId: string | null;
    }) | null>;
    addItem(cartId: string, variantId: string, quantity: number, customization?: Record<string, unknown>): Promise<{
        variant: {
            product: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            size: string | null;
            color: string | null;
            productId: string;
            sku: string;
            priceOverride: Prisma.Decimal | null;
            stockQuantity: number;
            images: string[];
        };
    } & {
        id: string;
        cartId: string;
        variantId: string;
        quantity: number;
        customization: Prisma.JsonValue | null;
    }>;
    updateItem(itemId: string, quantity: number): Promise<{
        variant: {
            product: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            size: string | null;
            color: string | null;
            productId: string;
            sku: string;
            priceOverride: Prisma.Decimal | null;
            stockQuantity: number;
            images: string[];
        };
    } & {
        id: string;
        cartId: string;
        variantId: string;
        quantity: number;
        customization: Prisma.JsonValue | null;
    }>;
    removeItem(itemId: string): Promise<{
        id: string;
        cartId: string;
        variantId: string;
        quantity: number;
        customization: Prisma.JsonValue | null;
    }>;
    findItemById(itemId: string): Promise<{
        id: string;
        cartId: string;
        variantId: string;
        quantity: number;
        customization: Prisma.JsonValue | null;
    } | null>;
    clearCart(cartId: string): Promise<Prisma.BatchPayload>;
    mergeCarts(guestSessionId: string, userId: string): Promise<void>;
}
