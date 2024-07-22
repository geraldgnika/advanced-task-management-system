import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskRoutingModule } from './task-routing.module';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskUpdateComponent } from './task-update/task-update.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskOpenComponent } from './task-open/task-open.component';



@NgModule({
  declarations: [
    TaskCreateComponent,
    TaskUpdateComponent,
    TaskListComponent,
    TaskOpenComponent
  ],
  imports: [
    CommonModule,
    TaskRoutingModule
  ]
})
export class TaskModule { }
