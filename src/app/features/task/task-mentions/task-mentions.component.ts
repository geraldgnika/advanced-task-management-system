import { Component, OnInit } from '@angular/core';
import { Task } from '../../../core/types/interfaces/task';
import { AuthenticationService } from '../../../core/_services/authentication.service';
import { TaskService } from '../../../core/_services/task.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-task-mentions',
  templateUrl: './task-mentions.component.html',
  styleUrls: ['./task-mentions.component.css']
})
export class TaskMentionsComponent implements OnInit {
  mentionedComments: { commentBody: string, username: string, taskTitle: string, taskId: string }[] = [];
  currentUser: string;

  constructor(
    private authenticationService: AuthenticationService,
    private taskService: TaskService,
    private router: Router,
    private _location: Location
  ) {
    this.currentUser = this.authenticationService.getCurrentUser().username;
  }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      tasks.forEach(task => {
        task.comments.forEach(comment => {
          if (comment.body.includes(`@${this.currentUser}`)) {
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
