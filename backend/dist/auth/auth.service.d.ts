import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { MailService } from '../mail/mail.service';
import { GoogleOAuthUser } from './types';
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly mail;
    private readonly config;
    verifyEmail(token: string): Promise<{
        message: string;
    }>;
    constructor(prisma: PrismaService, jwt: JwtService, mail: MailService, config: ConfigService);
    register(email: string, password: string): Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
    }>;
    login(email: string, password: string): Promise<{
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
