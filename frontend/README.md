# Meu Crediário - Frontend

Sistema de gerenciamento de crediário desenvolvido com Vue.js 3, TypeScript e Vite. Parte do projeto de teste de Guilherme Robert Silveira Santos.

## 📋 Visão Geral

O frontend do **Meu Crediário** é uma aplicação web responsiva desenvolvida para facilitar o gerenciamento de clientes e vendas a prazo. Oferece uma interface intuitiva e moderna para:

- **Gerenciamento de Clientes**: Visualização e exclusão de clientes
- **Histórico de Compras**: Visualização detalhada do histórico de compras de cada cliente
- **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile

## 🏗️ Arquitetura e Tecnologias

### Tecnologias Principais

- **Vue.js 3**: Framework JavaScript reativo para construção de interfaces
- **TypeScript**: Superset tipado do JavaScript para maior segurança
- **Vite**: Build tool moderno e rápido para desenvolvimento
- **Vue Router 4**: Sistema de roteamento para navegação SPA
- **Pinia**: Gerenciamento de estado para Vue.js
- **FontAwesome**: Biblioteca de ícones vetoriais
- **XLSX**: Biblioteca para manipulação de arquivos Excel

### Estrutura de Arquivos

```
frontend/meu-crediario/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── BaseLayout.vue      # Layout principal da aplicação
│   │   │   └── GridSystem.vue      # Sistema de grid responsivo
│   │   └── UI/
│   │       ├── Button.vue          # Componente de botão reutilizável
│   │       ├── Card.vue            # Componente de cartão
│   │       ├── Loading.vue         # Indicador de carregamento
│   │       └── Table.vue           # Componente de tabela com ações
│   ├── views/
│   │   ├── Home.vue                # Página inicial
│   │   ├── Clientes.vue            # Listagem de clientes
│   │   ├── ClientDetails.vue       # Detalhes do cliente
│   │   ├── Vendas.vue              # Sistema de vendas
│   │   └── Relatorios.vue          # Relatórios
│   ├── services/
│   │   └── clienteService.ts       # Serviço de API para clientes
│   ├── router/
│   │   └── index.ts                # Configuração de rotas
│   ├── styles/
│   │   ├── colors.css              # Variáveis de cores
│   │   ├── global.css              # Estilos globais
│   │   ├── spacing.css             # Variáveis de espaçamento
│   │   └── typography.css          # Estilos tipográficos
│   ├── assets/
│   │   ├── icons/                  # Ícones personalizados
│   │   └── images/                 # Imagens da aplicação
│   ├── stores/                     # Stores do Pinia
│   ├── types.ts                    # Definições de tipos TypeScript
│   ├── App.vue                     # Componente raiz
│   └── main.ts                     # Ponto de entrada da aplicação
├── public/                         # Arquivos estáticos
├── tests/                          # Testes automatizados
├── cypress/                        # Testes end-to-end
├── package.json                    # Dependências e scripts
├── vite.config.ts                  # Configuração do Vite
└── tsconfig.json                   # Configuração do TypeScript
```

## 🎨 Sistema de Design

### Paleta de Cores

O sistema utiliza uma paleta de cores consistente baseada em variáveis CSS:

