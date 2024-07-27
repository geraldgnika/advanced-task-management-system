import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../../../core/types/interfaces/task';
import { User } from '../../../core/types/interfaces/user';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import * as TaskSelectors from '../../../shared/_store/task/task.selectors';
import * as AuthenticationActions from '../../../shared/_store/authentication/authentication.actions';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-task-mentions',
  templateUrl: './task-mentions.component.html',
  styleUrls: ['./task-mentions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskMentionsComponent implements OnInit {
  mentionedComments: { commentBody: string, username: string, taskTitle: string, taskId: string }[] = [];
  user!: User;
  tasks$!: Observable<Task[]>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AuthenticationActions.loadCurrentUser());
    this.store.dispatch(TaskActions.loadTasks());

    this.store.select(state => state.authentication.user).subscribe(user => {
      if (!user) {
        console.error('User not found');
        return;
      }
      this.user = user;
    });

    this.tasks$ = this.store.select(TaskSelectors.selectAllTasks);
    this.tasks$.subscribe(tasks => {
      if (tasks && this.user) {
        this.filterMentionedComments(tasks);
      }
    });
  }

  filterMentionedComments(tasks: Task[]): void {
    this.mentionedComments = [];
    tasks.forEach(task => {
      task.comments.forEach(comment => {
        if (comment.body.includes(`@${this.user.username}`)) {
          this.mentionedComments.push({
            commentBody: comment.body,
            username: comment.username,
            taskTitle: task.title,
            taskId: task.id
          });
        }
      });
    });
  }

  openTask(taskId: string): void {
    this.router.navigate(['task/open/', taskId]);
  }

  goBack(): void {
    this._location.back();
  }
}