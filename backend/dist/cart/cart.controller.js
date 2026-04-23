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
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const express_1 = __importDefault(require("express"));
const crypto_1 = require("crypto");
const cart_service_1 = require("./cart.service");
const cart_dto_1 = require("./dto/cart.dto");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    getAuthUserId(req) {
        const user = req;
        return user.user?.sub ?? user.user?.id;
    }
    resolveSessionId(req, userId) {
        if (userId)
            return undefined;
        const headerSessionId = req.headers['x-session-id'];
        return req.cookies?.session_id ?? headerSessionId ?? (0, crypto_1.randomUUID)();
    }
    async getCart(req) {
        const userId = this.getAuthUserId(req);
        const sessionId = this.resolveSessionId(req, userId);
        if (!userId && sessionId)
            req.res?.setHeader('x-session-id', sessionId);
        return this.cartService.getCart(userId, sessionId);
    }
    async addItem(dto, req) {
        const userId = this.getAuthUserId(req);
        const sessionId = this.resolveSessionId(req, userId);
        if (!userId && sessionId)
            req.res?.setHeader('x-session-id', sessionId);
        return this.cartService.addItem(dto, userId, sessionId);
    }
    async updateItem(id, dto, req) {
        const userId = this.getAuthUserId(req);
        const sessionId = this.resolveSessionId(req, userId);
        if (!userId && sessionId)
            req.res?.setHeader('x-session-id', sessionId);
        return this.cartService.updateItem(id, dto, userId, sessionId);
    }
    async removeItem(id, req) {
        const userId = this.getAuthUserId(req);
        const sessionId = this.resolveSessionId(req, userId);
        if (!userId && sessionId)
            req.res?.setHeader('x-session-id', sessionId);
        return this.cartService.removeItem(id, userId, sessionId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get current cart',
        description: 'Returns the cart for the authenticated user or the current guest session. ' +
            'If no cart exists yet, an empty one is created and returned. ' +
            'Response includes computed subtotal and itemCount.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Cart with items, subtotal, and itemCount' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('items'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Add item to cart',
        description: 'Adds a product variant to the cart. If the same variant is already in ' +
            'the cart, the quantities are merged. Stock is validated before adding. ' +
            'Optionally include a customization object for custom print data.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Cart item created or quantity updated' }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Insufficient stock or inactive product',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [cart_dto_1.AddCartItemDto, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('items/:id'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update cart item quantity',
        description: 'Updates the quantity of a cart item. The caller must own the cart. ' +
            'Sending quantity: 0 removes the item entirely (same as DELETE).',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Cart item updated' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Cart item not found' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: 'Insufficient stock' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, cart_dto_1.UpdateCartItemDto, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('items/:id'),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Remove item from cart',
        description: 'Removes a single item from the cart. The caller must own the cart. ',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Item removed successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Cart item not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "removeItem", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('cart'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map