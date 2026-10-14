// TODO: the uploaded user.ts was empty. Replace this placeholder with the real
// user shape (e.g. id, username, email, ...).

export class User {
    id: number;
    username: string;
    role: string;

    public constructor(id: number, username: string, role: string) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

}   