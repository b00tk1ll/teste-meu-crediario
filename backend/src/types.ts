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

export interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
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

export interface Database {
  clientes: Cliente[];
}

export interface EndividamentoResult {
  mes: string;
  total: number;
}

export interface CalculoEndividamentoRequest {
  cliente: Cliente;
}

// Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  password?: string; // Only for creation/login
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'user';
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

// Validation Types
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

// API Response Types
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

