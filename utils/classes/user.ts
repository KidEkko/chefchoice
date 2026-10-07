// TODO: the uploaded user.ts was empty. Replace this placeholder with the real
// user shape (e.g. id, username, email, ...).

export class User {
    id: number;
    username: string;
    role: number;

    public constructor(id: number, username: string, role: number) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

}   