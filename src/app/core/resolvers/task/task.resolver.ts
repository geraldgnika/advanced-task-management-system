import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { TaskService } from '../../_services/task/task.service';
import { of } from 'rxjs';
import { Task } from '../../types/interfaces/task';

export const taskResolver: ResolveFn<Task | null> = (_route, _state) => {
  const id = _route.paramMap.get('id');

  if (!id) {
    inject(Router).navigate(['/task/list']);
    return of(null);
  }

  return inject(TaskService).getTaskById(id!);
};
