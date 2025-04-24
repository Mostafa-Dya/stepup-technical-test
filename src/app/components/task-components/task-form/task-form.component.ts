import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Task } from '../../../models/task.model';
import { futureDateValidator } from '../../../shared/validators/future-date.validator';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: false,
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task?: Task;
  @Output() save = new EventEmitter<Task | Omit<Task, 'id'>>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  statusOptions = [
    { label: 'To Do', value: 'todo' },
    { label: 'In Progress', value: 'inProgress' },
    { label: 'Done', value: 'done' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [null, Validators.required],
      description: [null],
      dueDate: [null, [Validators.required, futureDateValidator()]],
      status: ['todo'],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['task'];
    if (change && this.form) {
      const t = change.currentValue as Task | undefined;
      if (t) {
        this.form.patchValue({
          title: t.title,
          description: t.description || null,
          dueDate: new Date(t.dueDate),
          status: t.status,
        });
      } else {
        this.form.reset({
          status: 'todo',
          title: null,
          description: null,
          dueDate: null,
        });
      }
    }
  }

  submit() {
    if (!this.form || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;
    const payload: Omit<Task, 'id'> = {
      title: raw.title!.trim(),
      description: raw.description!.trim(),
      dueDate:
        raw.dueDate instanceof Date ? raw.dueDate.toISOString() : raw.dueDate,
      status: raw.status!,
    };

    if (this.task && this.task.id != null) {
      this.save.emit({ ...payload, id: this.task.id });
    } else {
      this.save.emit(payload);
    }
  }
}
