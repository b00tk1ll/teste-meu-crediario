import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response<ApiResponse> => {
  let statusCode = 500;
  let message = 'Erro interno do servidor';

  // Se for um erro operacional (conhecido)
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Erro de validação do Joi
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Dados de entrada inválidos';
  }

  // Erro de sintaxe JSON
  if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400;
    message = 'JSON malformado';
  }

  // Log do erro em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }

  // Resposta padronizada
  const response: ApiResponse = {
    success: false,
    error: message
  };

  return res.status(statusCode).json(response);
};

// Middleware para capturar erros assíncronos
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Middleware para capturar erros 404
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): Response<ApiResponse> => {
  const response: ApiResponse = {
    success: false,
    error: `Rota ${req.originalUrl} não encontrada`
  };

  return res.status(404).json(response);
};
