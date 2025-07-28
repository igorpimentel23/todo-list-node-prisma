import { ITasksRepository } from '@/repositories/tasksRepository';

export class DeleteTaskUseCase {
  constructor(private tasksRepository: ITasksRepository) {}

  async execute(id: string) {
    await this.tasksRepository.delete(id);
  }
}
