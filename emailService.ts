import { updateUserSentEmails } from "./db_utils";
import { User } from "./User";

export interface EmailService {
    sendMail(mailOptions: MailOptions): Promise<void>;
}

export interface MailOptions {
    to: string;
    from: string;
    subject: string;
    text: string;
}

export async function sendBirthdayEmail(user: User, currentDate: Date, emailService: EmailService): Promise<void> {
    const { email, firstName, sentEmails } = user;

    if (sentEmails && sentEmails.some(sentEmail => sentEmail === email)) {
        return;
    }

    const mailOptions: MailOptions = {
        to: email,
        from: 'email@challenge.com',
        subject: `Happy Happy, ${firstName}!`,
        text: `Dear ${firstName}, Happy birthday! Today is ${currentDate.toISOString()}.`,
    };

    await emailService.sendMail(mailOptions);

    if (!user.sentEmails) {
        user.sentEmails = [];
    }
    user.sentEmails.push(email);

    await updateUserSentEmails(user);
}








