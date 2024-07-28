import { UserRoles } from '../../enums/authentication/user-roles';

export interface RegisterPayload {
  id: string;
  full_name: string;
  username: string;
  password: string;
  role: UserRoles;
}
