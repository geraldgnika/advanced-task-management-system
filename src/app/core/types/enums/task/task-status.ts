export enum TaskStatus {
    Pending = 'pending',
    Doing = 'doing',
    Reviewing = 'reviewing',
    Completed = 'completed'
  }
  
  export const TaskStatusTranslationKeys = {
    [TaskStatus.Pending]: 'TASK_STATUS.PENDING',
    [TaskStatus.Doing]: 'TASK_STATUS.DOING',
    [TaskStatus.Reviewing]: 'TASK_STATUS.REVIEWING',
    [TaskStatus.Completed]: 'TASK_STATUS.COMPLETED'
};