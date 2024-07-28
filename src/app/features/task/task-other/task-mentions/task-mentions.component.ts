import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';
import { User } from '../../../../core/types/interfaces/user';
import { AppState } from '../../../../shared/_store/_common/app.state';
import * as AuthenticationActions from '../../../../shared/_store/authentication/authentication.actions';
import * as TaskActions from '../../../../shared/_store/task/task.actions';
import * as TaskSelectors from '../../../../shared/_store/task/task.selectors';

@Component({
  selector: 'app-task-mentions',
  templateUrl: './task-mentions.component.html',
  styleUrls: ['./task-mentions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskMentionsComponent implements OnInit {
  mentionedComments$:
    | Observable<
        {
          commentBody: string;
          username: string;
          taskTitle: string;
          taskId: string;
        }[]
      >
    | undefined;
  currentUser$: Observable<User> = of();

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.store.select('authentication', 'user');
    this.store.dispatch(AuthenticationActions.loadCurrentUser());

    this.mentionedComments$ = this.store
      .select(TaskSelectors.selectTaskMentions)
      .pipe(map((mentions) => mentions || []));

    this.currentUser$.subscribe((user) => {
      if (user) {
        this.store.dispatch(
          TaskActions.loadTasksWithMentions({ username: user.username })
        );
      }
    });
  }

  openTask(taskId: string): void {
    this.router.navigate(['task/open/', taskId]);
  }

  goBack(): void {
    this._location.back();
  }
}
