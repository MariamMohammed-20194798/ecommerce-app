import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { OtpType } from '@prisma/client';

export class SendOtpDto {
  @IsEmail()
  email: string;

  @IsEnum(OtpType)
  type: OtpType;

  @IsOptional()
  @IsString()
  name?: string;
}
