import { User } from "../../../core/types/interfaces/user";

export interface AuthenticationState {
  currentAuthentication: User | any;
  loading: boolean;
  error: string | null;
}

export const initialAuthenticationState: AuthenticationState = {
  currentAuthentication: null,
  loading: false,
  error: null,
};
