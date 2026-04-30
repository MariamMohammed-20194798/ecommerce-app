"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../database/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const auth_utils_1 = require("./auth.utils");
let AuthService = class AuthService {
    prisma;
    jwt;
    mail;
    config;
    constructor(prisma, jwt, mail, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.mail = mail;
        this.config = config;
    }
    async sendOtp(dto) {
        if (dto.type === client_1.OtpType.LOGIN) {
            const user = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
        }
        else if (dto.type === client_1.OtpType.SIGNUP) {
            const user = await this.prisma.user.findUnique({
                where: { email: dto.email },
            });
            if (user) {
                throw new common_1.ConflictException('Email already registered');
            }
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        const existingOtp = await this.prisma.authOtp.findFirst({
            where: { email: dto.email, type: dto.type },
            orderBy: { createdAt: 'desc' },
        });
        if (existingOtp &&
            Date.now() - existingOtp.createdAt.getTime() < 60 * 1000) {
            throw new common_1.ConflictException('Please wait a minute before requesting a new OTP');
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
    async verifyOtp(dto) {
        const otpRecord = await this.prisma.authOtp.findFirst({
            where: { email: dto.email, type: dto.type },
        });
        if (!otpRecord) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        if (otpRecord.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('OTP expired');
        }
        if (otpRecord.attempts >= 5) {
            await this.prisma.authOtp.delete({ where: { id: otpRecord.id } });
            throw new common_1.UnauthorizedException('Too many failed attempts, please request a new OTP');
        }
        if (otpRecord.code !== dto.code) {
            await this.prisma.authOtp.update({
                where: { id: otpRecord.id },
                data: { attempts: { increment: 1 } },
            });
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        await this.prisma.authOtp.delete({ where: { id: otpRecord.id } });
        let user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (dto.type === client_1.OtpType.SIGNUP) {
            if (user) {
                throw new common_1.ConflictException('Email already registered');
            }
            user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    name: dto.name,
                    emailVerifiedAt: new Date(),
                },
            });
        }
        else if (dto.type === client_1.OtpType.LOGIN) {
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
        }
        return this.issueTokens(user);
    }
    async oauthLogin(profile) {
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
        }
        else {
            const updates = {};
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
    async rotateRefresh(rawRefresh) {
        if (!rawRefresh) {
            throw new common_1.UnauthorizedException('Missing refresh token');
        }
        const tokenHash = (0, auth_utils_1.hashOpaqueToken)(rawRefresh);
        const record = await this.prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
        if (!record ||
            record.revokedAt ||
            record.expiresAt.getTime() < Date.now()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        await this.prisma.refreshToken.update({
            where: { id: record.id },
            data: { revokedAt: new Date() },
        });
        return this.issueTokens(record.user);
    }
    async revokeRefresh(rawRefresh) {
        if (!rawRefresh) {
            return;
        }
        const tokenHash = (0, auth_utils_1.hashOpaqueToken)(rawRefresh);
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    signAccessToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const expiresIn = Number(this.config.get('JWT_ACCESS_EXPIRES_SECS', '900'));
        return this.jwt.sign(payload, { expiresIn });
    }
    async issueTokens(user) {
        const accessToken = this.signAccessToken(user);
        const rawRefresh = (0, auth_utils_1.generateOpaqueToken)();
        const refreshHash = (0, auth_utils_1.hashOpaqueToken)(rawRefresh);
        const expiresAt = new Date();
        const days = Number(this.config.get('REFRESH_TOKEN_DAYS', '30'));
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map