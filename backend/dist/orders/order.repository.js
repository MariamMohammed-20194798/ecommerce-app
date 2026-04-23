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
exports.OrdersRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const ORDER_DETAIL_INCLUDE = {
    items: {
        include: {
            variant: {
                include: {
                    product: {
                        select: { id: true, name: true, slug: true },
                    },
                },
            },
        },
    },
    address: true,
    payments: {
        select: {
            id: true,
            status: true,
            amount: true,
            currency: true,
            paidAt: true,
            stripePaymentId: true,
        },
    },
    discounts: {
        include: {
            discount: { select: { code: true, type: true, value: true } },
        },
    },
};
let OrdersRepository = class OrdersRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findMany(userId, query) {
        const { page = 1, limit = 10, status } = query;
        const skip = (page - 1) * limit;
        const where = {
            userId,
            ...(status ? { status } : {}),
        };
        const [orders, total] = await this.prisma.$transaction([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    items: {
                        select: {
                            id: true,
                            quantity: true,
                            unitPrice: true,
                            variant: {
                                select: {
                                    size: true,
                                    color: true,
                                    images: true,
                                    product: { select: { name: true, slug: true } },
                                },
                            },
                        },
                    },
                    _count: { select: { items: true } },
                },
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            data: orders,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
            },
        };
    }
    async findOne(orderId, userId) {
        return this.prisma.order.findFirst({
            where: {
                id: orderId,
                ...(userId ? { userId } : {}),
            },
            include: ORDER_DETAIL_INCLUDE,
        });
    }
    async updateStatus(orderId, status, trackingNumber) {
        return this.prisma.order.update({
            where: { id: orderId },
            data: {
                status,
                ...(trackingNumber ? { trackingNumber } : {}),
                updatedAt: new Date(),
            },
            include: ORDER_DETAIL_INCLUDE,
        });
    }
    async findById(orderId) {
        return this.prisma.order.findUnique({ where: { id: orderId } });
    }
};
exports.OrdersRepository = OrdersRepository;
exports.OrdersRepository = OrdersRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersRepository);
//# sourceMappingURL=order.repository.js.map