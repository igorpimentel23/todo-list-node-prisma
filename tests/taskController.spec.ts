import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../src/app';
import { Colors } from '../src/Enums/Colors';
import { PrismaTasksRepository } from '../src/repositories/prisma/tasksRepository';

// Mock data
const mockTask = {
  id: '00000000-0000-0000-0000-000000000000',
  title: 'Test Task',
  color: Colors.BLUE,
  completed: false,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

const mockTasks = [
  mockTask,
  {
    ...mockTask,
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Another Task',
    color: Colors.RED,
  },
];

describe('Task Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'findAll').mockResolvedValue(
        mockTasks,
      );

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: mockTasks[0].id,
        title: mockTasks[0].title,
        color: mockTasks[0].color,
        completed: mockTasks[0].completed,
      });
      expect(response.body[1]).toMatchObject({
        id: mockTasks[1].id,
        title: mockTasks[1].title,
        color: mockTasks[1].color,
        completed: mockTasks[1].completed,
      });
    });

    it('should return 500 when repository throws error', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'findAll').mockRejectedValue(
        new Error('Database error'),
      );

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return 404 when task does not exist', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'findById').mockResolvedValue(
        null,
      );

      const response = await request(app).get(
        '/tasks/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Task not found' });
    });

    it('should return task when it exists', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'findById').mockResolvedValue(
        mockTask,
      );

      const response = await request(app).get(
        '/tasks/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: mockTask.id,
        title: mockTask.title,
        color: mockTask.color,
        completed: mockTask.completed,
      });
    });

    it('should return 400 when invalid UUID is provided', async () => {
      const response = await request(app).get('/tasks/invalid-uuid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('issues');
    });

    it('should return 500 when repository throws error', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'findById').mockRejectedValue(
        new Error('Database error'),
      );

      const response = await request(app).get(
        '/tasks/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      const newTaskData = {
        title: 'New Task',
        color: Colors.GREEN,
      };

      vi.spyOn(PrismaTasksRepository.prototype, 'create').mockResolvedValue({
        ...mockTask,
        ...newTaskData,
        id: '22222222-2222-2222-2222-222222222222',
      });

      const response = await request(app).post('/tasks').send(newTaskData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(newTaskData);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('completed', false);
    });

    it('should return 400 when title is missing', async () => {
      const invalidData = {
        color: Colors.BLUE,
      };

      const response = await request(app).post('/tasks').send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('issues');
    });

    it('should return 400 when title is empty', async () => {
      const invalidData = {
        title: '',
        color: Colors.BLUE,
      };

      const response = await request(app).post('/tasks').send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('issues');
    });

    it('should return 400 when color is invalid', async () => {
      const invalidData = {
        title: 'Test Task',
        color: 'invalid-color',
      };

      const response = await request(app).post('/tasks').send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('issues');
    });

    it('should return 500 when repository throws error', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'create').mockRejectedValue(
        new Error('Database error'),
      );

      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task', color: Colors.BLUE });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update an existing task', async () => {
      const updateData = {
        title: 'Updated Task',
        completed: true,
      };

      const updatedTask = {
        ...mockTask,
        ...updateData,
      };

      vi.spyOn(PrismaTasksRepository.prototype, 'update').mockResolvedValue(
        updatedTask,
      );

      const response = await request(app)
        .put('/tasks/00000000-0000-0000-0000-000000000000')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: updatedTask.id,
        title: updatedTask.title,
        color: updatedTask.color,
        completed: updatedTask.completed,
      });
    });

    it('should return 404 when task does not exist', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'update').mockRejectedValue({
        code: 'P2025',
      });

      const response = await request(app)
        .put('/tasks/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Task not found' });
    });

    it('should return 400 when invalid UUID is provided', async () => {
      const response = await request(app)
        .put('/tasks/invalid-uuid')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('issues');
    });

    it('should return 400 when title is empty', async () => {
      const response = await request(app)
        .put('/tasks/00000000-0000-0000-0000-000000000000')
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('issues');
    });

    it('should return 400 when color is invalid', async () => {
      const response = await request(app)
        .put('/tasks/00000000-0000-0000-0000-000000000000')
        .send({ color: 'invalid-color' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('issues');
    });

    it('should return 500 when repository throws error', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'update').mockRejectedValue(
        new Error('Database error'),
      );

      const response = await request(app)
        .put('/tasks/00000000-0000-0000-0000-000000000000')
        .send({ title: 'Updated Task' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete an existing task', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'delete').mockResolvedValue();

      const response = await request(app).delete(
        '/tasks/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(204);
    });

    it('should return 404 when task does not exist', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'delete').mockRejectedValue({
        code: 'P2025',
      });

      const response = await request(app).delete(
        '/tasks/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Task not found' });
    });

    it('should return 400 when invalid UUID is provided', async () => {
      const response = await request(app).delete('/tasks/invalid-uuid');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation error');
      expect(response.body).toHaveProperty('issues');
    });

    it('should return 500 when repository throws error', async () => {
      vi.spyOn(PrismaTasksRepository.prototype, 'delete').mockRejectedValue(
        new Error('Database error'),
      );

      const response = await request(app).delete(
        '/tasks/00000000-0000-0000-0000-000000000000',
      );

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });
});
