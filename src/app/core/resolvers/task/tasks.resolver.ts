import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TaskService } from '../../../core/_services/task.service';
import { Task } from '../../types/interfaces/task';
import { map } from 'rxjs';

export const tasksResolver: ResolveFn<Task[] | null | any> = (_route, _state) => {
  inject(TaskService).getTasks().pipe(
    map(tasks => {
      if (tasks && tasks.length > 0) {
        return tasks;
      }
    
      return null;
    })
  );
};
