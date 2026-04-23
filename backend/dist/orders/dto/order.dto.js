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
exports.UpdateOrderStatusDto = exports.OrdersQueryDto = exports.OrderStatusEnum = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var OrderStatusEnum;
(function (OrderStatusEnum) {
    OrderStatusEnum["PENDING"] = "PENDING";
    OrderStatusEnum["PAID"] = "PAID";
    OrderStatusEnum["PROCESSING"] = "PROCESSING";
    OrderStatusEnum["SHIPPED"] = "SHIPPED";
    OrderStatusEnum["DELIVERED"] = "DELIVERED";
    OrderStatusEnum["CANCELLED"] = "CANCELLED";
})(OrderStatusEnum || (exports.OrderStatusEnum = OrderStatusEnum = {}));
class OrdersQueryDto {
    page = 1;
    limit = 10;
    status;
}
exports.OrdersQueryDto = OrdersQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrdersQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], OrdersQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: OrderStatusEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(OrderStatusEnum),
    __metadata("design:type", String)
], OrdersQueryDto.prototype, "status", void 0);
class UpdateOrderStatusDto {
    status;
    trackingNumber;
    note;
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: OrderStatusEnum, example: 'SHIPPED' }),
    (0, class_validator_1.IsEnum)(OrderStatusEnum),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional tracking number shown in the shipping email',
        example: 'DHL-123456789',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Optional internal note for this status change',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "note", void 0);
//# sourceMappingURL=order.dto.js.map