import { Prisma, Task } from '@prisma/client';

export type TaskType = Task;

export interface ITasksRepository {
  findAll(): Promise<TaskType[]>;
  findById(id: string): Promise<TaskType>;
  create(data: Prisma.TaskCreateInput): Promise<TaskType>;
  update(id: string, data: Prisma.TaskUpdateInput): Promise<TaskType>;
  delete(id: string): Promise<void>;
}
