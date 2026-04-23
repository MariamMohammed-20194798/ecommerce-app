import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@ApiTags('addresses')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  private getAuthUserId(req: Request) {
    const user = req as unknown as { user?: { sub?: string; id?: string } };
    return user.user?.sub ?? user.user?.id;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List saved addresses',
    description:
      'Returns all saved addresses for the authenticated user. Default address appears first.',
  })
  @ApiOkResponse({ description: 'Array of user addresses' })
  async findAll(@Req() req: Request) {
    const userId = this.getAuthUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Missing authenticated user id.');
    }
    return this.addressesService.findAll(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single address by id' })
  @ApiOkResponse({ description: 'Address detail' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = this.getAuthUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Missing authenticated user id.');
    }
    return this.addressesService.findOne(id, userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new address',
    description:
      'Creates an address for the authenticated user. First address is automatically default.',
  })
  @ApiCreatedResponse({ description: 'Address created' })
  async create(@Body() dto: CreateAddressDto, @Req() req: Request) {
    const userId = this.getAuthUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Missing authenticated user id.');
    }
    return this.addressesService.create(userId, dto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update an existing address',
    description:
      'Partial update is supported: only send fields you want to modify.',
  })
  @ApiOkResponse({ description: 'Address updated' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAddressDto,
    @Req() req: Request,
  ) {
    const userId = this.getAuthUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Missing authenticated user id.');
    }
    return this.addressesService.update(id, userId, dto);
  }

  @Patch(':id/default')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Set address as default',
    description:
      'Sets this address as default and unsets all others for the user.',
  })
  @ApiOkResponse({ description: 'Address marked as default' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  async setDefault(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    const userId = this.getAuthUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Missing authenticated user id.');
    }
    return this.addressesService.setDefault(id, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete an address',
    description:
      'Cannot delete default address when other addresses exist, or addresses linked to orders.',
  })
  @ApiOkResponse({ description: 'Address deleted successfully' })
  @ApiNotFoundResponse({ description: 'Address not found' })
  @ApiUnprocessableEntityResponse({
    description: 'Address cannot be deleted due to business rules.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const userId = this.getAuthUserId(req);
    if (!userId) {
      throw new UnauthorizedException('Missing authenticated user id.');
    }
    return this.addressesService.remove(id, userId);
  }
}
