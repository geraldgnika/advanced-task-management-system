import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User } from '../types/interfaces/user';
import { UserRoles } from '../types/enums/authentication/user-roles';
import { UserPermissions } from '../types/enums/authentication/user-permissions';
import { RegisterPayload } from '../types/payloads/authentication/register-payload.interface';
import { LoginPayload } from '../types/payloads/authentication/login-payload.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUserSubject: BehaviorSubject<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  }

  generateUniqueId(): Observable<string> {
    return this.getUsers().pipe(
      map((users) => {
        let newId: string;
        do {
          newId = '_' + Math.random().toString(36).substring(2, 9);
        } while (this.isIdExists(users, newId));
        return newId;
      })
    );
  }

  private isIdExists(users: any[], id: string): boolean {
    return users.some((user) => user.id === id);
  }
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  checkIfExistsAlready(username: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
      map(users => users.length > 0),
      catchError(() => of(false))
    );
  }

  register(payload: RegisterPayload): Observable<User> {
    const { id, full_name, username, password, role } = payload;

    return this.checkIfExistsAlready(username).pipe(
      switchMap(userExists => {
        if (userExists) {
          return throwError(() => 'User already exists');
        } else {
          let permissions: { [key in UserPermissions]: boolean };

          if (role === UserRoles.ProjectManager) {
            permissions = {
              [UserPermissions.CanManageTasks]: true,
              [UserPermissions.CanViewInsights]: true
            };
          } else if (role === UserRoles.TeamLead) {
            permissions = {
              [UserPermissions.CanManageTasks]: true,
              [UserPermissions.CanViewInsights]: true
            };
          } else {
            permissions = {
              [UserPermissions.CanManageTasks]: true,
              [UserPermissions.CanViewInsights]: false
            };
          }

          const newUser: User = {
            id,
            full_name,
            username,
            password,
            role,
            permissions
          };
          return this.http.post<User>(this.apiUrl, newUser).pipe(
            switchMap((user: User) => {
              localStorage.setItem('currentUser', JSON.stringify(user));
              this.currentUserSubject.next(user);
              return of(user);
            }),
            catchError(() => throwError(() => 'Registration failed'))
          );
        }
      }),
      catchError(() => throwError(() => 'Registration failed'))
    );
  }

  checkCredentials(username: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
      map(users => {
        if (users.length === 1) {
          return users[0].password === password;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }

  login(payload: LoginPayload): Observable<User | null> {
    const { username, password } = payload;

    return this.checkCredentials(username, password).pipe(
      switchMap(valid => {
        if (valid) {
          return this.http.get<User[]>(`${this.apiUrl}?username=${username}`).pipe(
            map(users => {
              if (users.length === 1) {
                const user = users[0];
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
              }
              return null;
            }),
            catchError(() => of(null))
          );
        } else {
          return of(null);
        }
      }),
      catchError(() => of(null))
    );
  }

  getCurrentUserObservable(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  logout(): Observable<any> {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return of(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  getCurrentUser(): any {
    const userString = localStorage.getItem('currentUser');
    return userString ? JSON.parse(userString) : null;
  }

  isProjectManager(): boolean | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.role === UserRoles.ProjectManager;
  }
  
  isTeamLead(): boolean | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.role === UserRoles.TeamLead;
  }

  isDeveloper(): boolean | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser && currentUser.role === UserRoles.Developer;
  }

  hasPermission(permission: UserPermissions): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.permissions[permission] ?? false;
  }

  getUserById(user_id: string): Observable<{ user_id: string, username: string }> {
    return this.http.get<{ user_id: string, username: string }>(`${this.apiUrl}/${user_id}`);
  }
}
