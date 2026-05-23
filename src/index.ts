import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import chatRoutes from './routes/chat';
import webhookRoutes from './routes/webhooks';

dotenv.config();

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;

app.use('/api/chat', chatRoutes);
app.use('/api/webhooks', webhookRoutes);

const distPath = path.join(process.cwd(), 'client/dist');

app.use(express.static(distPath));

app.get('*', (_, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
