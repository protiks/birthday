import { v4 as uuid } from 'uuid';
import Database from './database';
import { addUser, getAllUsers, getUsersWithBirthday } from './db_utils'; // Import the function to add a user
import { FakeEmailService } from './fakeEmailService';
import { job } from './schedule_job';

describe('Scheduled Birthday Email Job', () => {
    const emailService = new FakeEmailService();
    afterAll(() => {
        Database.getInstance().reset()

    })

    it('should send an email to a user with a birthday', async () => {
        const user = {
            id: uuid(),
            firstName: 'Fake',
            lastName: 'User',
            email: 'test@example.com',
            birthDate: '1988-03-17',
        };

        await addUser(user);

        const birthDate = new Date(user.birthDate);
        birthDate.setUTCHours(0, 0, 0, 0);
        const u = await getAllUsers()

        jest.useFakeTimers();
        const currentTime = new Date();
        console.log('Current REAL Time:', currentTime);
        jest.setSystemTime(new Date('2023-03-17'));
        console.log('fakeTime:', new Date())
        jest.advanceTimersToNextTimer();
        job()
        jest.advanceTimersToNextTimer();
        expect(emailService.sentEmails.length).toBe(1);
        jest.advanceTimersToNextTimer();

        jest.useRealTimers();
    });
});
