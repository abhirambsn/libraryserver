import express from 'express';
import { config } from 'dotenv';

// Set .env values as Environment Variables only for development
if (process.env.NODE_ENV === 'development') {
  config();
}

const app = express();
app.use(express.json());

// Import routes
import authRoutes from './routes/auth';
import libraryRoutes from './routes/library';
import defaultRoutes from './routes/default';

app.use('/', defaultRoutes);
app.use('/api/v2/staff', authRoutes);
app.use('/api/v2/library', libraryRoutes);

export default app;
