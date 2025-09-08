# Backend - Meu Crédiário

## Visão Geral

Este é o backend da aplicação **Meu Crédiário**, um sistema de gestão de clientes e suas compras parceladas. A API fornece funcionalidades para gerenciar clientes, histórico de compras, parcelas e calcular o endividamento máximo de clientes.

O backend é desenvolvido em **Node.js** com **TypeScript** e utiliza **Express** como framework web. Os dados são armazenados em um arquivo JSON local (`db.json`), simulando um banco de dados simples.

## ✨ Melhorias Implementadas

### 🏗️ Separação de Responsabilidades
- **Controllers**: Lógica de negócio separada das rotas
- **Services**: Serviços especializados (Auth, Endividamento)
- **Middlewares**: Validação, autenticação, autorização e tratamento de erros
- **Config**: Configurações centralizadas

### 🔒 Sistema de Autenticação e Autorização
- **JWT Authentication**: Tokens JWT para autenticação segura
- **Role-based Authorization**: Controle de acesso baseado em roles (admin/user)
- **Password Hashing**: Senhas criptografadas com bcrypt
- **Protected Routes**: Rotas protegidas por autenticação

### ✅ Validação de Dados
- **Joi Validation**: Validação robusta de entrada de dados
- **Schema Validation**: Esquemas de validação para todos os endpoints
- **Error Messages**: Mensagens de erro detalhadas e em português

### 🚨 Tratamento de Erros
- **Centralized Error Handling**: Middleware unificado para tratamento de erros
- **Custom Error Classes**: Classes de erro específicas da aplicação
- **HTTP Status Codes**: Códigos de status apropriados
- **Error Logging**: Logs estruturados para debugging

### 📊 API Response Standardization
- **Consistent Responses**: Respostas padronizadas em todos os endpoints
- **Pagination Support**: Suporte a paginação em listagens
- **Success/Error Format**: Formato consistente para sucesso e erro

## Pré-requisitos

Antes de começar, certifique-se de que você tem instalado:

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn**
- **Git**

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd teste-meu-crediario/backend
```

2. Instale as dependências:
```bash
npm install
```

## Como Executar

### Desenvolvimento
```bash
npm run dev
```
O servidor será iniciado em modo de desenvolvimento na porta 3001.

### Produção
```bash
npm run build
npm start
```
O servidor será iniciado na porta 3001 após compilar o TypeScript.

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts              # Configurações centralizadas
│   ├── controllers/
│   │   ├── authController.ts     # Controller de autenticação
│   │   ├── clienteController.ts  # Controller de clientes
│   │   └── endividamentoController.ts # Controller de endividamento
│   ├── middlewares/
│   │   ├── auth.ts               # Middlewares de auth/autorização
│   │   ├── errorHandler.ts       # Tratamento centralizado de erros
│   │   └── validation.ts         # Validações com Joi
│   ├── services/
│   │   ├── authService.ts        # Serviço de autenticação
│   │   ├── endividamentoService.ts # Serviço de cálculo de endividamento
│   │   └── __tests__/
│   │       └── endividamentoService.test.ts
│   ├── index.ts                  # Ponto de entrada da aplicação
│   ├── routes.ts                 # Definição das rotas da API
│   ├── database.ts               # Funções para leitura/escrita no banco
│   ├── types.ts                  # Definições de tipos TypeScript
│   └── db.json                   # Banco de dados local (JSON)
├── dist/                         # Arquivos compilados
├── node_modules/                 # Dependências
├── package.json                  # Configuração do projeto
├── tsconfig.json                 # Configuração do TypeScript
├── jest.config.js                # Configuração dos testes
└── README.md                     # Esta documentação
```

## 🔐 Autenticação

### Usuário Padrão
- **Username**: admin
- **Password**: admin123
- **Role**: admin

### Endpoints de Autenticação

#### POST `/api/auth/register`
Registra um novo usuário.

**Corpo da requisição:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "senha123",
  "role": "user"
}
```

#### POST `/api/auth/login`
Realiza login e retorna token JWT.

**Corpo da requisição:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### GET `/api/auth/profile`
Retorna o perfil do usuário autenticado. (Requer token)

#### GET `/api/auth/verify`
Verifica se o token é válido. (Requer token)

#### GET `/api/auth/users`
Lista todos os usuários. (Requer role admin)

### Como Usar o Token JWT

Para acessar rotas protegidas, inclua o token no header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## API Endpoints

### Clientes

#### GET `/api/clientes`
Lista todos os clientes (sem histórico de compras e endereço para otimização).

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    "email": "joao@email.com",
    "telefone": "11999999999"
  }
]
```

#### GET `/api/clientes/:id`
Retorna um cliente específico com todos os dados.

**Parâmetros:**
- `id` (number): ID do cliente

