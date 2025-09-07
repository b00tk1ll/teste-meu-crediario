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

