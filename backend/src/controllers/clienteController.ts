import { Request, Response, NextFunction } from 'express';
import { readDB, writeDB } from '../database';
import { Cliente, CreateClienteRequest, UpdateClienteRequest, CreateCompraRequest, ApiResponse, PaginatedResponse } from '../types';
import { AppError, asyncHandler } from '../middlewares/errorHandler';

export class ClienteController {
  /**
   * Listar todos os clientes
   */
  static getAllClientes = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const db = readDB();

    // Remover historico_compras e endereco de cada cliente para listagem
    const clientes = db.clientes.map(cliente => {
      const { historico_compras, endereco, ...clientePublico } = cliente;
      return clientePublico;
    });

    // Suporte a paginação
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedClientes = clientes.slice(startIndex, endIndex);

    const response: ApiResponse<PaginatedResponse<Omit<Cliente, 'historico_compras' | 'endereco'>>> = {
      success: true,
      data: {
        data: paginatedClientes,
        pagination: {
          page,
          limit,
          total: clientes.length,
          totalPages: Math.ceil(clientes.length / limit)
        }
      }
    };

    return res.json(response);
  });

  /**
   * Buscar cliente por ID
   */
  static getClienteById = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const db = readDB();
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw new AppError('ID do cliente deve ser um número válido', 400);
    }

    const cliente = db.clientes.find(c => c.id === id);

    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    const response: ApiResponse<Cliente> = {
      success: true,
      data: cliente
    };

    return res.json(response);
  });

  /**
   * Criar novo cliente
   */
  static createCliente = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const db = readDB();
    const clienteData: CreateClienteRequest = req.body;

    // Verificar se CPF já existe
    const existingCliente = db.clientes.find(c => c.cpf === clienteData.cpf);
    if (existingCliente) {
      throw new AppError('CPF já cadastrado', 409);
    }

    // Verificar se email já existe
    const existingEmail = db.clientes.find(c => c.email === clienteData.email);
    if (existingEmail) {
      throw new AppError('Email já cadastrado', 409);
    }

    const newCliente: Cliente = {
      id: db.clientes.length > 0 ? Math.max(...db.clientes.map(c => c.id)) + 1 : 1,
      ...clienteData,
      historico_compras: []
    };

    db.clientes.push(newCliente);
    writeDB(db);

    const response: ApiResponse<Cliente> = {
      success: true,
      data: newCliente,
      message: 'Cliente criado com sucesso'
    };

    return res.status(201).json(response);
  });

  /**
   * Atualizar cliente
   */
  static updateCliente = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const db = readDB();
    const id = parseInt(req.params.id);
    const updateData: UpdateClienteRequest = req.body;

    if (isNaN(id)) {
      throw new AppError('ID do cliente deve ser um número válido', 400);
    }

    const clienteIndex = db.clientes.findIndex(c => c.id === id);

    if (clienteIndex === -1) {
      throw new AppError('Cliente não encontrado', 404);
    }

    // Verificar se CPF já existe em outro cliente
    if (updateData.cpf) {
      const existingCliente = db.clientes.find(c => c.cpf === updateData.cpf && c.id !== id);
      if (existingCliente) {
        throw new AppError('CPF já cadastrado em outro cliente', 409);
      }
    }

    // Verificar se email já existe em outro cliente
    if (updateData.email) {
      const existingEmail = db.clientes.find(c => c.email === updateData.email && c.id !== id);
      if (existingEmail) {
        throw new AppError('Email já cadastrado em outro cliente', 409);
      }
    }

    // Atualizar cliente
    const clienteAtual = db.clientes[clienteIndex];

    // Atualizar apenas os campos fornecidos
    if (updateData.nome) clienteAtual.nome = updateData.nome;
    if (updateData.cpf) clienteAtual.cpf = updateData.cpf;
    if (updateData.email) clienteAtual.email = updateData.email;
    if (updateData.telefone) clienteAtual.telefone = updateData.telefone;

    // Atualizar endereço se fornecido
    if (updateData.endereco) {
      clienteAtual.endereco = { ...clienteAtual.endereco, ...updateData.endereco };
    }

    writeDB(db);

    const response: ApiResponse<Cliente> = {
      success: true,
      data: db.clientes[clienteIndex],
      message: 'Cliente atualizado com sucesso'
    };

    return res.json(response);
  });

  /**
   * Deletar cliente
   */
  static deleteCliente = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const db = readDB();
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw new AppError('ID do cliente deve ser um número válido', 400);
    }

    const clienteIndex = db.clientes.findIndex(c => c.id === id);

    if (clienteIndex === -1) {
      throw new AppError('Cliente não encontrado', 404);
    }

    const deletedCliente = db.clientes.splice(clienteIndex, 1);
    writeDB(db);

    const response: ApiResponse<Cliente> = {
      success: true,
      data: deletedCliente[0],
      message: 'Cliente deletado com sucesso'
    };

    return res.json(response);
  });

  /**
   * Buscar histórico de compras do cliente
   */
  static getClienteCompras = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const db = readDB();
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      throw new AppError('ID do cliente deve ser um número válido', 400);
    }

    const cliente = db.clientes.find(c => c.id === id);

    if (!cliente) {
      throw new AppError('Cliente não encontrado', 404);
    }

    const response: ApiResponse<any[]> = {
      success: true,
      data: cliente.historico_compras
    };

    return res.json(response);
  });

  /**
   * Adicionar compra ao cliente
   */
  static addClienteCompra = asyncHandler(async (req: Request, res: Response): Promise<Response<ApiResponse>> => {
    const db = readDB();
    const clienteId = parseInt(req.params.id);
    const compraData: CreateCompraRequest = req.body;

    if (isNaN(clienteId)) {
      throw new AppError('ID do cliente deve ser um número válido', 400);
    }

    const clienteIndex = db.clientes.findIndex(c => c.id === clienteId);

    if (clienteIndex === -1) {
      throw new AppError('Cliente não encontrado', 404);
    }

    const newCompra = {
      id: db.clientes[clienteIndex].historico_compras.length > 0
        ? Math.max(...db.clientes[clienteIndex].historico_compras.map(c => c.id)) + 1
        : 1,
      ...compraData
    };

    db.clientes[clienteIndex].historico_compras.push(newCompra);
    writeDB(db);

    const response: ApiResponse<any> = {
      success: true,
      data: newCompra,
      message: 'Compra adicionada com sucesso'
    };

    return res.status(201).json(response);
  });
}
