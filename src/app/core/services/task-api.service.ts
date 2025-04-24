import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private base = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Task[]>(this.base);
  }

  create(payload: Omit<Task, 'id'>) {
    return this.http.post<Task>(this.base, payload);
  }

  update(id: number, payload: Task) {
    return this.http.put<Task>(`${this.base}/${id}`, payload);
  }

  patch(id: number, changes: Partial<Task>) {
    return this.http.patch<Task>(`${this.base}/${id}`, changes);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
