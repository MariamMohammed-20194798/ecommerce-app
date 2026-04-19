import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly config;
    private readonly logger;
    private readonly resend;
    constructor(config: ConfigService);
    sendVerificationEmail(to: string, verifyUrl: string): Promise<void>;
}
