export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    birthDate: string;
    sentEmails?: string[] | null;
}