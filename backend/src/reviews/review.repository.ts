import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMyReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.review.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async productExists(productId: string) {
    return this.prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
  }

  async hasPurchasedProduct(userId: string, productId: string) {
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        order: {
          userId,
          status: { in: [OrderStatus.SHIPPED, OrderStatus.DELIVERED] },
        },
        variant: { productId },
      },
      select: { id: true },
    });
    return !!orderItem;
  }

  async findUserReviewForProduct(userId: string, productId: string) {
    return this.prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: { id: true },
    });
  }

  async create(data: {
    userId: string;
    productId: string;
    rating: number;
    body?: string;
  }) {
    return this.prisma.review.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        body: data.body,
      },
      include: {
        user: { select: { id: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      rating: number;
      body: string | null;
    }>,
  ) {
    return this.prisma.review.update({
      where: { id },
      data,
      include: {
        user: { select: { id: true, email: true } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.review.delete({ where: { id } });
  }
}
