import { FakeEmailService } from './fakeEmailService';
import { sendBirthdayEmail } from './emailService';
import { User } from './User';
import { v4 as uuid } from 'uuid';
import Database from './database';
import { seed } from './seed';

const CONTROL_CURRENT_FAKE_TIME = '2023-08-01T23:00:00.000Z'
const databaseInstance = Database.getInstance();
const db = databaseInstance.getDb();
describe('Email Service', () => {
    beforeEach(async () => {
        await seed()
    });

    afterEach(async () => {
        await databaseInstance.reset()
    });

    it('should send an email to a single user with a birthday today', async () => {

        const user: User = {
            id: uuid(),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            birthDate: ('1990-08-01'),
        };

        const customCurrentDate = new Date(CONTROL_CURRENT_FAKE_TIME);
        jest.useFakeTimers();

        const emailService = new FakeEmailService();


        await sendBirthdayEmail(user, customCurrentDate, emailService);


        expect(emailService.sentEmails.length).toBe(1);
        expect(emailService.sentEmails[0].recipient).toBe(user.email);
        expect(emailService.sentEmails[0].content).toContain(user.firstName);
        expect(emailService.sentEmails[0].content).toContain(customCurrentDate.toISOString());

        jest.useRealTimers();
    });

    it('should send emails to multiple users with birthdays today', async () => {

        const users: User[] = [
            {
                id: uuid(),
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice@example.com',
                birthDate: ('1992-03-15'),
            },
            {
                id: uuid(),
                firstName: 'Bob',
                lastName: 'Anderson',
                email: 'bob@example.com',
                birthDate: ('1987-03-15'),
            },
        ];

        const customCurrentDate = new Date('2023-03-15T00:00:00.000Z');
        jest.useFakeTimers();
        const emailService = new FakeEmailService();


        for (const user of users) {
            await sendBirthdayEmail(user, customCurrentDate, emailService);
        }


        expect(emailService.sentEmails.length).toBe(2); // Two emails should be recorded for each user with a birthday today
        expect(emailService.sentEmails[0].recipient).toBe(users[0].email);
        expect(emailService.sentEmails[1].recipient).toBe(users[1].email);
        expect(emailService.sentEmails[0].content).toContain(users[0].firstName);
        expect(emailService.sentEmails[1].content).toContain(users[1].firstName);
        expect(emailService.sentEmails[0].content).toContain(customCurrentDate.toISOString());
        expect(emailService.sentEmails[1].content).toContain(customCurrentDate.toISOString());

        jest.useRealTimers();
    });

    it('should record sent email content and recipient', async () => {

        const user: User = {
            id: uuid(),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            birthDate: ('1990-08-01'),
        };


        const customCurrentDate = new Date(CONTROL_CURRENT_FAKE_TIME);
        jest.useFakeTimers();

        const emailService = new FakeEmailService();

        await sendBirthdayEmail(user, customCurrentDate, emailService);

        expect(emailService.sentEmails.length).toBe(1);
        expect(emailService.sentEmails[0].recipient).toBe(user.email);
        expect(emailService.sentEmails[0].content).toContain(user.firstName);
        expect(emailService.sentEmails[0].content).toContain(customCurrentDate.toISOString());

        jest.useRealTimers();
    });

    it('should be idempotent', async () => {
        const user: User = {
            id: uuid(),
            firstName: 'User4',
            lastName: 'LastName4',
            email: 'user4@example.com',
            birthDate: ('2000-08-01'),
        };

        const customCurrentDate = new Date(CONTROL_CURRENT_FAKE_TIME);
        jest.useFakeTimers();

        const emailService = new FakeEmailService();

        await sendBirthdayEmail(user, customCurrentDate, emailService);
        await sendBirthdayEmail(user, customCurrentDate, emailService);

        expect(emailService.sentEmails.length).toBe(1);

        jest.useRealTimers();
    });

    it('should not send an email to a user who has already been sent one', async () => {

        const user: User = {
            id: uuid(),
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane@example.com',
            birthDate: '1995-01-15',
            sentEmails: ['jane@example.com'],
        };

        const customCurrentDate = new Date(CONTROL_CURRENT_FAKE_TIME);
        jest.useFakeTimers();

        const emailService = new FakeEmailService();

        await sendBirthdayEmail(user, customCurrentDate, emailService);

        expect(emailService.sentEmails.length).toBe(0);

        jest.useRealTimers();
    });

})
