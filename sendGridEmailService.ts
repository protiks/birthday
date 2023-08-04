import sgMail from '@sendgrid/mail';
import { EmailService, MailOptions } from './emailService';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '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');

export class SendGridEmailService implements EmailService {
    async sendMail(mailOptions: MailOptions): Promise<void> {
        await sgMail.send(mailOptions);
    }
}
