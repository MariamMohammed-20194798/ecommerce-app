import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { GoogleOAuthUser } from './types';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly mail;
    private readonly config;
    constructor(prisma: PrismaService, jwt: JwtService, mail: MailService, config: ConfigService);
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
        };
    }>;
    oauthLogin(profile: GoogleOAuthUser): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
        };
    }>;
    rotateRefresh(rawRefresh: string | undefined): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
        };
    }>;
    revokeRefresh(rawRefresh: string | undefined): Promise<void>;
    signAccessToken(user: Pick<User, 'id' | 'email' | 'role'>): string;
    private issueTokens;
}
