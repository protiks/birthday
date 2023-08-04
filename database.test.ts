import { v4 as uuid } from 'uuid';
import Database from './database';
import { addUser, getAllUsers, getUsersWithBirthday } from './db_utils';
import { sendBirthdayEmail } from './emailService';
import { FakeEmailService } from './fakeEmailService';
import { seed } from './seed';
import { User } from './User';


const databaseInstance = Database.getInstance();
const db = databaseInstance.getDb();

describe('Database Utility Functions', () => {
    beforeEach(async () => {
    });

    afterEach(async () => {
        await databaseInstance.reset()
    });

    it('should initialize the database with the users table', async () => {
        expect(db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")).toBeTruthy();
    })

    it('should reject incorrect date format', async () => {
        const invalidUser: User = {
            id: uuid(),
            firstName: 'Invalid',
            lastName: 'User',
            email: 'invalid@example.com',
            birthDate: '2021-15-35',
        };

        try {
            await addUser(invalidUser);
        } catch (error) {
            const errorMessage = (error as Error).message;
            expect(errorMessage).toBe('Invalid birthDate format');
        }
    });

    it('should add a user to the database and resolve with the added user object', async () => {
        const user: User = {
            id: uuid(),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            birthDate: ('1988-03-17'),
            sentEmails: null,
        };

        const result = await addUser(user);

        const fetchedUser = await new Promise<User>((resolve, reject) => {
            db.get("SELECT * FROM users WHERE id = ?", [user.id], (error, row: User) => {
                if (error) reject(error);
                resolve(row);
            });
        });

        expect(fetchedUser).toEqual(user);

    });

    it('should add a user to the database', async () => {
        const user: User = {
            id: uuid(),
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            birthDate: ('1988-03-17'),
            sentEmails: null
        };

        await addUser(user);

        const result = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM users WHERE id = ?", [user.id], (error, row) => {
                if (error) reject(error);
                resolve(row);
            });
        });


        expect(result).toEqual(user);
    });

    it('should retrieve users with birthdays on the given date', async () => {
        const users: User[] = [
            {
                id: uuid(),
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice@example.com',
                birthDate: '1992-03-15',
                sentEmails: null
            },
            {
                id: uuid(),
                firstName: 'Bob',
                lastName: 'Anderson',
                email: 'bob@example.com',
                birthDate: '1987-03-15',
                sentEmails: null,
            },
        ];
        addUser(users[0])
        addUser(users[1])

        const result = await getUsersWithBirthday(new Date('1992-03-15'));

        expect(result).toEqual(users);
    });

    it('should read from data base and send an email to user with birthday', async () => {
        await seed()
        const users: User[] = await getAllUsers()
        let currentDate = new Date()
        let emailService = new FakeEmailService()
        await Promise.all(users.map(user => sendBirthdayEmail(user, currentDate, emailService)));
        expect(emailService.sentEmails.length).toBe(users.length);
        for (let i = 0; i < users.length; i++) {
            expect(emailService.sentEmails[i].recipient).toBe(users[i].email);
        }
    })


});

