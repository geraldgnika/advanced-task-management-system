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
import { TaskItemListComponent } from './task-item/task-item-list/task-item-list.component';
import { TaskItemGridComponent } from './task-item/task-item-grid/task-item-grid.component';
import { TaskItemCalendarComponent } from './task-item/task-item-calendar/task-item-calendar.component';
import { TaskItemBoardComponent } from './task-item/task-item-board/task-item-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TaskMentionsComponent } from './task-mentions/task-mentions.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateEnumPipe } from '../../shared/pipes/translate-enum.pipe';

@NgModule({
  declarations: [
    TaskCreateComponent,
    TaskUpdateComponent,
    TaskListComponent,
    TaskOpenComponent,
    CapitalizeFirstLetterPipe,
    FormatUsernamesPipe,
    FormatUsernamePipe,
    TaskItemListComponent,
    TaskItemGridComponent,
    TaskItemCalendarComponent,
    TranslateEnumPipe,
    TaskItemBoardComponent,
    TaskMentionsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    FormsModule,
    TaskRoutingModule,
    DragDropModule
  ],
  exports: [
    TaskListComponent
  ]
})
export class TaskModule { }
