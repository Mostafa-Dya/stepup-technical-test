import { State, Action, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import * as TaskActions from './task.actions';
import { tap } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskApiService } from '../services/task-api.service';

@State<Task[]>({
  name: 'tasks',
  defaults: [],
})
@Injectable()
export class TaskState {
  constructor(private api: TaskApiService) {}

  @Action(TaskActions.LoadTasks)
  load(ctx: StateContext<Task[]>) {
    return this.api.getAll().pipe(tap((tasks) => ctx.setState(tasks)));
  }

  @Action(TaskActions.AddTask)
  add(ctx: StateContext<Task[]>, { payload }: TaskActions.AddTask) {
    return this.api.create(payload).pipe(
      tap((task) => {
        const state = ctx.getState();
        ctx.setState([...state, task]);
      })
    );
  }

  @Action(TaskActions.UpdateTask)
  update(ctx: StateContext<Task[]>, { id, payload }: TaskActions.UpdateTask) {
    return this.api.update(id, payload).pipe(
      tap((task) => {
        ctx.setState(ctx.getState().map((t) => (t.id === id ? task : t)));
      })
    );
  }

  @Action(TaskActions.PatchTask)
  patch(ctx: StateContext<Task[]>, { id, payload }: TaskActions.PatchTask) {
    return this.api.patch(id, payload).pipe(
      tap((task) => {
        ctx.setState(ctx.getState().map((t) => (t.id === id ? task : t)));
      })
    );
  }

  @Action(TaskActions.DeleteTask)
  delete(ctx: StateContext<Task[]>, { id }: TaskActions.DeleteTask) {
    return this.api.delete(id).pipe(
      tap(() => {
        ctx.setState(ctx.getState().filter((t) => t.id !== id));
      })
    );
  }
}
