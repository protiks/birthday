import { EmailService } from "./emailService";

export class FakeEmailService implements EmailService {
  sentEmails: { recipient: string; content: string }[] = [];

  async sendMail(mailOptions: any): Promise<void> {
    this.sentEmails.push({ recipient: mailOptions.to, content: mailOptions.text });
  }
}
