import { PrismaService } from '../database/prisma.service';
export declare class AddressesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllByUser(userId: string): Promise<{
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
    findOneByIdForUser(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        state: string | null;
        line1: string;
        line2: string | null;
        city: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
    } | null>;
    countByUser(userId: string): Promise<number>;
    unsetDefaultForUser(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    create(data: {
        userId: string;
        line1: string;
        line2?: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
        isDefault: boolean;
    }): Promise<{
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
    update(id: string, data: Partial<{
        line1: string;
        line2: string | null;
        city: string;
        state: string | null;
        postalCode: string;
        country: string;
        isDefault: boolean;
    }>): Promise<{
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
    countOtherAddresses(userId: string, id: string): Promise<number>;
    countOrdersUsingAddress(id: string): Promise<number>;
    remove(id: string): Promise<{
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
}
