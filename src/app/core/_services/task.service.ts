import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { Task } from '../types/interfaces/task';
import { Comment } from '../types/interfaces/comment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  getTasksByStatus(status: string): Observable<Task[]> {
    return this.getTasks().pipe(
      map(tasks => tasks.filter(task => task.status === status))
    );
  }

  updateTaskStatus(taskId: string, newStatus: string): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${taskId}/status`, { status: newStatus });
  }
  
  generateUniqueId(): Observable<string> {
    return this.fetchExistingTaskIds().pipe(
      map(existingIds => {
        let newId: string;
        do {
          newId = this.generateRandomId();
        } while (existingIds.includes(newId));
        return newId;
      })
    );
  }

  generateUniqueCommentId(): Observable<string> {
    return this.fetchExistingComments().pipe(
      map(existingComments => {
        let newId: string;
        if (existingComments.length === 0) {
          newId = this.generateRandomId();
        } else {
          do {
            newId = this.generateRandomId();
          } while (existingComments.some(comment => comment.id === newId));
        }
        return newId;
      })
    );
  }

  private fetchExistingTaskIds(): Observable<string[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map(tasks => tasks.map(task => task.id))
    );
  }

  private fetchExistingComments(): Observable<Comment[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      map(tasks => tasks.reduce((comments, task) => comments.concat(task.comments), [] as Comment[]))
    );
  }

  generateRandomId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      switchMap((tasks) => {
        const userIds = [...new Set(tasks.map(task => task.user_id))];

        const requests = userIds.map(userId => {
          return this.authenticationService.getUserById(userId);
        });

        return forkJoin(requests).pipe(
          map((users: any[]) => {
            const userMap = new Map<string, string>();
            users.forEach(user => userMap.set(user.id, user.username));

            return tasks.map(task => ({
              ...task,
              username: userMap.get(task.user_id) || 'Unknown'
            }));
          })
        );
      })
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(
      switchMap((task) => {
        return this.authenticationService.getUserById(task.user_id).pipe(
          map((user) => ({
            ...task,
            username: user.username || 'Unknown',
          }))
        );
      })
    );
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteAttachment(task: Task): Observable<Task> {
    const updatedTask: Task = { ...task, attachment: "" };
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, updatedTask);
  }

  updateAttachment(task: Task, filename: string): Observable<Task> {
    const updatedTask: Task = { ...task, attachment: filename };
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, updatedTask);
  }
}
