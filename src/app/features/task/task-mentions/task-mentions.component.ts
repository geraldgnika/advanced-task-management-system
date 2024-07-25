import { Component, OnInit } from '@angular/core';
import { Task } from '../../../core/types/interfaces/task';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import * as TaskActions from '../../../shared/_store/task/task.actions';
import * as TaskSelectors from '../../../shared/_store/task/task.selectors';
import { User } from '../../../core/types/interfaces/user';
import { AppState } from '../../../shared/_store/_common/app.state';
import * as AuthenticationActions from '../../../shared/_store/authentication/authentication.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-task-mentions',
  templateUrl: './task-mentions.component.html',
  styleUrls: ['./task-mentions.component.css']
})
export class TaskMentionsComponent implements OnInit {
  mentionedComments: { commentBody: string, username: string, taskTitle: string, taskId: string }[] = [];
  currentUser$: Observable<User | null> = of();
  user!: User;
  tasks$!: Observable<Task[]>;

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private _location: Location
  ) {
    this.currentUser$ = this.store.select('authentication', 'user');
    	this.store.dispatch(AuthenticationActions.loadCurrentUser());
  }

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
    this.tasks$ = this.store.select(TaskSelectors.selectAllTasks);

    this.currentUser$!.subscribe((user) => {
			if (!user) {
				console.error('User not found');
				return;
			}

			this.user = user;
		});

    this.tasks$.subscribe((tasks: Task[]) => {
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
    });
  }

  openTask(taskId: string) : void {
    this.router.navigate(['task/open/', taskId]);
  }

  goBack() {
    this._location.back();
  }
}
