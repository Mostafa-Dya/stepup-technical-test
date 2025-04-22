import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Task } from '../../../models/task.model';
import {
  AddTask,
  DeleteTask,
  LoadTasks,
  PatchTask,
  UpdateTask,
} from '../../../core/state/task.actions';
import { TaskSelectors } from '../../../core/state/task.selector';
import { ConfirmationService, MessageService } from 'primeng/api';

type Status = 'todo' | 'inProgress' | 'done';
type TagSeverity = 'success' | 'info' | 'warn';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  standalone: false,
})
export class TaskBoardComponent implements OnInit {
  // UI state
  showDialog = false;
  selectedTask?: Task;
  hoveredStatus: Status | null = null;

  // Data
  tasks: Record<Status, Task[]> = { todo: [], inProgress: [], done: [] };

  // Constants
  readonly statuses = ['todo', 'inProgress', 'done'] as const;
  readonly statusLabels: Record<Status, string> = {
    todo: 'To Do',
    inProgress: 'In Progress',
    done: 'Done',
  };
  readonly statusSeverity: Record<Status, TagSeverity> = {
    todo: 'info',
    inProgress: 'warn',
    done: 'success',
  };

  // Drag‑drop tracking
  private draggedTask: Task | null = null;
  private draggedFrom: Status | null = null;

  constructor(
    private store: Store,
    private confirmation: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  private loadTasks() {
    this.store.dispatch(new LoadTasks());
    this.store
      .select(TaskSelectors.byStatus)
      .subscribe((buckets) => (this.tasks = buckets));
  }

  dragStart(task: Task, from: Status) {
    this.draggedTask = task;
    this.draggedFrom = from;
  }

  dragEnd() {
    this.draggedTask = this.draggedFrom = null;
  }

  dragEnter(status: Status) {
    this.hoveredStatus = status;
  }

  dragLeave() {
    this.hoveredStatus = null;
  }

  onDrop(_: any, to: Status) {
    this.dragLeave();
    if (!this.draggedTask || this.draggedFrom === to) {
      return this.dragEnd();
    }
    this.changeStatus(this.draggedTask.id, to);
  }

  private changeStatus(id: number, to: Status) {
    this.dispatchAndNotify(
      new PatchTask(id, { status: to }),
      'Status Updated',
      `Task moved to "${this.statusLabels[to]}"`,
      'Update Failed',
      `Could not move task to "${this.statusLabels[to]}"`
    ).add(() => this.dragEnd());
  }

  addEditTask(task?: Task) {
    this.selectedTask = task ? { ...task } : undefined;
    this.showDialog = true;
  }

  onSave(taskOrNew: Task | Omit<Task, 'id'>) {
    if ('id' in taskOrNew) {
      this.dispatchAndNotify(
        new UpdateTask(taskOrNew.id, taskOrNew as Task),
        'Updated',
        'Task was updated',
        'Update Failed',
        'Could not update task'
      ).add(() => (this.showDialog = false));
    } else {
      this.dispatchAndNotify(
        new AddTask(taskOrNew),
        'Created',
        'Task was created',
        'Create Failed',
        'Could not create task'
      ).add(() => (this.showDialog = false));
    }
  }

  confirmDelete(id: number) {
    this.confirmation.confirm({
      message: 'Are you sure you want to delete this task?',
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => this.deleteTask(id),
    });
  }

  private deleteTask(id: number) {
    this.dispatchAndNotify(
      new DeleteTask(id),
      'Deleted',
      'Task was deleted',
      'Delete Failed',
      'Could not delete task'
    );
  }

  private dispatchAndNotify(
    action: any,
    successSummary: string,
    successDetail: string,
    errorSummary: string,
    errorDetail: string
  ) {
    return this.store.dispatch(action).subscribe({
      next: () =>
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: successSummary,
          detail: successDetail,
        }),
      error: () =>
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: errorSummary,
          detail: errorDetail,
        }),
    });
  }
}
