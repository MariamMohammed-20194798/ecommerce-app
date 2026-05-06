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
exports.WishlistRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
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
};
let WishlistRepository = class WishlistRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByUserId(userId) {
        return this.prisma.wishlist.findMany({
            where: { userId },
            include: WISHLIST_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    async add(userId, variantId, image) {
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
    async remove(userId, variantId) {
        return this.prisma.wishlist.deleteMany({
            where: {
                userId,
                variantId,
            },
        });
    }
    async exists(userId, variantId) {
        const count = await this.prisma.wishlist.count({
            where: {
                userId,
                variantId,
            },
        });
        return count > 0;
    }
};
exports.WishlistRepository = WishlistRepository;
exports.WishlistRepository = WishlistRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WishlistRepository);
//# sourceMappingURL=wishlist.repository.js.map