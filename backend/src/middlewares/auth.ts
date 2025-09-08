import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AppError } from './errorHandler';
import { User } from '../types';

// Extender Request para incluir usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>;
    }
  }
}

/**
 * Middleware de autenticação JWT
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Token de autenticação não fornecido', 401);
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      throw new AppError('Token de autenticação não fornecido', 401);
    }

    // Verificar token
    const decoded = AuthService.verifyToken(token);

    // Buscar usuário completo
    const user = AuthService.getUserById(decoded.userId);
    if (!user) {
      throw new AppError('Usuário não encontrado', 401);
    }

    // Anexar usuário ao request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware de autorização baseado em roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('Acesso negado. Permissões insuficientes', 403);
    }

    next();
  };
};

/**
 * Middleware opcional de autenticação (não obrigatório)
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;

      if (token) {
        const decoded = AuthService.verifyToken(token);
        const user = AuthService.getUserById(decoded.userId);

        if (user) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    // Ignorar erro e continuar sem autenticação
    next();
  }
};
