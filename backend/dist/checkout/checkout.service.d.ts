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
    constructor(prisma: PrismaService, cartRepo: CartRepository, config: ConfigService);
    createPaymentIntent(userId: string, dto: CreatePaymentIntentDto, autoCreateOrderForTesting?: boolean): Promise<{
        clientSecret: any;
        paymentIntentId: any;
        subtotal: number;
        discount: number;
        total: number;
    }>;
    handleWebhook(rawBody: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    private createOrderFromIntent;
}
