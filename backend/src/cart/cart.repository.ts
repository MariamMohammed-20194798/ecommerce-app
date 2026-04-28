import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

// Reusable include shape — used by every query that returns a cart
const CART_INCLUDE = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              basePrice: true,
              images: true,
            },
          },
        },
      },
    },
    orderBy: { id: 'asc' as const },
  },
} satisfies Prisma.CartInclude;

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Find or create cart ──────────────────────────────────────────────────────
  // For authenticated users: keyed by userId
  // For guests: keyed by sessionId
  // On login the caller should call mergeCarts() to combine guest → user cart

  async findOrCreate(userId?: string, sessionId?: string) {
    if (!userId && !sessionId) {
      throw new BadRequestException(
        'Cart identity is missing. Provide a valid user token or x-session-id.',
      );
    }

    // Try to find an existing cart
    const existing = await this.prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
      include: CART_INCLUDE,
    });

    if (existing) return existing;

    // Create a new cart
    return this.prisma.cart.create({
      data: {
        userId: userId ?? null,
        sessionId: sessionId ?? null,
        expiresAt: userId
          ? null
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // guests expire in 7 days
      },
      include: CART_INCLUDE,
    });
  }

  // ─── Find cart with full item detail ─────────────────────────────────────────

  async findById(cartId: string) {
    return this.prisma.cart.findUnique({
      where: { id: cartId },
      include: CART_INCLUDE,
    });
  }

  // ─── Add item to cart ─────────────────────────────────────────────────────────
  // If the same variant already exists in the cart, increment its quantity.

  async addItem(
    cartId: string,
    variantId: string,
    quantity: number,
    customization?: Record<string, unknown>,
  ) {
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId, variantId },
    });

    if (existingItem) {
      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: {
          variant: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  basePrice: true,
                  images: true,
                },
              },
            },
          },
        },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        cartId,
        variantId,
        quantity,
        customization: customization
          ? JSON.stringify(customization)
          : Prisma.JsonNull,
      },
      include: {
        variant: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  // ─── Update item quantity ─────────────────────────────────────────────────────

  async updateItem(itemId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        variant: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                images: true,
              },
            },
          },
        },
      },
    });
  }

  // ─── Remove single item ───────────────────────────────────────────────────────

  async removeItem(itemId: string) {
    return this.prisma.cartItem.delete({ where: { id: itemId } });
  }

  // ─── Find a single cart item by id ───────────────────────────────────────────

  async findItemById(itemId: string) {
    return this.prisma.cartItem.findUnique({ where: { id: itemId } });
  }

  // ─── Clear all items (used after checkout) ───────────────────────────────────

  async clearCart(cartId: string) {
    return this.prisma.cartItem.deleteMany({ where: { cartId } });
  }

  // ─── Merge guest cart into user cart on login ─────────────────────────────────

  async mergeCarts(guestSessionId: string, userId: string) {
    const guestCart = await this.prisma.cart.findFirst({
      where: { sessionId: guestSessionId },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) return;

    const userCart = await this.findOrCreate(userId);

    // Move each guest item into the user cart
    for (const item of guestCart.items) {
      await this.addItem(
        userCart.id,
        item.variantId,
        item.quantity,
        item.customization as Record<string, unknown> | undefined,
      );
    }

    // Delete the guest cart
    await this.prisma.cart.delete({ where: { id: guestCart.id } });
  }
}
