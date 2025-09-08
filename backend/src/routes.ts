import express from 'express';
import { ClienteController } from './controllers/clienteController';
import { EndividamentoController } from './controllers/endividamentoController';
import { AuthController } from './controllers/authController';
import { authenticate, authorize, optionalAuth } from './middlewares/auth';
import {
  validateCreateCliente,
  validateUpdateCliente,
  validateCreateCompra,
  validateCalculoEndividamento,
  validateLogin,
  validateRegister
} from './middlewares/validation';

const router = express.Router();

// Rotas de autenticação (públicas)
router.post('/auth/register', validateRegister, AuthController.register);
router.post('/auth/login', validateLogin, AuthController.login);
router.get('/auth/profile', authenticate, AuthController.getProfile);
router.get('/auth/verify', authenticate, AuthController.verifyToken);

// Rotas de usuários (apenas admin)
router.get('/auth/users', authenticate, authorize('admin'), AuthController.getAllUsers);

// Rotas de clientes
router.get('/clientes', optionalAuth, ClienteController.getAllClientes);
router.get('/clientes/:id', optionalAuth, ClienteController.getClienteById);
router.post('/clientes', authenticate, authorize('admin'), validateCreateCliente, ClienteController.createCliente);
router.put('/clientes/:id', authenticate, authorize('admin'), validateUpdateCliente, ClienteController.updateCliente);
router.delete('/clientes/:id', authenticate, authorize('admin'), ClienteController.deleteCliente);

// Rotas de compras de clientes
router.get('/clientes/:id/compras', optionalAuth, ClienteController.getClienteCompras);
router.post('/clientes/:id/compras', authenticate, authorize('admin', 'user'), validateCreateCompra, ClienteController.addClienteCompra);

// Rotas de endividamento
router.post('/endividamento/calcular', optionalAuth, validateCalculoEndividamento, EndividamentoController.calcularEndividamento);

export default router;

