import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './task-read/task-list/task-list.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskUpdateComponent } from './task-update/task-update.component';
import { TaskOpenComponent } from './task-read/task-open/task-open.component';
import { tasksResolver } from '../../core/resolvers/task/tasks.resolver';
import { taskResolver } from '../../core/resolvers/task/task.resolver';
import { TaskMentionsComponent } from './task-other/task-mentions/task-mentions.component';

const routes: Routes = [
  { path: 'list', component: TaskListComponent, title: 'Task List', resolve: { tasks: tasksResolver } },
  { path: 'create', component: TaskCreateComponent, title: 'Add Task' },
  { path: 'mentions', component: TaskMentionsComponent, title: 'Mentions' },
  { path: 'update/:id', component: TaskUpdateComponent, title: 'Update Task', resolve: { task: taskResolver } },
  { path: 'open/:id', component: TaskOpenComponent, title: 'View Task', resolve: { task: taskResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
