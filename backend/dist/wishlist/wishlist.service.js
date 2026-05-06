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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const wishlist_repository_1 = require("./wishlist.repository");
const prisma_service_1 = require("../database/prisma.service");
let WishlistService = class WishlistService {
    wishlistRepository;
    prisma;
    constructor(wishlistRepository, prisma) {
        this.wishlistRepository = wishlistRepository;
        this.prisma = prisma;
    }
    async getWishlist(userId) {
        return this.wishlistRepository.findByUserId(userId);
    }
    async addToWishlist(userId, variantId, image) {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
        });
        if (!variant) {
            throw new common_1.NotFoundException('Product variant not found');
        }
        return this.wishlistRepository.add(userId, variantId, image);
    }
    async removeFromWishlist(userId, variantId) {
        return this.wishlistRepository.remove(userId, variantId);
    }
    async checkWishlistStatus(userId, variantId) {
        const isWishlisted = await this.wishlistRepository.exists(userId, variantId);
        return { isWishlisted };
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [wishlist_repository_1.WishlistRepository,
        prisma_service_1.PrismaService])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map