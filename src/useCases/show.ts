import { ITasksRepository, TaskType } from '@/repositories/tasksRepository';

export class ShowTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(id: string): Promise<TaskType | null> {
    const task = await this.tasksRepository.findById(id);

    return task;
  }
}
