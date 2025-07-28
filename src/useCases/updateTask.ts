import { Prisma } from '@prisma/client';
import { ITasksRepository } from '@/repositories/tasksRepository';

export class UpdateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(id: string, data: Prisma.TaskUpdateInput) {
    const task = await this.tasksRepository.update(id, data);

    return task;
  }
}
