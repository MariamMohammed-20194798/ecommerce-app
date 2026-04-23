import type { Request } from 'express';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';
export declare class AddressesController {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    private getAuthUserId;
    findAll(req: Request): Promise<{
        id: string;
        userId: string;
        state: string | null;
        line1: string;
        line2: string | null;
        city: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
    }[]>;
    findOne(id: string, req: Request): Promise<{
        id: string;
        userId: string;
        state: string | null;
        line1: string;
        line2: string | null;
        city: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
    }>;
    create(dto: CreateAddressDto, req: Request): Promise<{
        id: string;
        userId: string;
        state: string | null;
        line1: string;
        line2: string | null;
        city: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
    }>;
    update(id: string, dto: UpdateAddressDto, req: Request): Promise<{
        id: string;
        userId: string;
        state: string | null;
        line1: string;
        line2: string | null;
        city: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
    }>;
    setDefault(id: string, req: Request): Promise<{
        id: string;
        userId: string;
        state: string | null;
        line1: string;
        line2: string | null;
        city: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
    }>;
    remove(id: string, req: Request): Promise<{
        message: string;
    }>;
}
