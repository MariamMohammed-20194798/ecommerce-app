/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as common from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { CheckoutService } from './checkout.service';
import { CreatePaymentIntentDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

@ApiTags('checkout')
@common.Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /checkout/intent
  //
  // Protected — user must be logged in.
  // Validates the cart, recalculates total server-side, applies any discount,
  // then creates a Stripe PaymentIntent and returns the client_secret to the
  // frontend so it can render Stripe Elements and complete payment.
  // ─────────────────────────────────────────────────────────────────────────────

  @common.Post('intent')
  @common.UseGuards(JwtAuthGuard)
  @common.HttpCode(common.HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Stripe PaymentIntent',
    description:
      'Server-side total is always recalculated — never trust the frontend total. ' +
      'Validates stock, applies discount code if provided, then creates a ' +
      'Stripe PaymentIntent. Returns the client_secret for use with Stripe Elements. ' +
      'Requires authentication.',
  })
  @ApiCreatedResponse({
    description:
      'Returns clientSecret, subtotal, discount, and total (all in cents)',
  })
  @ApiBadRequestResponse({
    description: 'Empty cart, invalid address, or invalid discount code',
  })
  async createIntent(
    @common.Body() dto: CreatePaymentIntentDto,
    @common.Req() req: Request,
  ) {
    const userId = (req as any).user.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.checkoutService.createPaymentIntent(userId, dto);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /checkout/webhook
  //
  // Public — called by Stripe, NOT by your frontend.
  // Stripe signature is verified inside the service using the raw body.
  //
  // IMPORTANT: This route must receive the raw request body (Buffer), not the
  // parsed JSON body. In main.ts, exclude this route from the global
  // bodyParser JSON middleware:
  //
  //   app.use('/api/checkout/webhook', express.raw({ type: 'application/json' }));
  //   await app.listen(3001);
  //
  // On payment_intent.succeeded: atomically creates order, decrements stock,
  // records payment, clears cart, and applies discount usage.
  // ─────────────────────────────────────────────────────────────────────────────

  @common.Post('webhook')
  @common.HttpCode(common.HttpStatus.OK)
  @ApiOperation({
    summary: 'Stripe webhook receiver',
    description:
      'Receives events from Stripe. Verifies the webhook signature using ' +
      'STRIPE_WEBHOOK_SECRET. On payment_intent.succeeded, atomically creates ' +
      'the order. This endpoint must receive the raw request body — do not ' +
      'apply JSON body-parser middleware to this route.',
  })
  @ApiOkResponse({ description: '{ received: true }' })
  @ApiBadRequestResponse({ description: 'Invalid Stripe signature' })
  async webhook(
    @common.Req() req: common.RawBodyRequest<Request>,
    @common.Headers('stripe-signature') signature: string,
  ) {
    return this.checkoutService.handleWebhook(req.rawBody!, signature);
  }
}
