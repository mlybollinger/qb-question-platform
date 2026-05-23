import express from 'express';
import userRoutes from './routes/user.routes';
import tournamentRoutes from './routes/tournament.routes';
import questionRoutes from './routes/question.routes';
import packetRoutes from './routes/packet.routes';
import authRoutes from './routes/auth.routes';
import { requireAuth } from './middleware/auth.middleware';

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.on('finish', () => console.log(`${req.method} ${req.path} ${res.statusCode}`));
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tournaments', requireAuth, tournamentRoutes);
app.use('/api/questions', requireAuth, questionRoutes);
app.use('/api/packets', requireAuth, packetRoutes);

export default app;
