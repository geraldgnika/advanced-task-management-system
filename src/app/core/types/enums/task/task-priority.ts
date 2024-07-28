export enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

export const TaskPriorityTranslationKeys = {
  [TaskPriority.Low]: 'TASK_PRIORITY.LOW',
  [TaskPriority.Medium]: 'TASK_PRIORITY.MEDIUM',
  [TaskPriority.High]: 'TASK_PRIORITY.HIGH',
};
