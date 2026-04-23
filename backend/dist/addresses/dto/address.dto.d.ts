export declare class CreateAddressDto {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
}
declare const UpdateAddressDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateAddressDto>>;
export declare class UpdateAddressDto extends UpdateAddressDto_base {
}
export {};
