import { ITasksRepository } from '@/repositories/tasksRepository';

export class ShowTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(id: string) {
    const task = await this.tasksRepository.findById(id);

    return task;
  }
}
