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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const order_dto_1 = require("./dto/order.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const admin_guard_1 = require("../products/guards/admin.guard");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    getAuthUserId(req) {
        const user = req;
        return user.user?.sub ?? user.user?.id;
    }
    async findAll(query, req) {
        const userId = this.getAuthUserId(req);
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing authenticated user id.');
        }
        return this.ordersService.findAll(userId, query);
    }
    async findOne(id, req) {
        const userId = this.getAuthUserId(req);
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing authenticated user id.');
        }
        return this.ordersService.findOne(id, userId);
    }
    async updateStatus(id, dto) {
        return this.ordersService.updateStatus(id, dto);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: "Get user's order history",
        description: 'Returns paginated order history for the authenticated user. ' +
            'Each order includes a summary of items, total, status, and item count. ' +
            'Filter by status to show only active, shipped, or completed orders.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Paginated order list' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: order_dto_1.OrderStatusEnum }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_dto_1.OrdersQueryDto, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('orders/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get order detail',
        description: 'Returns full order detail including all items (with product name, ' +
            'size, color, unit price), shipping address, payment record, and any ' +
            'applied discounts. Users can only access their own orders.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Full order detail with items and payment' }),
    (0, swagger_1.ApiNotFoundResponse)({
        description: 'Order not found or does not belong to user',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('admin/orders/:id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Update order status (admin)',
        description: "Updates an order's status. Enforces valid transitions: " +
            'PENDING → PAID → PROCESSING → SHIPPED → DELIVERED. ' +
            'SHIPPED requires a trackingNumber. ' +
            'An email is sent to the customer after each change. ' +
            'Requires ADMIN role.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Order updated with new status' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Order not found' }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Invalid status transition or missing tracking number',
    }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Requires ADMIN role' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, order_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('orders'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map