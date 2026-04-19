import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null;

  constructor(private readonly config: ConfigService) {
    const key = this.config.get<string>('RESEND_API_KEY');
    this.resend = key ? new Resend(key) : null;
  }

  async sendVerificationEmail(to: string, verifyUrl: string): Promise<void> {
    const from = this.config.get<string>('EMAIL_FROM', 'onboarding@resend.dev');
    if (!this.resend) {
      this.logger.warn(
        `RESEND_API_KEY not set; skipping verification email to ${to}. URL: ${verifyUrl}`,
      );
      return;
    }
    await this.resend.emails.send({
      from,
      to,
      subject: 'Verify your email',
      html: `<p>Click to verify your account:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });
  }
}
