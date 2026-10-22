import { GetRoleString } from "@/serverConfig"
import { User } from "@/utils/types/user"
import "server-only"

export interface UserAuthRow {
  user_id: number,
  username: string,
  password: string,
  is_admin: boolean
}

export function UserAuthRowToUser(row: UserAuthRow): User {
  return {
    id: row.user_id,
    username: row.username,
    role: GetRoleString(row.is_admin)
  }
}