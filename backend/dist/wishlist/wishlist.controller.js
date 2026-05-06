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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const express_1 = __importDefault(require("express"));
const wishlist_service_1 = require("./wishlist.service");
const wishlist_dto_1 = require("./dto/wishlist.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
let WishlistController = class WishlistController {
    wishlistService;
    constructor(wishlistService) {
        this.wishlistService = wishlistService;
    }
    getUserId(req) {
        const user = req.user;
        return user.sub ?? user.id;
    }
    async getWishlist(req) {
        const userId = this.getUserId(req);
        return this.wishlistService.getWishlist(userId);
    }
    async addToWishlist(dto, req) {
        const userId = this.getUserId(req);
        return this.wishlistService.addToWishlist(userId, dto.variantId, dto.image);
    }
    async removeFromWishlist(variantId, req) {
        const userId = this.getUserId(req);
        return this.wishlistService.removeFromWishlist(userId, variantId);
    }
    async checkStatus(variantId, req) {
        const userId = this.getUserId(req);
        return this.wishlistService.checkWishlistStatus(userId, variantId);
    }
};
exports.WishlistController = WishlistController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user wishlist' }),
    (0, swagger_1.ApiOkResponse)({ description: 'List of wishlist items' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to wishlist' }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Item added to wishlist' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wishlist_dto_1.AddToWishlistDto, Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.Delete)(':variantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from wishlist' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Item removed from wishlist' }),
    __param(0, (0, common_1.Param)('variantId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "removeFromWishlist", null);
__decorate([
    (0, common_1.Get)('status/:variantId'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if item is in wishlist' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Wishlist status' }),
    __param(0, (0, common_1.Param)('variantId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WishlistController.prototype, "checkStatus", null);
exports.WishlistController = WishlistController = __decorate([
    (0, swagger_1.ApiTags)('wishlist'),
    (0, common_1.Controller)('wishlist'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [wishlist_service_1.WishlistService])
], WishlistController);
//# sourceMappingURL=wishlist.controller.js.map