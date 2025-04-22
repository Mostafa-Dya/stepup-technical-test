import { Selector } from '@ngxs/store';
import { TaskState } from './task.state';
import { Task } from '../../models/task.model';

export interface TaskStatusLabels {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
}

export class TaskSelectors {
  @Selector([TaskState])
  static all(tasks: Task[]): Task[] {
    return tasks;
  }

  @Selector([TaskState])
  static byStatus(tasks: Task[]): TaskStatusLabels {
    return {
      todo: tasks.filter((t) => t.status === 'todo'),
      inProgress: tasks.filter((t) => t.status === 'inProgress'),
      done: tasks.filter((t) => t.status === 'done'),
    };
  }
}
