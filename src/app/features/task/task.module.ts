import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CapitalizeFirstLetterPipe } from '../../shared/pipes/capitalize-first-letter.pipe';
import { FormatUsernamePipe } from '../../shared/pipes/format-username.pipe';
import { FormatUsernamesPipe } from '../../shared/pipes/format-usernames.pipe';
import { HighlightMentionsPipe } from '../../shared/pipes/highlight-mentions.pipe';
import { TranslateEnumPipe } from '../../shared/pipes/translate-enum.pipe';
import { TaskCreateComponent } from './task-create/task-create.component';
import { TaskDeleteComponent } from './task-delete/task-delete.component';
import { TaskMentionsComponent } from './task-other/task-mentions/task-mentions.component';
import { TaskItemBoardComponent } from './task-read/task-list/task-item/task-item-board/task-item-board.component';
import { TaskItemCalendarComponent } from './task-read/task-list/task-item/task-item-calendar/task-item-calendar.component';
import { TaskItemGridComponent } from './task-read/task-list/task-item/task-item-grid/task-item-grid.component';
import { TaskItemListComponent } from './task-read/task-list/task-item/task-item-list/task-item-list.component';
import { TaskListComponent } from './task-read/task-list/task-list.component';
import { TaskOpenComponent } from './task-read/task-open/task-open.component';
import { TaskRoutingModule } from './task-routing.module';
import { TaskUpdateComponent } from './task-update/task-update.component';

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
    TaskMentionsComponent,
    HighlightMentionsPipe,
    TaskDeleteComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    FormsModule,
    TaskRoutingModule,
    DragDropModule,
  ],
  exports: [TaskListComponent],
})
export class TaskModule {}
