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
exports.CartRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
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
                        },
                    },
                },
            },
        },
        orderBy: { id: 'asc' },
    },
};
let CartRepository = class CartRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findOrCreate(userId, sessionId) {
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Cart identity is missing. Provide a valid user token or x-session-id.');
        }
        const existing = await this.prisma.cart.findFirst({
            where: userId ? { userId } : { sessionId },
            include: CART_INCLUDE,
        });
        if (existing)
            return existing;
        return this.prisma.cart.create({
            data: {
                userId: userId ?? null,
                sessionId: sessionId ?? null,
                expiresAt: userId
                    ? null
                    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
            include: CART_INCLUDE,
        });
    }
    async findById(cartId) {
        return this.prisma.cart.findUnique({
            where: { id: cartId },
            include: CART_INCLUDE,
        });
    }
    async addItem(cartId, variantId, quantity, customization) {
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
                            product: { select: { id: true, name: true, slug: true } },
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
                    : client_1.Prisma.JsonNull,
            },
            include: {
                variant: {
                    include: {
                        product: { select: { id: true, name: true, slug: true } },
                    },
                },
            },
        });
    }
    async updateItem(itemId, quantity) {
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: {
                variant: {
                    include: {
                        product: { select: { id: true, name: true, slug: true } },
                    },
                },
            },
        });
    }
    async removeItem(itemId) {
        return this.prisma.cartItem.delete({ where: { id: itemId } });
    }
    async findItemById(itemId) {
        return this.prisma.cartItem.findUnique({ where: { id: itemId } });
    }
    async clearCart(cartId) {
        return this.prisma.cartItem.deleteMany({ where: { cartId } });
    }
    async mergeCarts(guestSessionId, userId) {
        const guestCart = await this.prisma.cart.findFirst({
            where: { sessionId: guestSessionId },
            include: { items: true },
        });
        if (!guestCart || guestCart.items.length === 0)
            return;
        const userCart = await this.findOrCreate(userId);
        for (const item of guestCart.items) {
            await this.addItem(userCart.id, item.variantId, item.quantity, item.customization);
        }
        await this.prisma.cart.delete({ where: { id: guestCart.id } });
    }
};
exports.CartRepository = CartRepository;
exports.CartRepository = CartRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartRepository);
//# sourceMappingURL=cart.repository.js.map