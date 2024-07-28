import { User } from '../../../core/types/interfaces/user';

export interface AuthenticationState {
  users: User[];
  user: User | any;
  loading: boolean;
  error: string | null;
}

export const initialAuthenticationState: AuthenticationState = {
  users: [],
  user: null,
  loading: false,
  error: null,
};
