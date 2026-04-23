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
exports.AddressesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth-guard");
const addresses_service_1 = require("./addresses.service");
const address_dto_1 = require("./dto/address.dto");
let AddressesController = class AddressesController {
    addressesService;
    constructor(addressesService) {
        this.addressesService = addressesService;
    }
    getAuthUserId(req) {
        const user = req;
        return user.user?.sub ?? user.user?.id;
    }
    async findAll(req) {
        const userId = this.getAuthUserId(req);
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing authenticated user id.');
        }
        return this.addressesService.findAll(userId);
    }
    async findOne(id, req) {
        const userId = this.getAuthUserId(req);
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing authenticated user id.');
        }
        return this.addressesService.findOne(id, userId);
    }
    async create(dto, req) {
        const userId = this.getAuthUserId(req);
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing authenticated user id.');
        }
        return this.addressesService.create(userId, dto);
    }
    async update(id, dto, req) {
        const userId = this.getAuthUserId(req);
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing authenticated user id.');
        }
        return this.addressesService.update(id, userId, dto);
    }
    async setDefault(id, req) {
        const userId = this.getAuthUserId(req);
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing authenticated user id.');
        }
        return this.addressesService.setDefault(id, userId);
    }
    async remove(id, req) {
        const userId = this.getAuthUserId(req);
        if (!userId) {
            throw new common_1.UnauthorizedException('Missing authenticated user id.');
        }
        return this.addressesService.remove(id, userId);
    }
};
exports.AddressesController = AddressesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'List saved addresses',
        description: 'Returns all saved addresses for the authenticated user. Default address appears first.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Array of user addresses' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Get single address by id' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Address detail' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Address not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new address',
        description: 'Creates an address for the authenticated user. First address is automatically default.',
    }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Address created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [address_dto_1.CreateAddressDto, Object]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Update an existing address',
        description: 'Partial update is supported: only send fields you want to modify.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Address updated' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Address not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, address_dto_1.UpdateAddressDto, Object]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/default'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Set address as default',
        description: 'Sets this address as default and unsets all others for the user.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Address marked as default' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Address not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "setDefault", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete an address',
        description: 'Cannot delete default address when other addresses exist, or addresses linked to orders.',
    }),
    (0, swagger_1.ApiOkResponse)({ description: 'Address deleted successfully' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Address not found' }),
    (0, swagger_1.ApiUnprocessableEntityResponse)({
        description: 'Address cannot be deleted due to business rules.',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AddressesController.prototype, "remove", null);
exports.AddressesController = AddressesController = __decorate([
    (0, swagger_1.ApiTags)('addresses'),
    (0, common_1.Controller)('addresses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [addresses_service_1.AddressesService])
], AddressesController);
//# sourceMappingURL=addresses.controller.js.map