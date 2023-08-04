import { scheduleJob } from 'node-schedule';
import { getUsersWithBirthday } from './db_utils';
import { sendBirthdayEmail } from './emailService';
import { FakeEmailService } from './fakeEmailService';

export const job = () => scheduleJob('0 0 * * *', async () => {
    console.log('Scheduled job started');

    try {
        const currentDate = new Date();
        console.log('Current JOB TIME:', currentDate);

        const users = await getUsersWithBirthday(currentDate);

        console.log('JOB Users with birthdays:', users[0].firstName);

        const emailService = new FakeEmailService();
        await Promise.all(users.map(user => sendBirthdayEmail(user, currentDate, emailService)));

        console.log('Scheduled job completed');
    } catch (error) {
        console.error('Error in scheduled job:', error);
    }
});

job();
