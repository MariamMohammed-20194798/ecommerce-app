import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User, OtpType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { AccessJwtPayload } from './strategies/jwt.strategy';
import { GoogleOAuthUser } from './types';
import { generateOpaqueToken, hashOpaqueToken } from './auth.utils';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    if (dto.type === OtpType.LOGIN) {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
    } else if (dto.type === OtpType.SIGNUP) {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (user) {
        throw new ConflictException('Email already registered');
      }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const existingOtp = await this.prisma.authOtp.findFirst({
      where: { email: dto.email, type: dto.type },
      orderBy: { createdAt: 'desc' },
    });

    if (
      existingOtp &&
      Date.now() - existingOtp.createdAt.getTime() < 60 * 1000
    ) {
      throw new ConflictException(
        'Please wait a minute before requesting a new OTP',
      );
    }

    await this.prisma.authOtp.deleteMany({
      where: { email: dto.email, type: dto.type },
    });

    await this.prisma.authOtp.create({
      data: {
        email: dto.email,
        code,
        type: dto.type,
        expiresAt,
      },
    });

    await this.mail.sendOtpEmail(dto.email, code);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.prisma.authOtp.findFirst({
      where: { email: dto.email, type: dto.type },
    });

    if (!otpRecord) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }

    if (otpRecord.attempts >= 5) {
      await this.prisma.authOtp.delete({ where: { id: otpRecord.id } });
      throw new UnauthorizedException(
        'Too many failed attempts, please request a new OTP',
      );
    }

    if (otpRecord.code !== dto.code) {
      await this.prisma.authOtp.update({
        where: { id: otpRecord.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Invalid OTP');
    }

    await this.prisma.authOtp.delete({ where: { id: otpRecord.id } });

    let user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (dto.type === OtpType.SIGNUP) {
      if (user) {
        throw new ConflictException('Email already registered');
      }
      user = await this.prisma.user.create({
        data: {
          email: dto.email,
          name: dto.name,
          emailVerifiedAt: new Date(),
        },
      });
    } else if (dto.type === OtpType.LOGIN) {
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
    }

    return this.issueTokens(user!);
  }

  async oauthLogin(profile: GoogleOAuthUser) {
    let user = await this.prisma.user.findFirst({
      where: { OR: [{ googleId: profile.googleId }, { email: profile.email }] },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: profile.email,
          googleId: profile.googleId,
          emailVerifiedAt: new Date(),
        },
      });
    } else {
      const updates: {
        googleId?: string;
        emailVerifiedAt?: Date;
      } = {};
      if (!user.googleId) {
        updates.googleId = profile.googleId;
      }
      if (!user.emailVerifiedAt) {
        updates.emailVerifiedAt = new Date();
      }
      if (Object.keys(updates).length > 0) {
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: updates,
        });
      }
    }

    return this.issueTokens(user);
  }

  async rotateRefresh(rawRefresh: string | undefined) {
    if (!rawRefresh) {
      throw new UnauthorizedException('Missing refresh token');
    }
    const tokenHash = hashOpaqueToken(rawRefresh);
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
    if (
      !record ||
      record.revokedAt ||
      record.expiresAt.getTime() < Date.now()
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(record.user);
  }

  async revokeRefresh(rawRefresh: string | undefined) {
    if (!rawRefresh) {
      return;
    }
    const tokenHash = hashOpaqueToken(rawRefresh);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  signAccessToken(user: Pick<User, 'id' | 'email' | 'role'>): string {
    const payload: AccessJwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const expiresIn = Number(
      this.config.get<string>('JWT_ACCESS_EXPIRES_SECS', '900'),
    );
    return this.jwt.sign(payload, { expiresIn });
  }

  private async issueTokens(user: User) {
    const accessToken = this.signAccessToken(user);
    const rawRefresh = generateOpaqueToken();
    const refreshHash = hashOpaqueToken(rawRefresh);
    const expiresAt = new Date();
    const days = Number(this.config.get<string>('REFRESH_TOKEN_DAYS', '30'));
    expiresAt.setDate(expiresAt.getDate() + days);

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: refreshHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefresh,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: !!user.emailVerifiedAt,
      },
    };
  }
}
