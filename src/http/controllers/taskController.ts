import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaTasksRepository } from '@/repositories/prisma/tasksRepository';
import { CreateTaskUseCase } from '@/useCases/createTask';
import { DeleteTaskUseCase } from '@/useCases/deleteTask';
import { FindAllTasksUseCase } from '@/useCases/findAll';
import { UpdateTaskUseCase } from '@/useCases/updateTask';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  color: z.string().min(1, 'Color is required'),
});

const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  color: z.string().min(1, 'Color is required').optional(),
  completed: z.boolean().optional(),
});

export const taskController = {
  async list(req: Request, res: Response) {
    try {
      const findAllTasksUseCase = new FindAllTasksUseCase(
        new PrismaTasksRepository(),
      );
      const tasks = await findAllTasksUseCase.execute();

      return res.json(tasks);
    } catch (error) {
      console.error('Error listing tasks:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { title, color } = createTaskSchema.parse(req.body);

      const createTaskUseCase = new CreateTaskUseCase(
        new PrismaTasksRepository(),
      );
      const task = await createTaskUseCase.execute({
        title,
        color,
        completed: false,
      });

      return res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: 'Validation error', issues: error.format() });
      }

      console.error('Error creating task:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = updateTaskSchema.parse(req.body);

      const updateTaskUseCase = new UpdateTaskUseCase(
        new PrismaTasksRepository(),
      );
      const task = await updateTaskUseCase.execute(id, updateData);

      return res.json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: 'Validation error', issues: error.format() });
      }

      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        return res.status(404).json({ message: 'Task not found' });
      }

      console.error('Error updating task:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const deleteTaskUseCase = new DeleteTaskUseCase(
        new PrismaTasksRepository(),
      );
      await deleteTaskUseCase.execute(id);

      return res.status(204).send();
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2025'
      ) {
        return res.status(404).json({ message: 'Task not found' });
      }

      console.error('Error deleting task:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};
