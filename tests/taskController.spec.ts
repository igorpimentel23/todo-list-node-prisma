import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import { app } from '../src/app';
import { PrismaTasksRepository } from '../src/repositories/prisma/tasksRepository';

describe('Task Controller', () => {
  it('should return 404 when task does not exist', async () => {
    vi.spyOn(PrismaTasksRepository.prototype, 'findById').mockResolvedValue(
      null,
    );

    const response = await request(app).get(
      '/tasks/11111111-1111-1111-1111-111111111111',
    );

    expect(response.status).toBe(404);
  });
});
