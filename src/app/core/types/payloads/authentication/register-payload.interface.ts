import { UserRoles } from "../../enums/user-roles";

export interface RegisterPayload {
  id: string;
  full_name: string;
  username: string;
  password: string;
  role: UserRoles;
}