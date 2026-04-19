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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailService = MailService_1 = class MailService {
    config;
    logger = new common_1.Logger(MailService_1.name);
    resend;
    constructor(config) {
        this.config = config;
        const key = this.config.get('RESEND_API_KEY');
        this.resend = key ? new resend_1.Resend(key) : null;
    }
    async sendVerificationEmail(to, verifyUrl) {
        const from = this.config.get('EMAIL_FROM', 'noreply@ecommerce.com');
        this.logger.log(`Verification email URL for ${to}: ${verifyUrl}`);
        if (!this.resend) {
            this.logger.warn(`RESEND_API_KEY not set; skipping verification email to ${to}. URL: ${verifyUrl}`);
            return;
        }
        await this.resend.emails.send({
            from,
            to,
            subject: 'Verify your email',
            html: `<p>Click to verify your account:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
        });
        this.logger.log(`Verification email sent to ${to}`);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map