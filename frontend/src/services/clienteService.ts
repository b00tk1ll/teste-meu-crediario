export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  historico_compras: any[];
}

const API_BASE_URL = '/api';

export class ClienteService {
  static async getClientes(): Promise<Cliente[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`);
      if (!response.ok) {
        throw new Error('Erro ao buscar clientes');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }
  }

  static async getCliente(id: number): Promise<Cliente> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
      if (!response.ok) {
        throw new Error('Cliente não encontrado');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  static async createCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        throw new Error('Erro ao criar cliente');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }

  static async updateCliente(id: number, cliente: Partial<Cliente>): Promise<Cliente> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        throw new Error('Erro ao atualizar cliente');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw error;
    }
  }

  static async deleteCliente(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erro ao excluir cliente');
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      throw error;
    }
  }
}
