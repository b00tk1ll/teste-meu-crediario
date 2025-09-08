import { Request, Response, NextFunction } from 'express';
import { EndividamentoService } from '../services/endividamentoService';
import { CalculoEndividamentoRequest, EndividamentoResult, ApiResponse } from '../types';
import { AppError, asyncHandler } from '../middlewares/errorHandler';

export class EndividamentoController {
  /**
   * Calcular endividamento máximo de um cliente
   */
  static calcularEndividamento = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const { cliente }: CalculoEndividamentoRequest = req.body;

    if (!cliente) {
      throw new AppError('Dados do cliente são obrigatórios', 400);
    }

    if (!cliente.historico_compras || !Array.isArray(cliente.historico_compras)) {
      throw new AppError('Histórico de compras do cliente é obrigatório', 400);
    }

    if (cliente.historico_compras.length === 0) {
      const response: ApiResponse<EndividamentoResult> = {
        success: true,
        data: {
          mes: '',
          total: 0
        },
        message: 'Cliente não possui compras registradas'
      };
      return res.json(response);
    }

    try {
      const resultado = EndividamentoService.calcularEndividamentoMaximo(cliente);

      const response: ApiResponse<EndividamentoResult> = {
        success: true,
        data: resultado,
        message: 'Cálculo de endividamento realizado com sucesso'
      };

      return res.json(response);
    } catch (error) {
      console.error('Erro ao calcular endividamento:', error);
      throw new AppError('Erro interno ao calcular endividamento', 500);
    }
  });

}
