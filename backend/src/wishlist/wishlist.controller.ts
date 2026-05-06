import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import express from 'express';
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

@ApiTags('wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  private getUserId(req: express.Request) {
    const user = req.user as { sub: string; id: string };
    return user.sub ?? user.id;
  }

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  @ApiOkResponse({ description: 'List of wishlist items' })
  async getWishlist(@Req() req: express.Request) {
    const userId = this.getUserId(req);
    return this.wishlistService.getWishlist(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add item to wishlist' })
  @ApiCreatedResponse({ description: 'Item added to wishlist' })
  async addToWishlist(
    @Body() dto: AddToWishlistDto,
    @Req() req: express.Request,
  ) {
    const userId = this.getUserId(req);
    return this.wishlistService.addToWishlist(userId, dto.variantId, dto.image);
  }

  @Delete(':variantId')
  @ApiOperation({ summary: 'Remove item from wishlist' })
  @ApiOkResponse({ description: 'Item removed from wishlist' })
  async removeFromWishlist(
    @Param('variantId', ParseUUIDPipe) variantId: string,
    @Req() req: express.Request,
  ) {
    const userId = this.getUserId(req);
    return this.wishlistService.removeFromWishlist(userId, variantId);
  }

  @Get('status/:variantId')
  @ApiOperation({ summary: 'Check if item is in wishlist' })
  @ApiOkResponse({ description: 'Wishlist status' })
  async checkStatus(
    @Param('variantId', ParseUUIDPipe) variantId: string,
    @Req() req: express.Request,
  ) {
    const userId = this.getUserId(req);
    return this.wishlistService.checkWishlistStatus(userId, variantId);
  }
}
