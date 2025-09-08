import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { AuthService } from './services/authService';
import { config } from './config';

const app = express();

// Inicializar usuários padrão
AuthService.initializeDefaultUsers().catch(console.error);

// Middlewares globais
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Rotas da API
app.use('/api', routes);

// Middleware para rotas não encontradas
app.use(notFoundHandler);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

app.listen(config.server.port, () => {
  console.log(`🚀 Server is running on http://localhost:${config.server.port}`);
  console.log(`📊 Health check available at http://localhost:${config.server.port}/health`);
});
