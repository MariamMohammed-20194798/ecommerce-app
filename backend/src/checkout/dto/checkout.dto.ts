import {
  IsUUID,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
  @ApiProperty({
    description: "Shipping address UUID from the user's saved addresses",
  })
  @IsUUID()
  addressId: string;

  @ApiPropertyOptional({
    description: 'Optional discount code to apply at checkout',
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  discountCode?: string;
}

export class ConfirmPaymentDto {
  @ApiProperty({
    description:
      'Stripe PaymentIntent id returned after client-side confirmation',
  })
  @IsString()
  @MinLength(3)
  paymentIntentId: string;
}
