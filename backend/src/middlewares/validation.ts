import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { CreateClienteRequest, UpdateClienteRequest, CreateCompraRequest, LoginRequest, RegisterRequest, CalculoEndividamentoRequest } from '../types';

// Validação para criação de cliente
export const validateCreateCliente = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<CreateClienteRequest>({
    nome: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
    cpf: Joi.string().pattern(/^\d{11}$/).required().messages({
      'string.pattern.base': 'CPF deve conter exatamente 11 dígitos numéricos'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ser válido'
    }),
    telefone: Joi.string().pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/).required().messages({
      'string.pattern.base': 'Telefone deve estar no formato (XX) XXXXX-XXXX'
    }),
    endereco: Joi.object({
      rua: Joi.string().min(1).required(),
      numero: Joi.string().min(1).required(),
      bairro: Joi.string().min(1).required(),
      cidade: Joi.string().min(1).required(),
      estado: Joi.string().length(2).required(),
      cep: Joi.string().pattern(/^\d{5}-\d{3}$/).required().messages({
        'string.pattern.base': 'CEP deve estar no formato XXXXX-XXX'
      })
    }).required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      error: 'Dados de entrada inválidos',
      details: errors
    });
  }

  next();
};

// Validação para atualização de cliente
export const validateUpdateCliente = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<UpdateClienteRequest>({
    nome: Joi.string().min(2).max(100).optional(),
    cpf: Joi.string().pattern(/^\d{11}$/).optional(),
    email: Joi.string().email().optional(),
    telefone: Joi.string().pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/).optional(),
    endereco: Joi.object({
      rua: Joi.string().min(1).optional(),
      numero: Joi.string().min(1).optional(),
      bairro: Joi.string().min(1).optional(),
      cidade: Joi.string().min(1).optional(),
      estado: Joi.string().length(2).optional(),
      cep: Joi.string().pattern(/^\d{5}-\d{3}$/).optional()
    }).optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      error: 'Dados de entrada inválidos',
      details: errors
    });
  }

  next();
};

// Validação para criação de compra
export const validateCreateCompra = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<CreateCompraRequest>({
    valor: Joi.number().positive().required().messages({
      'number.positive': 'Valor deve ser positivo'
    }),
    data: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required().messages({
      'string.pattern.base': 'Data deve estar no formato YYYY-MM-DD'
    }),
    contrato: Joi.string().min(1).required(),
    parcelas: Joi.array().items(
      Joi.object({
        valorvencimento: Joi.number().positive().required(),
        datavencimento: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
        dataultimopagamento: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
        totalpago: Joi.number().min(0).required(),
        capitalaberto: Joi.number().min(0).required()
      })
    ).min(1).required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      error: 'Dados de entrada inválidos',
      details: errors
    });
  }

  next();
};

// Validação para cálculo de endividamento
export const validateCalculoEndividamento = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<CalculoEndividamentoRequest>({
    cliente: Joi.object({
      id: Joi.number().integer().positive().required(),
      nome: Joi.string().required(),
      cpf: Joi.string().required(),
      email: Joi.string().email().required(),
      telefone: Joi.string().required(),
      endereco: Joi.object().required(),
      historico_compras: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().positive().required(),
          valor: Joi.number().positive().required(),
          data: Joi.string().required(),
          contrato: Joi.string().required(),
          parcelas: Joi.array().items(
            Joi.object({
              valorvencimento: Joi.number().positive().required(),
              datavencimento: Joi.string().required(),
              dataultimopagamento: Joi.string(),
              totalpago: Joi.number().min(0).required(),
              capitalaberto: Joi.number().min(0).required()
            })
          ).required()
        })
      ).required()
    }).required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      error: 'Dados do cliente inválidos',
      details: errors
    });
  }

  next();
};

// Validação para login
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<LoginRequest>({
    username: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Nome de usuário é obrigatório',
      'string.min': 'Nome de usuário deve ter pelo menos 3 caracteres'
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Senha é obrigatória',
      'string.min': 'Senha deve ter pelo menos 6 caracteres'
    })
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      error: 'Dados de login inválidos',
      details: errors
    });
  }

  next();
};

// Validação para registro
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object<RegisterRequest>({
    username: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'Nome de usuário é obrigatório',
      'string.min': 'Nome de usuário deve ter pelo menos 3 caracteres'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email deve ser válido'
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Senha é obrigatória',
      'string.min': 'Senha deve ter pelo menos 6 caracteres'
    }),
    role: Joi.string().valid('admin', 'user').optional().default('user')
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      error: 'Dados de registro inválidos',
      details: errors
    });
  }

  next();
};
