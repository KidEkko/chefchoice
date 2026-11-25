export interface User {
    avatar?: string;
    id: number;
    username: string;
    password?: string;
    email: string;
}

export interface UserAuthRow {
  user_id: number,
  username: string,
  password: string,
  email: string,
}

export function UserAuthRowToUser(row: UserAuthRow): User {
  return {
    id: row.user_id,
    username: row.username,
    email: row.email,
    password: row.password
  }
}