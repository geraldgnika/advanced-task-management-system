import { UserPermissions } from "../enums/user-permissions";
import { UserRoles } from "../enums/user-roles";

export interface User {
  id: string;
  full_name: string;
  username: string;
  password: string;
  role: UserRoles;
  permissions: {
    [key in UserPermissions]: boolean;
  };
}
