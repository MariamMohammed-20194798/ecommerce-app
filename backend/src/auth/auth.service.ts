import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { AccessJwtPayload } from './strategies/jwt.strategy';
import { GoogleOAuthUser } from './types';
import { generateOpaqueToken, hashOpaqueToken } from './auth.utils';

const EMAIL_VERIFY_HOURS = 48;
const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
    });

    const rawToken = generateOpaqueToken();
    console.log(rawToken);
    const tokenHash = hashOpaqueToken(rawToken);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + EMAIL_VERIFY_HOURS);

    await this.prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });
    await this.prisma.emailVerificationToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    const frontendUrl = this.config.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
    const verifyUrl = `${frontendUrl}/verify-email?token=${rawToken}`;
    await this.mail.sendVerificationEmail(user.email, verifyUrl);

    return {
      id: user.id,
      email: user.email,
      emailVerified: !!user.emailVerifiedAt,
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.issueTokens(user);
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
