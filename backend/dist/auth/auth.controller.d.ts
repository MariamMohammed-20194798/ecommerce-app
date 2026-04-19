import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly auth;
    private readonly config;
    constructor(auth: AuthService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        emailVerified: boolean;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
        };
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").$Enums.Role;
            emailVerified: boolean;
        };
    }>;
    logout(req: Request, res: Response): Promise<{
        ok: boolean;
    }>;
    googleAuth(): void;
    googleCallback(req: Request, res: Response): Promise<void>;
    private refreshCookieOptions;
    private setRefreshCookie;
    private clearRefreshCookie;
}
