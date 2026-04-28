import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { CartRepository } from '../cart/cart.repository';
import { CreatePaymentIntentDto } from './dto/checkout.dto';
export declare class CheckoutService {
    private readonly prisma;
    private readonly cartRepo;
    private readonly config;
    private readonly stripe;
    private readonly logger;
    private readonly freeShippingThreshold;
    private readonly standardShippingAmount;
    constructor(prisma: PrismaService, cartRepo: CartRepository, config: ConfigService);
    createPaymentIntent(userId: string, dto: CreatePaymentIntentDto, autoCreateOrderForTesting?: boolean): Promise<{
        clientSecret: any;
        paymentIntentId: any;
        subtotal: number;
        shipping: number;
        discount: number;
        total: number;
        currency: string;
    }>;
    confirmPayment(userId: string, paymentIntentId: string): Promise<{
        success: boolean;
        status: any;
        orderId: string | undefined;
    }>;
    handleWebhook(rawBody: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    private createOrderFromIntent;
}
