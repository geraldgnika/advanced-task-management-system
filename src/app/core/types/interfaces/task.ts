import { TaskPriority } from '../enums/task/task-priority';
import { TaskStatus } from '../enums/task/task-status';
import { Comment } from './comment';

export interface Task {
	id: string;
	title: string;
	description: string;
	status: TaskStatus;
	priority: TaskPriority;
	createdDate: Date;
	updatedDate: Date;
	dueDate: Date;
	assignedTo: string[];
	comments: Comment[];
	attachment: string | null;
	user_id: string;
	username?: string;
}
