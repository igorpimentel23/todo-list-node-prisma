import { Router } from 'express';
import { taskController } from '@/http/controllers/taskController';

export const taskRoutes = Router();

taskRoutes.get('/', taskController.list);
taskRoutes.post('/', taskController.create);
taskRoutes.put('/:id', taskController.update);
taskRoutes.delete('/:id', taskController.delete);
