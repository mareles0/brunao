import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './src/routes/index.js';
import { errorHandler, notFoundHandler } from './src/utils/errorHandler.js';
import { requestLogger } from './src/utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({
    message: 'API Estacione Fácil',
    version: '1.0.0',
    endpoints: {
      spaces: '/api/spaces',
      vehicles: '/api/vehicles',
      stats: '/api/parking'
    }
  });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚗 Servidor rodando na porta ${PORT}`);
  console.log(`📡 API disponível em http://localhost:${PORT}`);
  console.log(`📊 Documentação: http://localhost:${PORT}/api`);
});

export default app;
