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
type TagSeverity =
  | 'success'
  | 'secondary'
  | 'info'
  | 'warn'
  | 'danger'
  | 'contrast';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  standalone: false,
})
export class TaskBoardComponent implements OnInit {
  showDialog = false;
  selectedTask?: Task;
  hoveredStatus: Status | null = null;

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

  tasks: Record<Status, Task[]> = {
    todo: [],
    inProgress: [],
    done: [],
  };

  private draggedTask: Task | null = null;
  private draggedFrom: Status | null = null;

  constructor(
    private store: Store,
    private confirmation: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.store.dispatch(new LoadTasks());

    this.store
      .select(TaskSelectors.byStatus)
      .subscribe((m) => (this.tasks = m));
  }

  dragStart(task: Task, from: Status) {
    this.draggedTask = task;
    this.draggedFrom = from;
  }

  dragEnd() {
    this.draggedTask = null;
    this.draggedFrom = null;
  }

  dragEnter(status: Status) {
    this.hoveredStatus = status;
  }

  dragLeave() {
    this.hoveredStatus = null;
  }

  onDrop(event: any, to: Status) {
    this.dragLeave();

    if (!this.draggedTask || this.draggedFrom === to) {
      return this.dragEnd();
    }
    const { id } = this.draggedTask;
    this.store
      .dispatch(new PatchTask(id, { status: to }))
      .subscribe({ next: () => this.dragEnd(), error: () => this.dragEnd() });
  }

  addEditTask(task?: Task) {
    this.selectedTask = task ? { ...task } : undefined;
    this.showDialog = true;
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

  deleteTask(id: number) {
    this.store.dispatch(new DeleteTask(id)).subscribe({
      next: () => {
        this.messageService.add({
          key: 'global',
          severity: 'success',
          summary: 'Deleted',
          detail: 'Task was deleted',
        });
      },
      error: (err) => {
        this.messageService.add({
          key: 'global',
          severity: 'error',
          summary: 'Delete Failed',
          detail: 'Could not delete task',
        });
      },
    });
  }

  onSave(taskOrNew: Task | Omit<Task, 'id'>) {
    if ('id' in taskOrNew) {
      this.store
        .dispatch(new UpdateTask(taskOrNew.id, taskOrNew as Task))
        .subscribe({
          next: () => {
            this.showDialog = false;
            this.messageService.add({
              key: 'global',
              severity: 'success',
              summary: 'Updated',
              detail: 'Task was updated',
            });
          },
          error: () => {
            this.messageService.add({
              key: 'global',
              severity: 'error',
              summary: 'Update Failed',
              detail: 'Could not update task',
            });
          },
        });
    } else {
      this.store.dispatch(new AddTask(taskOrNew)).subscribe({
        next: () => {
          this.showDialog = false;
          this.messageService.add({
            key: 'global',
            severity: 'success',
            summary: 'Created',
            detail: 'Task was created',
          });
        },
        error: () => {
          this.messageService.add({
            key: 'global',
            severity: 'error',
            summary: 'Create Failed',
            detail: 'Could not create task',
          });
        },
      });
    }
  }
}
