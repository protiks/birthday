import { getUsersWithBirthday, addUser, initializeDatabase } from './db_utils';

export const seed = async () => {
    try {
        const currentDate = new Date();
        const users = await getUsersWithBirthday(currentDate);

        if (users.length > 0) {
            return;
        }

        await initializeDatabase();

        const usersToAdd = [
            {
                id: '1982uihbf',
                firstName: 'Protik',
                lastName: 'Sarkar',
                email: 'justhug@duck.com',
                birthDate: '1990-08-04',
                sentEmails: null,
            },
            {
                id: '2a3b4c5d',
                firstName: 'Alice',
                lastName: 'Johnson',
                email: 'alice@example.com',
                birthDate: '1992-03-15',
                sentEmails: null,
            },
            {
                id: '6e7f8g9h',
                firstName: 'Bob',
                lastName: 'Anderson',
                email: 'bob@example.com',
                birthDate: '1987-03-15',
                sentEmails: null,
            },
            {
                id: '1a2b3c4d',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                birthDate: '1995-01-15',
                sentEmails: null,
            },
            {
                id: '5e6f7g8h',
                firstName: 'Michael',
                lastName: 'Brown',
                email: 'michael@example.com',
                birthDate: '1985-10-20',
                sentEmails: null,
            },
        ];

        for (const user of usersToAdd) {
            await addUser(user);
        }

    } catch (error) {
    }
}

seed();
