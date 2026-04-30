import { OtpType } from '@prisma/client';
export declare class SendOtpDto {
    email: string;
    type: OtpType;
    name?: string;
}