**Resposta:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "endereco": {
    "rua": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  },
  "historico_compras": [...]
}
```

#### POST `/api/clientes`
Cria um novo cliente.

**Corpo da requisição:**
```json
{
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao@email.com",
  "telefone": "11999999999",
  "endereco": {
    "rua": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  },
  "historico_compras": []
}
```

#### PUT `/api/clientes/:id`
Atualiza um cliente existente.

**Parâmetros:**
- `id` (number): ID do cliente

**Corpo da requisição:** Mesmo formato do POST, com os campos a serem atualizados.

#### DELETE `/api/clientes/:id`
Remove um cliente.

**Parâmetros:**
- `id` (number): ID do cliente

### Compras

#### GET `/api/clientes/:id/compras`
Retorna o histórico de compras de um cliente.

**Parâmetros:**
- `id` (number): ID do cliente

**Resposta:**
```json
[
  {
    "id": 1,
    "valor": 500.00,
    "data": "2020-01-10",
    "contrato": "0480000000000000199111669920190508",
    "parcelas": [...]
  }
]
```

#### POST `/api/clientes/:id/compras`
Adiciona uma nova compra ao histórico de um cliente.

**Parâmetros:**
- `id` (number): ID do cliente

**Corpo da requisição:**
```json
{
  "valor": 500.00,
  "data": "2020-01-10",
  "contrato": "0480000000000000199111669920190508",
  "parcelas": [
    {
      "valorvencimento": 100.00,
      "datavencimento": "2020-02-10",
      "dataultimopagamento": "2020-02-10",
      "totalpago": 100.00,
      "capitalaberto": 0.00
    }
  ]
}
```

### Cálculo de Endividamento

#### POST `/api/endividamento/calcular`
Calcula o mês com maior endividamento em aberto para um cliente.

**Corpo da requisição:**
```json
{
  "cliente": {
    "id": 1,
    "nome": "João Silva",
    "cpf": "123.456.789-00",
    "email": "joao@email.com",
    "telefone": "11999999999",
    "endereco": {...},
    "historico_compras": [...]
  }
}
```

**Resposta:**
```json
{
  "mes": "04/2020",
  "total": 900.00
}
```

## Modelos de Dados

### Cliente
```typescript
interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  historico_compras: Compra[];
}
```

### Endereço
```typescript
interface Endereco {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}
```

### Compra
```typescript
interface Compra {
  id: number;
  valor: number;
  data: string; // formato YYYY-MM-DD
  contrato: string;
  parcelas: Parcela[];
}
```

### Parcela
```typescript
interface Parcela {
  valorvencimento: number;
  datavencimento: string; // formato YYYY-MM-DD
  dataultimopagamento: string; // formato YYYY-MM-DD
  totalpago: number;
  capitalaberto: number;
}
```

## Serviços

### EndividamentoService

Classe responsável por calcular o endividamento máximo de um cliente baseado no histórico de compras e pagamentos.

#### Método: `calcularEndividamentoMaximo(cliente: Cliente)`

**Descrição:**
Calcula o mês com maior endividamento em aberto para um cliente, considerando:
- Valor total das compras realizadas
- Pagamentos realizados nas parcelas
- Agrupamento por mês/ano

**Lógica:**
1. Processa todas as compras e pagamentos como eventos
2. Ordena os eventos cronologicamente
3. Calcula o saldo acumulado mês a mês
4. Identifica o mês com maior endividamento

**Retorno:**
```typescript
interface EndividamentoResult {
  mes: string; // formato MM/YYYY
  total: number;
}
```

## Testes

O projeto inclui testes unitários para o serviço de endividamento.

### Executar Testes
```bash
npm test
```

### Executar Testes em Modo Watch
```bash
npm run test:watch
```

### Casos de Teste
- Cenário simples com compra e pagamentos completos
- Cenário complexo com múltiplas compras e pagamentos parciais
- Cliente sem histórico de compras
- Datas fora de ordem cronológica

## Desenvolvimento

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor em modo de desenvolvimento
- `npm run build`: Compila o TypeScript para JavaScript
- `npm start`: Inicia o servidor em modo de produção
- `npm test`: Executa os testes
- `npm run test:watch`: Executa os testes em modo watch

### Configuração do TypeScript

O projeto utiliza as seguintes configurações principais:
- **Target**: ES2020
- **Module**: CommonJS
- **Strict mode**: Habilitado
- **Source maps**: Habilitado
- **Declaration files**: Gerados automaticamente

### Banco de Dados

Atualmente, o sistema utiliza um arquivo JSON (`src/db.json`) como banco de dados. Esta é uma solução simples adequada para desenvolvimento e testes.

**Funções disponíveis:**
- `readDB()`: Lê os dados do arquivo
- `writeDB(data)`: Escreve os dados no arquivo

### CORS

O servidor está configurado com CORS habilitado para aceitar requisições de qualquer origem, facilitando o desenvolvimento do frontend.

### Limite de Payload

O Express está configurado com limite de 50MB para requisições JSON e URL-encoded, permitindo o envio de dados de clientes com histórico extenso.

## Tratamento de Erros

A API inclui tratamento básico de erros:
- **400 Bad Request**: Dados inválidos na requisição
- **404 Not Found**: Cliente não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## ✅ Melhorias Implementadas

### ✅ Concluído
- ✅ Separação de responsabilidades (Controllers, Services, Middlewares)
- ✅ Sistema de autenticação JWT completo
- ✅ Validação de dados com Joi
- ✅ Tratamento de erros centralizado
- ✅ Autorização baseada em roles
- ✅ Padrão consistente de respostas da API
- ✅ Suporte a paginação
- ✅ Configurações centralizadas
- ✅ Documentação atualizada

## 🚀 Próximos Passos

Possíveis melhorias futuras para o backend:
- Migrar para um banco de dados relacional (PostgreSQL, MySQL)
- Adicionar logs estruturados com Winston
- Implementar cache com Redis
- Adicionar testes de integração
- Implementar rate limiting avançado
- Adicionar documentação da API com Swagger
- Implementar versionamento da API
- Adicionar monitoramento com métricas

---

Para mais informações sobre a API, consulte os arquivos de documentação na pasta `../api-docs/`.
