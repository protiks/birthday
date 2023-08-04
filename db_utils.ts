import Database from './database';
import { User } from './User';

const db_instance = Database.getInstance()
const db = db_instance.getDb();

export function initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(
            'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, firstName TEXT, lastName TEXT, email TEXT, birthDate TEXT)',
            error => {
                if (error) reject(error);
                resolve();
            }
        );
    });
}
function isValidDateFormat(dateStr: string): boolean {
    const date = new Date(dateStr);

    return date instanceof Date && !isNaN(date.getTime());
}


export function addUser(user: User): Promise<User> {
    if (!isValidDateFormat(user.birthDate)) {
        return Promise.reject(TypeError('Invalid birthDate format'));
    }
    const sentEmails = user.sentEmails ? JSON.stringify(user.sentEmails) : null;
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO users (id, firstName, lastName, email, birthDate, sentEmails) VALUES (?, ?, ?, ?, ?, ?)',
            [user.id, user.firstName, user.lastName, user.email, user.birthDate, sentEmails],
            error => {
                if (error) {
                    reject(error);
                } else {
                    resolve(user);
                }
            }
        );
    });
}


export function getUsersWithBirthday(date: Date): Promise<User[]> {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const birthdateQuery = `${month}-${day}`;


    return new Promise((resolve, reject) => {
        db.all(
            'SELECT * FROM users WHERE strftime("%m-%d", birthDate) = ?',
            ['03-15'],
            (error, rows) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(rows as User[]);
                }
            }
        );
    });
}

export function getAllUsers(): Promise<User[]> {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM users', (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows as User[]);
            }
        });
    });
}
export async function updateUserSentEmails(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE users SET sentEmails = ? WHERE id = ?',
            [user.sentEmails?.join(','), user.id],
            error => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            }
        );
    });
}












