import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { LoginRequest, RegisterRequest, ApiResponse } from '../types';
import { AppError, asyncHandler } from '../middlewares/errorHandler';

export class AuthController {
  /**
   * Registrar novo usuário
   */
  static register = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const userData: RegisterRequest = req.body;

    const result = await AuthService.register(userData);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Usuário registrado com sucesso'
    };

    return res.status(201).json(response);
  });

  /**
   * Login de usuário
   */
  static login = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const loginData: LoginRequest = req.body;

    const result = await AuthService.login(loginData);

    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Login realizado com sucesso'
    };

    return res.json(response);
  });

  /**
   * Obter perfil do usuário autenticado
   */
  static getProfile = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const response: ApiResponse = {
      success: true,
      data: req.user
    };

    return res.json(response);
  });

  /**
   * Listar todos os usuários (apenas admin)
   */
  static getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const users = AuthService.getAllUsers();

    const response: ApiResponse = {
      success: true,
      data: users,
      message: `${users.length} usuário(s) encontrado(s)`
    };

    return res.json(response);
  });

  /**
   * Verificar status do token
   */
  static verifyToken = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    if (!req.user) {
      throw new AppError('Token inválido', 401);
    }

    const response: ApiResponse = {
      success: true,
      data: {
        valid: true,
        user: req.user
      },
      message: 'Token válido'
    };

    return res.json(response);
  });
}
