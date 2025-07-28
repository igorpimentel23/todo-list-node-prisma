import cors from 'cors';
import express from 'express';
import { ZodError } from 'zod';
import { env } from '@/env';
import { taskRoutes } from '@/http/routes/taskRoutes';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/tasks', taskRoutes);

app.use((error: Error, req: express.Request, res: express.Response) => {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json({ message: 'Validation error.', issues: error.format() });
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error);
  } else {
    // TODO: Log error
  }

  return res.status(500).json({ message: 'Internal server error.' });
});
