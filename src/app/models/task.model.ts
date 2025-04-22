export interface Task extends id, status {
  title: string;
  description?: string;
  dueDate: string;
}

export interface id {
  id: number;
}

export interface status {
  status: 'todo' | 'inProgress' | 'done';
}