- **Primária**: Verde escuro (#006151) para elementos principais
- **Secundária**: Verde médio (#01865F) para ações complementares
- **Neutras**: Escalas de cinza para textos e fundos
- **Estados**: Cores específicas para sucesso, alerta, perigo e informação

### Componentes UI

#### BaseLayout
Layout principal com sidebar de navegação e área de conteúdo centralizada.

**Características:**
- Navegação lateral responsiva
- Logo da aplicação no topo da sidebar
- Área de conteúdo com largura máxima de 1024px
- Responsivo para mobile (sidebar horizontal)

#### GridSystem
Sistema de grid flexível baseado em 12 colunas.

**Uso:**
```vue
<GridSystem>
  <div class="col col-12">Full width</div>
  <div class="col col-6">Half width</div>
  <div class="col col-4">One third</div>
</GridSystem>
```

#### Button
Componente de botão reutilizável com variantes.

**Props:**
- `variant`: primary, secondary, success, danger, warning, info
- `size`: small, medium, large
- `icon`: nome do ícone FontAwesome
- `icon-position`: left, right
- `disabled`: boolean

#### Table
Componente de tabela com funcionalidades avançadas.

**Características:**
- Ordenação automática
- Formatação de colunas
- Ações por linha
- Responsivo para mobile
- Loading states

#### Card
Componente de cartão para agrupar conteúdo.

## 🔧 Funcionalidades Principais

### 1. Gerenciamento de Clientes

#### Listagem de Clientes
- Tabela responsiva com paginação
- Busca e filtros
- Ações rápidas (visualizar, editar, excluir)

#### Detalhes do Cliente
- Informações completas do cliente
- Endereço formatado
- Histórico de compras
- Calculo de mês de maior endividamento e valor disso

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run dev -- --host    # Inicia servidor acessível na rede

# Build e Produção
npm run build           # Gera build de produção
npm run preview         # Preview do build de produção

# Qualidade de Código
npm run lint            # Executa ESLint e Oxlint
npm run lint:eslint     # Executa apenas ESLint
npm run lint:oxlint     # Executa apenas Oxlint
npm run format          # Formata código com Prettier

# Testes
npm run test:unit       # Executa testes unitários (Vitest)
npm run test:e2e        # Executa testes E2E (Cypress)
npm run test:e2e:dev    # Testes E2E em modo desenvolvimento

# TypeScript
npm run type-check      # Verifica tipos TypeScript

# Preparação
npm run prepare         # Instala dependências do Cypress
```

## 🔌 Integração com Backend

### Configuração de Proxy

O Vite está configurado para fazer proxy das requisições `/api` para o backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### Serviço de Clientes

O `clienteService.ts` fornece métodos para:

- `getClientes()`: Buscar todos os clientes
- `getCliente(id)`: Buscar cliente específico
- `createCliente(cliente)`: Criar novo cliente
- `updateCliente(id, cliente)`: Atualizar cliente
- `deleteCliente(id)`: Excluir cliente

**Exemplo de uso:**
```typescript
import { ClienteService } from '@/services/clienteService'

// Buscar todos os clientes
const clientes = await ClienteService.getClientes()

// Buscar cliente específico
const cliente = await ClienteService.getCliente(123)
```

## 📱 Responsividade

A aplicação é totalmente responsiva e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout completo com sidebar lateral
- **Tablet**: Layout adaptado com sidebar menor
- **Mobile**: Sidebar horizontal no topo, componentes empilhados

### Breakpoints

- **> 1274px**: Layout desktop completo
- **1024px - 1274px**: Sidebar reduzida
- **768px - 1024px**: Sidebar horizontal
- **< 768px**: Layout mobile otimizado


## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js ^20.19.0 || >=22.12.0
- npm ou yarn

### Instalação

```bash
# Clonar repositório
git clone <repository-url>
cd frontend/meu-crediario

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```
### Code Style

- **ESLint**: Regras de linting configuradas
- **Prettier**: Formatação automática
- **TypeScript**: Tipagem estrita
- **Vue 3 Composition API**: Padrão para novos componentes

## 📦 Build e Deploy

### Build de Produção

```bash
# Build otimizado para produção
npm run build

# Preview do build
npm run preview
```

### Arquivos Gerados

- `dist/`: Diretório com arquivos otimizados
- `dist/index.html`: Arquivo HTML principal
- `dist/assets/`: CSS, JS e outros assets

### Deploy

A aplicação pode ser implantada em:

- **Netlify**: Deploy automático via Git
- **Vercel**: Plataforma otimizada para Vue.js
- **Servidor estático**: Nginx, Apache
- **CDN**: Cloudflare Pages, AWS S3

## 📄 Licença

Este projeto é parte de um teste técnico e não possui licença específica para distribuição.

---

**Desenvolvido por**: Guilherme Robert Silveira Santos

**Stack**: Vue.js 3 + TypeScript + Vite
