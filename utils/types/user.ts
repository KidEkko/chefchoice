import { GetRoleString } from "@/serverConfig";

export interface User {
    id: number;
    username: string;
    role: string;
    password: string;
    email: string;
    isAdmin: boolean;
}

export interface UserAuthRow {
  user_id: number,
  username: string,
  password: string,
  is_admin: boolean,
  email: string,
}

export function UserAuthRowToUser(row: UserAuthRow): User {
  return {
    id: row.user_id,
    username: row.username,
    role: GetRoleString(row.is_admin),
    isAdmin: row.is_admin,
    email: row.email,
    password: row.password
  }
}