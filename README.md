# Meu Crediário

Esse projeto é dividido em duas partes principais: frontend (interface web) e backend (API REST), desenvolvidos como parte de um teste técnico para a empresa Meu Crediário.

## 📋 Visão Geral

O **Meu Crediário** é uma aplicação full-stack que permite:
- **Visualização de Clientes**: Lista todos os clientes em um tabela.
- **Histórico de Compras**: Visualização detalhada de todas as compras parceladas
- **Cálculo de Endividamento**: Análise automática do mês com maior endividamento e o valor disso
- **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile

## 🏗️ Arquitetura e Tecnologias

### Frontend
- **Vue.js 3** com Composition API
- **TypeScript** para tipagem estática
- **Vite** como bundler e servidor de desenvolvimento
- **Vue Router 4** para navegação SPA
- **Pinia** para gerenciamento de estado
- **FontAwesome** para ícones
- **XLSX** para manipulação de arquivos Excel

### Backend
- **Node.js** com **TypeScript**
- **Express** como framework web
- **Arquivo JSON** como banco de dados (simulação)
- **CORS** habilitado para desenvolvimento

### Funcionalidades Principais

#### 📊 Gerenciamento de Clientes
- Listagem completa de clientes
- Busca e filtros avançados

#### 💳 Controle de Compras
- Histórico detalhado de compras por cliente

#### 📈 Análise de Endividamento
- Cálculo automático do mês com maior endividamento e o valor disso.

## 🚀 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- **Node.js** (versão 14 ou superior, recomendado 20+)
- **npm** ou **yarn**
- **Git**

## 📦 Instalação e Execução

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd teste-meu-crediario
```

### 2. Configuração do Backend
```bash
cd backend
npm install
npm run dev
```
O backend ficará disponível em `http://localhost:3001`

### 3. Configuração do Frontend
```bash
cd ../frontend
npm install
npm run dev
```
O frontend ficará disponível em `http://localhost:5173`

### 4. Acesse a aplicação
Abra seu navegador e acesse `http://localhost:5173`

## 📁 Estrutura do Projeto

```
teste-meu-crediario/
├── api-docs/                 # Documentação da API
├── backend/                  # Servidor/API
│   ├── src/
│   │   ├── index.ts         # Ponto de entrada
│   │   ├── routes.ts        # Definições das rotas
│   │   ├── database.ts      # Funções de banco de dados
│   │   ├── types.ts         # Tipos TypeScript
│   │   ├── db.json          # Banco de dados JSON
│   │   └── services/
│   │       └── endividamentoService.ts
│   └── package.json
├── frontend/                 # Interface web
│   ├── src/
│   │   ├── components/      # Componentes Vue
│   │   │   ├── Layout/      # Layout da aplicação
│   │   │   └── UI/          # Componentes de interface
│   │   ├── views/           # Páginas da aplicação
│   │   ├── services/        # Serviços de API
│   │   ├── stores/          # Stores do Pinia
│   │   ├── styles/          # Estilos CSS
│   │   └── router/          # Configuração de rotas
│   └── package.json
└── README.md                # Esta documentação
```

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Compila TypeScript para JavaScript
npm start            # Inicia servidor em produção
npm test             # Executa testes unitários
npm run test:watch   # Executa testes em modo watch
```

### Frontend
```bash
npm run dev              # Inicia servidor de desenvolvimento
npm run build           # Gera build de produção
npm run preview         # Preview do build de produção
npm run lint            # Executa ESLint e Oxlint
npm run test:unit       # Executa testes unitários (Vitest)
npm run test:e2e        # Executa testes E2E (Cypress)
npm run type-check      # Verifica tipos TypeScript
```

## 🌐 API Endpoints

### Clientes

#### GET `/api/clientes`
Lista todos os clientes (dados básicos para otimização).
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
Retorna cliente específico com todos os dados.
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

#### PUT `/api/clientes/:id`
Atualiza cliente existente.

#### DELETE `/api/clientes/:id`
Remove um cliente.

### Compras

#### GET `/api/clientes/:id/compras`
Retorna histórico de compras de um cliente.

#### POST `/api/clientes/:id/compras`
Adiciona nova compra ao histórico.

### Análise

#### POST `/api/endividamento/calcular`
Calcula o mês com maior endividamento.
```json
{
  "cliente": {
    "id": 1,
    "nome": "João Silva",
    // ... outros dados
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

## 🎨 Sistema de Design

### Paleta de Cores
- **Primária**: Verde escuro (#006151)
- **Secundária**: Verde médio (#01865F)
- **Neutras**: Escalas de cinza
- **Estados**: Cores para sucesso, alerta, perigo e informação

### Componentes UI
- **BaseLayout**: Layout principal com sidebar responsiva
- **GridSystem**: Sistema de grid flexível (12 colunas)
- **Button**: Componente de botão reutilizável
- **Card**: Componente para agrupar conteúdo
- **Table**: Tabela com funcionalidades avançadas
- **Loading**: Indicador de carregamento

## 📱 Responsividade

A aplicação é totalmente responsiva:
- **Desktop** (> 1274px): Layout completo com sidebar lateral
- **Tablet** (1024px - 1274px): Sidebar reduzida
- **Mobile** (< 768px): Sidebar horizontal no topo

## 🔒 Tratamento de Erros

### Backend
- **400 Bad Request**: Dados inválidos
- **404 Not Found**: Cliente não encontrado
- **500 Internal Server Error**: Erro interno

### Frontend
- Tratamento de erros de rede
- Estados de loading
- Mensagens de erro amigáveis

## 🧪 Testes

### Backend
- Testes unitários para serviço de endividamento
- Cobertura de cenários diversos

### Frontend
- Testes unitários com Vitest (Não implementado)
- Testes end-to-end com Cypress (Não implementado)

## 📄 Licença

Este projeto é parte de um teste técnico e não possui licença específica para distribuição.

---

**Desenvolvido por**: Guilherme Robert Silveira Santos

**Stack**: Vue.js 3 + TypeScript + Vite (Frontend) | Node.js + Express + TypeScript (Backend)
