export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface Parcela {
  valorvencimento: number;
  datavencimento: string;
  dataultimopagamento: string;
  totalpago: number;
  capitalaberto: number;
}

export interface Compra {
  id: number;
  valor: number;
  data: string;
  contrato: string;
  parcelas: Parcela[];
}

export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  historico_compras: Compra[];
}

export interface CreateClienteRequest {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: Endereco;
}

export interface UpdateClienteRequest {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  endereco?: Partial<Endereco>;
}

export interface CreateCompraRequest {
  valor: number;
  data: string;
  contrato: string;
  parcelas: Parcela[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EndividamentoResult {
  mes: string;
  total: number;
}

const API_BASE_URL = '/api';

export class ClienteService {
  private static async handleResponse<T>(response: Response): Promise<T> {
    const data: ApiResponse<T> = await response.json();

    if (!response.ok || !data.success) {
      const errorMessage = data.error || data.message || `Erro na requisição: ${response.status}`;
      throw new Error(errorMessage);
    }

    return data.data as T;
  }

  static async getClientes(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Omit<Cliente, 'historico_compras' | 'endereco'>>> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes?page=${page}&limit=${limit}`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  static async getCliente(id: number): Promise<Cliente> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  static async getClienteCompras(id: number): Promise<Compra[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}/compras`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erro ao buscar compras do cliente:', error);
      throw error;
    }
  }

  static async createCliente(cliente: CreateClienteRequest): Promise<Cliente> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  static async updateCliente(id: number, cliente: UpdateClienteRequest): Promise<Cliente> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  static async deleteCliente(id: number): Promise<Cliente> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'DELETE',
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }

  static async addClienteCompra(id: number, compra: CreateCompraRequest): Promise<Compra> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}/compras`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(compra),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erro ao adicionar compra:', error);
      throw error;
    }
  }

  static async calcularEndividamento(cliente: Cliente): Promise<EndividamentoResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/endividamento/calcular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cliente }),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Erro ao calcular endividamento:', error);
      throw error;
    }
  }
}
