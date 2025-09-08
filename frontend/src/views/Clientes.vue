<template>
  <GridSystem>
    <div class="col col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Clientes</h2>
          <p>Gerenciamento de clientes do sistema</p>
        </div>
        <Button 
          size="medium" 
          variant="primary" 
          icon="plus"
          icon-position="left"
        >
          Novo Cliente
        </Button>
      </div>
    </div>
    
    <div class="col col-12">
      <!-- Mensagem de sucesso -->
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show">
        {{ successMessage }}
        <button @click="clearMessages" class="btn-close" aria-label="Fechar"></button>
      </div>

      <!-- Mensagem de erro -->
      <div v-if="error && !loading" class="alert alert-danger alert-dismissible fade show">
        {{ error }}
        <button @click="clearMessages" class="btn-close" aria-label="Fechar"></button>
        <button @click="loadClientes()" class="btn btn-sm btn-outline-danger ms-2">
          Tentar novamente
        </button>
      </div>

      <!-- Indicador de loading -->
      <div v-if="loading">
        <Loading :show="loading" message="Carregando clientes..." />
      </div>

      <!-- Tabela de clientes -->
      <div v-else-if="clientes.length > 0">
        <Table
          :columns="columns"
          :data="clientes"
          :actions="actions"
          :show-pagination="true"
          :show-filters="true"
          :show-export="true"
          :sortable-columns="sortableColumns"
          :sort-config="sortConfig"
          @action="handleAction"
        />
      </div>

      <!-- Mensagem quando não há clientes -->
      <div v-else class="text-center py-5">
        <i class="fas fa-users fa-3x text-muted mb-3"></i>
        <h5 class="text-muted">Nenhum cliente encontrado</h5>
        <p class="text-muted">Não há clientes cadastrados no sistema.</p>
      </div>
    </div>
  </GridSystem>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import GridSystem from '../components/Layout/GridSystem.vue'
import Card from '../components/UI/Card.vue'
import Table from '../components/UI/Table.vue'
import Button from '../components/UI/Button.vue'
import Loading from '../components/UI/Loading.vue'
import { ClienteService, type Cliente, type PaginatedResponse } from '../services/clienteService'

// Estado da aplicação
const router = useRouter()
const clientes = ref<Omit<Cliente, 'historico_compras' | 'endereco'>[]>([])
const loading = ref(false)
const loadingAction = ref<string | null>(null)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Função para formatar telefone
const formatarTelefone = (telefone: string): string => {
  if (!telefone) return '';

  // Remove todos os caracteres não numéricos
  const numeroLimpo = telefone.replace(/\D/g, '');

  // Verifica se tem pelo menos 10 ou 11 dígitos
  if (numeroLimpo.length < 10) return telefone;

  // Formato brasileiro: (XX) X XXXX-XXXX ou (XX) XXXX-XXXX
  if (numeroLimpo.length === 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 6)}-${numeroLimpo.substring(6)}`;
  } else if (numeroLimpo.length === 11) {
    // Telefone celular: (XX) X XXXX-XXXX
    return `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 3)} ${numeroLimpo.substring(3, 7)}-${numeroLimpo.substring(7)}`;
  }

  return telefone;
};

// Definição das colunas da tabela
const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'email', label: 'Email' },
  {
    key: 'telefone',
    label: 'Telefone',
    formatter: (value: string) => formatarTelefone(value)
  },
  { key: 'cpf', label: 'CPF' }
]

// Ações disponíveis
const actions = [
  { key: 'view', label: 'Visualizar', icon: 'eye', color: 'primary' as const },
  { key: 'edit', label: 'Editar', icon: 'edit', color: 'primary' as const },
  { key: 'delete', label: 'Excluir', icon: 'trash', color: 'danger' as const }
]

// Configurações de ordenação para o Table
const sortableColumns = ['nome', 'email', 'cpf']

const sortConfig = {
  nome: {
    type: 'string' as const
  },
  email: {
    type: 'string' as const
  },
  cpf: {
    type: 'string' as const
  }
}

// Carregar clientes da API
const loadClientes = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await ClienteService.getClientes(1, 1000) // Carregar muitos registros, o Table fará a paginação
    clientes.value = response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar clientes'
    console.error('Erro ao carregar clientes:', err)
  } finally {
    loading.value = false
  }
}

// Função para confirmar exclusão
const confirmDelete = (cliente: Record<string, any>): Promise<boolean> => {
  return new Promise((resolve) => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir o cliente "${cliente.nome}"?\n\nEsta ação não pode ser desfeita.`)
    resolve(confirmed)
  })
}

// Função para lidar com ações
const handleAction = async (actionKey: string, row: Record<string, any>, index: number) => {
  console.log('Ação:', actionKey, 'Linha:', row, 'Índice:', index)

  switch (actionKey) {
    case 'edit':
      console.log('Editando cliente:', row)
      // TODO: Implementar modal de edição
      break

    case 'delete':
      try {
        console.log('Excluindo cliente:', row)
        // const confirmed = await confirmDelete(row)
        // if (!confirmed) return

        // loadingAction.value = `delete-${row.id}`
        // error.value = null
        // successMessage.value = null

        // await ClienteService.deleteCliente(row.id)
        // successMessage.value = 'Cliente excluído com sucesso!'

        // // Recarregar os clientes
        // await loadClientes()

        // // Limpar mensagem de sucesso após 3 segundos
        // setTimeout(() => {
        //   successMessage.value = null
        // }, 3000)

      } catch (err) {
        error.value = err instanceof Error ? err.message : 'Erro ao excluir cliente'
        console.error('Erro ao excluir cliente:', err)
      } finally {
        loadingAction.value = null
      }
      break

    case 'view':
      router.push(`/cliente/${row.id}`)
      break
  }
}

// Função para limpar mensagens
const clearMessages = () => {
  error.value = null
  successMessage.value = null
}

// Carregar clientes quando o componente for montado
onMounted(() => {
  loadClientes()
})
</script>

<style scoped>
/* Responsividade para a página de Clientes */
@media (max-width: 768px) {
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .d-flex.justify-content-between > div:first-child {
    text-align: left;
  }
  
  .d-flex.justify-content-between > div:last-child {
    display: flex;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .d-flex.justify-content-between {
    gap: 0.75rem;
  }
  
  .d-flex.justify-content-between h2 {
    font-size: var(--font-size-h3);
  }
  
  .d-flex.justify-content-between p {
    font-size: var(--font-size-small);
  }
}

/* Estilos das mensagens */
.alert {
  border-radius: 8px;
  border: none;
}

.alert-success {
  background-color: #d1edff;
  color: #0c5460;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 1;
}

/* Loading state */
.spinner-border {
  width: 2rem;
  height: 2rem;
}

@media (max-width: 576px) {
  .spinner-border {
    width: 1.5rem;
    height: 1.5rem;
  }
}

/* Melhorar responsividade da tabela */
@media (max-width: 576px) {
  /* Estilos removidos - agora gerenciados pelo componente Table */
}
</style>