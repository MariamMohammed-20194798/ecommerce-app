import * as common from '@nestjs/common';
import type { Request } from 'express';
import { CheckoutService } from './checkout.service';
import { CreatePaymentIntentDto } from './dto/checkout.dto';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    private getAuthUserId;
    createIntent(dto: CreatePaymentIntentDto, req: Request, autoCreateOrder?: string): Promise<{
        clientSecret: any;
        paymentIntentId: any;
        subtotal: number;
        discount: number;
        total: number;
    }>;
    webhook(req: common.RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
}
