import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

const WISHLIST_INCLUDE = {
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
} satisfies Prisma.WishlistInclude;

@Injectable()
export class WishlistRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: WISHLIST_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async add(userId: string, variantId: string, image?: string) {
    return this.prisma.wishlist.upsert({
      where: {
        userId_variantId: {
          userId,
          variantId,
        },
      },
      update: {
        image: image ?? undefined,
      },
      create: {
        userId,
        variantId,
        image,
      },
      include: WISHLIST_INCLUDE,
    });
  }

  async remove(userId: string, variantId: string) {
    return this.prisma.wishlist.deleteMany({
      where: {
        userId,
        variantId,
      },
    });
  }

  async exists(userId: string, variantId: string) {
    const count = await this.prisma.wishlist.count({
      where: {
        userId,
        variantId,
      },
    });
    return count > 0;
  }
}
