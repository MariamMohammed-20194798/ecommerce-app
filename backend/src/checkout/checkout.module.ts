import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule], // gives CheckoutService access to CartRepository
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
