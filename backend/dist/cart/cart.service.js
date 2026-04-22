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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const cart_repository_1 = require("./cart.repository");
const prisma_service_1 = require("../database/prisma.service");
let CartService = class CartService {
    cartRepo;
    prisma;
    constructor(cartRepo, prisma) {
        this.cartRepo = cartRepo;
        this.prisma = prisma;
    }
    async getCart(userId, sessionId) {
        const cart = await this.cartRepo.findOrCreate(userId, sessionId);
        return this.formatCart(cart);
    }
    async addItem(dto, userId, sessionId) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: dto.variantId },
            select: {
                id: true,
                stockQuantity: true,
                priceOverride: true,
                product: { select: { isActive: true, name: true } },
            },
        });
        if (!variant) {
            throw new common_1.NotFoundException(`Variant with ID "${dto.variantId}" was not found.`);
        }
        if (!variant.product.isActive) {
            throw new common_1.BadRequestException(`This product is no longer available.`);
        }
        if (variant.stockQuantity < dto.quantity) {
            throw new common_1.BadRequestException(`Only ${variant.stockQuantity} unit(s) available in stock.`);
        }
        const cart = await this.cartRepo.findOrCreate(userId, sessionId);
        const item = await this.cartRepo.addItem(cart.id, dto.variantId, dto.quantity, dto.customization);
        return item;
    }
    async updateItem(itemId, dto, userId, sessionId) {
        const item = await this.cartRepo.findItemById(itemId);
        if (!item) {
            throw new common_1.NotFoundException(`Cart item "${itemId}" was not found.`);
        }
        await this.assertItemOwnership(item.cartId, userId, sessionId);
        if (dto.quantity === 0) {
            await this.cartRepo.removeItem(itemId);
            return { message: 'Item removed from cart.' };
        }
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: item.variantId },
            select: { stockQuantity: true },
        });
        if (variant && variant.stockQuantity < dto.quantity) {
            throw new common_1.BadRequestException(`Only ${variant.stockQuantity} unit(s) available in stock.`);
        }
        return this.cartRepo.updateItem(itemId, dto.quantity);
    }
    async removeItem(itemId, userId, sessionId) {
        const item = await this.cartRepo.findItemById(itemId);
        if (!item) {
            throw new common_1.NotFoundException(`Cart item "${itemId}" was not found.`);
        }
        await this.assertItemOwnership(item.cartId, userId, sessionId);
        await this.cartRepo.removeItem(itemId);
        return { message: 'Item removed from cart.' };
    }
    async assertItemOwnership(cartId, userId, sessionId) {
        const cart = await this.prisma.cart.findUnique({
            where: { id: cartId },
            select: { userId: true, sessionId: true },
        });
        if (!cart)
            throw new common_1.NotFoundException('Cart not found.');
        const isOwner = (userId && cart.userId === userId) ||
            (sessionId && cart.sessionId === sessionId);
        if (!isOwner) {
            throw new common_1.ForbiddenException('You do not own this cart item.');
        }
    }
    formatCart(cart) {
        const toNumber = (value) => {
            if (value === null || value === undefined)
                return 0;
            if (typeof value === 'number')
                return value;
            const n = Number(value);
            return Number.isFinite(n) ? n : 0;
        };
        const subtotal = (cart.items ?? []).reduce((sum, item) => {
            const unitPrice = toNumber(item.variant?.priceOverride ?? item.variant?.product?.basePrice ?? 0);
            const qty = toNumber(item.quantity);
            return sum + unitPrice * qty;
        }, 0);
        return {
            ...cart,
            subtotal,
            itemCount: (cart.items ?? []).reduce((sum, item) => sum + item.quantity, 0),
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository,
        prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map