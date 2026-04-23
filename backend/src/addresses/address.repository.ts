import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
    });
  }

  async findOneByIdForUser(id: string, userId: string) {
    return this.prisma.address.findFirst({
      where: { id, userId },
    });
  }

  async countByUser(userId: string) {
    return this.prisma.address.count({ where: { userId } });
  }

  async unsetDefaultForUser(userId: string) {
    return this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  async create(data: {
    userId: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }) {
    return this.prisma.address.create({
      data: {
        ...data,
        line2: data.line2 ?? null,
        state: data.state ?? null,
      },
    });
  }

  async update(
    id: string,
    data: Partial<{
      line1: string;
      line2: string | null;
      city: string;
      state: string | null;
      postalCode: string;
      country: string;
      isDefault: boolean;
    }>,
  ) {
    return this.prisma.address.update({
      where: { id },
      data,
    });
  }

  async countOtherAddresses(userId: string, id: string) {
    return this.prisma.address.count({
      where: { userId, id: { not: id } },
    });
  }

  async countOrdersUsingAddress(id: string) {
    return this.prisma.order.count({
      where: { addressId: id },
    });
  }

  async remove(id: string) {
    return this.prisma.address.delete({ where: { id } });
  }
}
