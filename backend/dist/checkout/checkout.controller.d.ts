import * as common from '@nestjs/common';
import type { Request } from 'express';
import { CheckoutService } from './checkout.service';
import { ConfirmPaymentDto, CreatePaymentIntentDto } from './dto/checkout.dto';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    private getAuthUserId;
    createIntent(dto: CreatePaymentIntentDto, req: Request, autoCreateOrder?: string): Promise<{
        clientSecret: any;
        paymentIntentId: any;
        subtotal: number;
        shipping: number;
        discount: number;
        total: number;
        currency: string;
    }>;
    confirmPayment(dto: ConfirmPaymentDto, req: Request): Promise<{
        success: boolean;
        status: any;
        orderId: string | undefined;
    }>;
    webhook(req: common.RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
}
