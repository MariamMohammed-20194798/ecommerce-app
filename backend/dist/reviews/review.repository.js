"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRepository = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
let ReviewRepository = class ReviewRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMyReviews(userId) {
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
    async findById(id) {
        return this.prisma.review.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, email: true } },
                product: { select: { id: true, name: true, slug: true } },
            },
        });
    }
    async productExists(productId) {
        return this.prisma.product.findUnique({
            where: { id: productId },
            select: { id: true },
        });
    }
    async hasPurchasedProduct(userId, productId) {
        const orderItem = await this.prisma.orderItem.findFirst({
            where: {
                order: {
                    userId,
                    status: { in: [client_1.OrderStatus.SHIPPED, client_1.OrderStatus.DELIVERED] },
                },
                variant: { productId },
            },
            select: { id: true },
        });
        return !!orderItem;
    }
    async findUserReviewForProduct(userId, productId) {
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
    async create(data) {
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
    async update(id, data) {
        return this.prisma.review.update({
            where: { id },
            data,
            include: {
                user: { select: { id: true, email: true } },
                product: { select: { id: true, name: true, slug: true } },
            },
        });
    }
    async remove(id) {
        return this.prisma.review.delete({ where: { id } });
    }
};
exports.ReviewRepository = ReviewRepository;
exports.ReviewRepository = ReviewRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewRepository);
//# sourceMappingURL=review.repository.js.map