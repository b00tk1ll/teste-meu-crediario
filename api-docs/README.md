# Documentação da API - Meu Crediário

Esta é a documentação completa da API do sistema **Meu Crediário** criada com o [Bruno](https://www.usebruno.com/), uma ferramenta open-source para testes e documentação de APIs.

## 📋 Visão Geral

A API do Meu Crediário oferece funcionalidades para gerenciamento de clientes e suas compras no sistema de crediário, incluindo cálculo de endividamento baseado no histórico financeiro.

### 🛠️ Tecnologias Utilizadas
- **Bruno**: Ferramenta de teste e documentação de APIs
- **Backend**: Node.js com TypeScript
- **Banco de Dados**: JSON (para desenvolvimento)

## 🧪 Bruno API Testing

Esta documentação utiliza o [Bruno](https://www.usebruno.com/), uma ferramenta open-source gratuita para testes de APIs.

### 📥 Onde Baixar
- **Site oficial**: https://www.usebruno.com/
- **GitHub**: https://github.com/usebruno/bruno
- **Instalação**: Disponível para Windows, macOS e Linux

> ℹ️ Para saber mais sobre como usar o Bruno nessa projeto, consulte o arquivo [`README.md`](/api-docs/README.md) na pasta /api-docs.


## 📚 Endpoints Disponíveis

### 👥 Gerenciamento de Clientes

| Endpoint | Método | Descrição | Seq |
|----------|--------|-----------|-----|
| `GET /api/clientes` | GET | Lista todos os clientes | 2 |
| `POST /api/clientes` | POST | Cria um novo cliente | 5 |
| `GET /api/clientes/{id}` | GET | Obtém cliente por ID | 3 |
| `PUT /api/clientes/{id}` | PUT | Atualiza dados do cliente | 4 |

### 🛒 Gerenciamento de Compras

| Endpoint | Método | Descrição | Seq |
|----------|--------|-----------|-----|
| `POST /api/compras` | POST | Adiciona nova compra | 7 |
| `GET /api/clientes/{id}/compras` | GET | Lista compras do cliente | 6 |

### 📊 Cálculos Financeiros

| Endpoint | Método | Descrição | Seq |
|----------|--------|-----------|-----|
| `POST /api/endividamento/calcular` | POST | Calcula nível de endividamento | 9 |

## 📝 Estrutura dos Dados

### Cliente
```json
{
  "id": 1,
  "nome": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao.silva@email.com",
  "telefone": "(11) 99999-9999",
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

### Compra
```json
{
  "id": 1,
  "valor": 1785.36,
  "data": "2019-05-08",
  "contrato": "0480000000000000000001669920190508",
  "parcelas": [...]
}
```

### Parcela
```json
{
  "valorvencimento": 148.78,
  "datavencimento": "2019-06-22",
  "dataultimopagamento": "2019-06-10",
  "totalpago": 148.78,
  "capitalaberto": 0
}
```

## 🔄 Fluxo de Testes Sugerido

Para testar a API de forma eficiente, siga esta sequência:

1. **Listar Clientes** - Verificar se há clientes cadastrados
2. **Criar Cliente** - Adicionar novo cliente (se necessário)
3. **Buscar Cliente por ID** - Verificar dados específicos
4. **Atualizar Cliente** - Modificar dados do cliente
5. **Adicionar Compra** - Registrar nova compra
6. **Listar Compras do Cliente** - Ver compras do cliente
7. **Calcular Endividamento** - Avaliar situação financeira

## ⚙️ Configuração

### Variáveis de Ambiente
- **Base URL**: `http://localhost:3001`
- **Content-Type**: `application/json`

### Autenticação
Atualmente, a API não requer autenticação para os endpoints testados.

## 🧪 Casos de Teste Incluídos

### Cenários de Sucesso
- ✅ Listagem de clientes existentes
- ✅ Criação de cliente com dados válidos
- ✅ Busca de cliente por ID válido
- ✅ Atualização de dados do cliente
- ✅ Adição de nova compra
- ✅ Listagem de compras por cliente
- ✅ Cálculo de endividamento

### Cenários de Erro (Futuros)
- ❌ Busca de cliente inexistente
- ❌ Criação com dados inválidos
- ❌ Atualização sem permissão

## 📊 Cobertura da API

Esta documentação cobre **100%** dos endpoints atualmente implementados na API do Meu Crediário:

- ✅ Clientes (CRUD completo)
- ✅ Compras (Create + Read por cliente)
- ✅ Endividamento (Cálculo financeiro)

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
api-docs/
├── bruno.json              # Configuração da coleção
├── README.md               # Esta documentação
├── Clientes.bru           # Lista todos os clientes
├── Cliente por ID.bru     # Busca cliente específico
├── Criar Cliente.bru      # Cadastra novo cliente
├── Atualizar Cliente.bru  # Atualiza dados do cliente
├── Compras Cliente.bru    # Lista compras do cliente
├── Adicionar Compra.bru   # Registra nova compra
└── Calcular Endividamento.bru # Calcula endividamento
```

### Convenções de Nomenclatura
- **Arquivos**: Nome descritivo em português + extensão `.bru`
- **Sequência**: Ordenação lógica dos testes (seq no meta)
- **URLs**: Padrão RESTful com recursos no plural

## 📞 Suporte

Para dúvidas sobre a API ou problemas com os testes:

1. Verifique se o backend está rodando em `http://localhost:3001`
2. Confirme se os dados de exemplo estão no banco
3. Execute os testes em sequência
4. Verifique os logs do backend para erros

## 📈 Melhorias Futuras

- [ ] Adicionar testes de autenticação/autorização
- [ ] Implementar cenários de erro
- [ ] Adicionar testes de performance
- [ ] Criar variáveis de ambiente dinâmicas
- [ ] Adicionar validações de schema
- [ ] Implementar testes automatizados no CI/CD
