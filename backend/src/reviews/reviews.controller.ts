import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

type AuthUser = { sub?: string; id?: string; role?: string };

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  private getAuthUser(req: Request): AuthUser | undefined {
    const requestWithUser = req as unknown as { user?: AuthUser };
    return requestWithUser.user;
  }

  private getAuthUserId(req: Request): string {
    const user = this.getAuthUser(req);
    const userId = user?.sub ?? user?.id;
    if (!userId) {
      throw new UnauthorizedException('Missing authenticated user id.');
    }
    return userId;
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Current user's reviews",
    description:
      'Returns all reviews written by the authenticated user with product info.',
  })
  @ApiOkResponse({ description: 'Array of reviews for the current user' })
  async findMyReviews(@Req() req: Request) {
    const userId = this.getAuthUserId(req);
    return this.reviewsService.findMyReviews(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a review',
    description:
      'Creates a review for a purchased product (shipped/delivered only). One review per user per product.',
  })
  @ApiCreatedResponse({ description: 'Review created' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({ description: 'Product not purchased yet' })
  @ApiConflictResponse({ description: 'User already reviewed this product' })
  async create(@Body() dto: CreateReviewDto, @Req() req: Request) {
    const userId = this.getAuthUserId(req);
    return this.reviewsService.create(userId, dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update own review',
    description:
      'Users can update only their own review. Supports partial update of rating/body.',
  })
  @ApiOkResponse({ description: 'Review updated' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiForbiddenResponse({ description: 'Cannot update another user review' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateReviewDto,
    @Req() req: Request,
  ) {
    const userId = this.getAuthUserId(req);
    return this.reviewsService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete a review',
    description:
      'Users can delete their own reviews. Admin users can delete any review.',
  })
  @ApiOkResponse({ description: 'Review deleted' })
  @ApiNotFoundResponse({ description: 'Review not found' })
  @ApiForbiddenResponse({ description: 'Cannot delete another user review' })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const user = this.getAuthUser(req);
    const userId = this.getAuthUserId(req);
    return this.reviewsService.remove(id, userId, user?.role);
  }
}
