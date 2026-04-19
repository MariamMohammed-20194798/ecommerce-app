"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../database/prisma.service");
const mail_service_1 = require("../mail/mail.service");
const auth_utils_1 = require("./auth.utils");
const EMAIL_VERIFY_HOURS = 48;
const BCRYPT_ROUNDS = 12;
let AuthService = class AuthService {
    prisma;
    jwt;
    mail;
    config;
    async verifyEmail(token) {
        const tokenHash = (0, auth_utils_1.hashOpaqueToken)(token);
        const record = await this.prisma.emailVerificationToken.findUnique({
            where: { tokenHash },
        });
        if (!record || record.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        await this.prisma.user.update({
            where: { id: record.userId },
            data: { emailVerifiedAt: new Date() },
        });
        await this.prisma.emailVerificationToken.delete({
            where: { id: record.id },
        });
        return { message: 'Email verified successfully' };
    }
    constructor(prisma, jwt, mail, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.mail = mail;
        this.config = config;
    }
    async register(email, password) {
        const existing = await this.prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        const user = await this.prisma.user.create({
            data: { email, passwordHash },
        });
        const rawToken = (0, auth_utils_1.generateOpaqueToken)();
        console.log(rawToken);
        const tokenHash = (0, auth_utils_1.hashOpaqueToken)(rawToken);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + EMAIL_VERIFY_HOURS);
        await this.prisma.emailVerificationToken.deleteMany({
            where: { userId: user.id },
        });
        await this.prisma.emailVerificationToken.create({
            data: { userId: user.id, tokenHash, expiresAt },
        });
        const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
        const verifyUrl = `${frontendUrl}/verify-email?token=${rawToken}`;
        await this.mail.sendVerificationEmail(user.email, verifyUrl);
        return {
            id: user.id,
            email: user.email,
            emailVerified: !!user.emailVerifiedAt,
        };
    }
    async login(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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