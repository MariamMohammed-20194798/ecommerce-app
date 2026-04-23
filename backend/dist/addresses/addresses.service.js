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
exports.AddressesService = void 0;
const common_1 = require("@nestjs/common");
const address_repository_1 = require("./address.repository");
let AddressesService = class AddressesService {
    addressesRepo;
    constructor(addressesRepo) {
        this.addressesRepo = addressesRepo;
    }
    async findAll(userId) {
        return this.addressesRepo.findAllByUser(userId);
    }
    async findOne(id, userId) {
        const address = await this.addressesRepo.findOneByIdForUser(id, userId);
        if (!address) {
            throw new common_1.NotFoundException(`Address "${id}" was not found.`);
        }
        return address;
    }
    async create(userId, dto) {
        const existingCount = await this.addressesRepo.countByUser(userId);
        const isFirstAddress = existingCount === 0;
        const nextIsDefault = isFirstAddress || dto.isDefault === true;
        if (nextIsDefault) {
            await this.addressesRepo.unsetDefaultForUser(userId);
        }
        return this.addressesRepo.create({
            userId,
            line1: dto.line1,
            line2: dto.line2,
            city: dto.city,
            state: dto.state,
            postalCode: dto.postalCode,
            country: dto.country,
            isDefault: nextIsDefault,
        });
    }
    async update(id, userId, dto) {
        await this.findOne(id, userId);
        if (dto.isDefault === true) {
            await this.addressesRepo.unsetDefaultForUser(userId);
        }
        const updateData = {
            ...(dto.line1 !== undefined ? { line1: dto.line1 } : {}),
            ...(dto.line2 !== undefined ? { line2: dto.line2 } : {}),
            ...(dto.city !== undefined ? { city: dto.city } : {}),
            ...(dto.state !== undefined ? { state: dto.state } : {}),
            ...(dto.postalCode !== undefined ? { postalCode: dto.postalCode } : {}),
            ...(dto.country !== undefined ? { country: dto.country } : {}),
            ...(dto.isDefault !== undefined ? { isDefault: dto.isDefault } : {}),
        };
        return this.addressesRepo.update(id, updateData);
    }
    async setDefault(id, userId) {
        await this.findOne(id, userId);
        await this.addressesRepo.unsetDefaultForUser(userId);
        return this.addressesRepo.update(id, { isDefault: true });
    }
    async remove(id, userId) {
        const address = await this.findOne(id, userId);
        const otherAddressesCount = await this.addressesRepo.countOtherAddresses(userId, id);
        if (address.isDefault && otherAddressesCount > 0) {
            throw new common_1.UnprocessableEntityException('Cannot delete default address while other addresses exist.');
        }
        const linkedOrdersCount = await this.addressesRepo.countOrdersUsingAddress(id);
        if (linkedOrdersCount > 0) {
            throw new common_1.UnprocessableEntityException('Cannot delete address linked to existing orders.');
        }
        await this.addressesRepo.remove(id);
        return { message: `Address "${id}" deleted successfully.` };
    }
};
exports.AddressesService = AddressesService;
exports.AddressesService = AddressesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [address_repository_1.AddressesRepository])
], AddressesService);
//# sourceMappingURL=addresses.service.js.map