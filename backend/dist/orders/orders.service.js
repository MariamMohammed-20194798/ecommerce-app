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
var OrdersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const order_repository_1 = require("./order.repository");
const order_dto_1 = require("./dto/order.dto");
const ALLOWED_TRANSITIONS = {
    [order_dto_1.OrderStatusEnum.PENDING]: [order_dto_1.OrderStatusEnum.PAID, order_dto_1.OrderStatusEnum.CANCELLED],
    [order_dto_1.OrderStatusEnum.PAID]: [
        order_dto_1.OrderStatusEnum.PROCESSING,
        order_dto_1.OrderStatusEnum.CANCELLED,
    ],
    [order_dto_1.OrderStatusEnum.PROCESSING]: [
        order_dto_1.OrderStatusEnum.SHIPPED,
        order_dto_1.OrderStatusEnum.CANCELLED,
    ],
    [order_dto_1.OrderStatusEnum.SHIPPED]: [order_dto_1.OrderStatusEnum.DELIVERED],
    [order_dto_1.OrderStatusEnum.DELIVERED]: [],
    [order_dto_1.OrderStatusEnum.CANCELLED]: [],
};
let OrdersService = OrdersService_1 = class OrdersService {
    ordersRepo;
    emailQueue;
    logger = new common_1.Logger(OrdersService_1.name);
    constructor(ordersRepo, emailQueue) {
        this.ordersRepo = ordersRepo;
        this.emailQueue = emailQueue;
    }
    async findAll(userId, query) {
        return this.ordersRepo.findMany(userId, query);
    }
    async findOne(orderId, userId) {
        const order = await this.ordersRepo.findOne(orderId, userId);
        if (!order) {
            throw new common_1.NotFoundException(`Order "${orderId}" was not found or does not belong to your account.`);
        }
        return order;
    }
    async updateStatus(orderId, dto) {
        const order = await this.ordersRepo.findById(orderId);
        if (!order) {
            throw new common_1.NotFoundException(`Order "${orderId}" was not found.`);
        }
        const currentStatus = order.status;
        const allowed = ALLOWED_TRANSITIONS[currentStatus];
        if (!allowed.includes(dto.status)) {
            throw new common_1.BadRequestException(`Cannot transition order from "${currentStatus}" to "${dto.status}". ` +
                `Allowed transitions: ${allowed.length ? allowed.join(', ') : 'none'}.`);
        }
        if (dto.status === order_dto_1.OrderStatusEnum.SHIPPED && !dto.trackingNumber) {
            throw new common_1.BadRequestException('A tracking number is required when marking an order as SHIPPED.');
        }
        const updated = await this.ordersRepo.updateStatus(orderId, dto.status, dto.trackingNumber);
        this.sendStatusEmail(updated, dto.trackingNumber).catch((err) => this.logger.error(`Failed to send status email for order ${orderId}: ${err.message}`));
        return updated;
    }
    async sendStatusEmail(order, trackingNumber) {
        const emailMap = {
            [order_dto_1.OrderStatusEnum.PAID]: 'order-confirmation',
            [order_dto_1.OrderStatusEnum.PROCESSING]: 'order-processing',
            [order_dto_1.OrderStatusEnum.SHIPPED]: 'order-shipped',
            [order_dto_1.OrderStatusEnum.DELIVERED]: 'order-delivered',
            [order_dto_1.OrderStatusEnum.CANCELLED]: 'order-cancelled',
            [order_dto_1.OrderStatusEnum.PENDING]: '',
        };
        const template = emailMap[order.status];
        if (!template)
            return;
        await this.emailQueue.add('order-status', {
            template,
            orderId: order.id,
            status: order.status,
            trackingNumber,
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = OrdersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bull_1.InjectQueue)('email')),
    __metadata("design:paramtypes", [order_repository_1.OrdersRepository, Object])
], OrdersService);
//# sourceMappingURL=orders.service.js.map