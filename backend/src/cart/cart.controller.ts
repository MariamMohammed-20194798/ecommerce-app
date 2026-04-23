/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import express from 'express';
import { randomUUID } from 'crypto';

import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  private getAuthUserId(req: express.Request) {
    const user = req as unknown as { user?: { sub?: string; id?: string } };
    return user.user?.sub ?? user.user?.id;
  }

  private resolveSessionId(req: express.Request, userId?: string) {
    if (userId) return undefined;
    const headerSessionId = req.headers['x-session-id'] as string | undefined;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return req.cookies?.session_id ?? headerSessionId ?? randomUUID();
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // GET /cart
  //
  // Works for both authenticated users and guests.
  // Auth users → cart keyed by userId
  // Guests     → cart keyed by sessionId (from cookie/header)
  // ─────────────────────────────────────────────────────────────────────────────

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current cart',
    description:
      'Returns the cart for the authenticated user or the current guest session. ' +
      'If no cart exists yet, an empty one is created and returned. ' +
      'Response includes computed subtotal and itemCount.',
  })
  @ApiOkResponse({ description: 'Cart with items, subtotal, and itemCount' })
  async getCart(@Req() req: express.Request) {
    const userId = this.getAuthUserId(req);
    const sessionId = this.resolveSessionId(req, userId);
    if (!userId && sessionId) req.res?.setHeader('x-session-id', sessionId);
    return this.cartService.getCart(userId, sessionId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // POST /cart/items
  //
  // Add a product variant to the cart.
  // If the variant already exists, its quantity is incremented.
  // ─────────────────────────────────────────────────────────────────────────────

  @Post('items')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add item to cart',
    description:
      'Adds a product variant to the cart. If the same variant is already in ' +
      'the cart, the quantities are merged. Stock is validated before adding. ' +
      'Optionally include a customization object for custom print data.',
  })
  @ApiCreatedResponse({ description: 'Cart item created or quantity updated' })
  @ApiBadRequestResponse({
    description: 'Insufficient stock or inactive product',
  })
  async addItem(@Body() dto: AddCartItemDto, @Req() req: express.Request) {
    const userId = this.getAuthUserId(req);
    const sessionId = this.resolveSessionId(req, userId);
    if (!userId && sessionId) req.res?.setHeader('x-session-id', sessionId);
    return this.cartService.addItem(dto, userId, sessionId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PATCH /cart/items/:id
  //
  // Update the quantity of a specific cart item.
  // Sending quantity: 0 removes the item entirely.
  // ─────────────────────────────────────────────────────────────────────────────

  @Patch('items/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update cart item quantity',
    description:
      'Updates the quantity of a cart item. The caller must own the cart. ' +
      'Sending quantity: 0 removes the item entirely (same as DELETE).',
  })
  @ApiOkResponse({ description: 'Cart item updated' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  @ApiBadRequestResponse({ description: 'Insufficient stock' })
  async updateItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCartItemDto,
    @Req() req: express.Request,
  ) {
    const userId = this.getAuthUserId(req);
    const sessionId = this.resolveSessionId(req, userId);
    if (!userId && sessionId) req.res?.setHeader('x-session-id', sessionId);
    return this.cartService.updateItem(id, dto, userId, sessionId);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DELETE /cart/items/:id
  //
  // Remove a specific item from the cart.
  // ─────────────────────────────────────────────────────────────────────────────

  @Delete('items/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remove item from cart',
    description:
      'Removes a single item from the cart. The caller must own the cart. ',
  })
  @ApiOkResponse({ description: 'Item removed successfully' })
  @ApiNotFoundResponse({ description: 'Cart item not found' })
  async removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: express.Request,
  ) {
    const userId = this.getAuthUserId(req);
    const sessionId = this.resolveSessionId(req, userId);
    if (!userId && sessionId) req.res?.setHeader('x-session-id', sessionId);
    return this.cartService.removeItem(id, userId, sessionId);
  }
}
