import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskRoutingModule } from './task-routing.module';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskUpdateComponent } from './task-update/task-update.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskOpenComponent } from './task-open/task-open.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CapitalizeFirstLetterPipe } from '../../shared/pipes/capitalize-first-letter.pipe';
import { FormatUsernamesPipe } from '../../shared/pipes/format-usernames.pipe';
import { FormatUsernamePipe } from '../../shared/pipes/format-username.pipe';

@NgModule({
  declarations: [
    TaskCreateComponent,
    TaskUpdateComponent,
    TaskListComponent,
    TaskOpenComponent,
    CapitalizeFirstLetterPipe,
    FormatUsernamesPipe,
    FormatUsernamePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TaskRoutingModule
  ]
})
export class TaskModule { }
