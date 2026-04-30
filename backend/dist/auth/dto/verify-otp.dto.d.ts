import { OtpType } from '@prisma/client';
export declare class VerifyOtpDto {
    email: string;
    code: string;
    type: OtpType;
    name?: string;
}
