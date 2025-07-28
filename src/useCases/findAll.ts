import { ITasksRepository } from '@/repositories/tasksRepository';

export class FindAllTasksUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute() {
    const tasks = await this.tasksRepository.findAll();

    return tasks;
  }
}
