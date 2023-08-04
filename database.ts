import sqlite3 from 'sqlite3';

class Database {
    private static instance: Database;
    private db: sqlite3.Database;

    private constructor() {
        this.db = new sqlite3.Database('data_base.db');
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public getDb(): sqlite3.Database {
        return this.db;
    }
    public async reset(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM users', (error) => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
    }
}

export default Database;

