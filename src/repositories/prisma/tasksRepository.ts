import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ITasksRepository, TaskType } from '../tasksRepository';

export class PrismaTasksRepository implements ITasksRepository {
  async findAll(): Promise<TaskType[]> {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tasks as TaskType[];
  }

  async findById(id: string): Promise<TaskType | null> {
    const task = await prisma.task.findUnique({
      where: { id },
    });

    return task;
  }

  async create(data: Prisma.TaskCreateInput): Promise<TaskType> {
    const task = await prisma.task.create({
      data,
    });

    return task;
  }

  async update(id: string, data: Prisma.TaskUpdateInput): Promise<TaskType> {
    const task = await prisma.task.update({
      where: { id },
      data,
    });

    return task;
  }

  async delete(id: string): Promise<void> {
    await prisma.task.delete({
      where: { id },
    });
  }
}
