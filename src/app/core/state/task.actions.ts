import { Task } from "../../models/task.model";

export class LoadTasks {
  static readonly type = '[Task] Load';
}

export class AddTask {
  static readonly type = '[Task] Add';
  constructor(public payload: Omit<Task, 'id'>) {}
}

export class UpdateTask {
  static readonly type = '[Task] Update';
  constructor(public id: number, public payload: Task) {}
}

export class PatchTask {
  static readonly type = '[Task] Patch';
  constructor(public id: number, public payload: Partial<Task>) {}
}

export class DeleteTask {
  static readonly type = '[Task] Delete';
  constructor(public id: number) {}
}
