import { Prisma } from '@prisma/client';
import { ITasksRepository } from '@/repositories/tasksRepository';

export class CreateTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(data: Prisma.TaskCreateInput) {
    const task = await this.tasksRepository.create(data);

    return task;
  }
}
