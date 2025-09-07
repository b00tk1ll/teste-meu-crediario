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
      <!-- Indicador de loading -->
      <div v-if="loading" class="text-center py-4">
        <p>Carregando clientes...</p>
      </div>
      
      <!-- Mensagem de erro -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
        <button @click="loadClientes" class="btn btn-sm btn-outline-danger ms-2">
          Tentar novamente
        </button>
      </div>
      
      <!-- Tabela de clientes -->
      <Table 
        v-else
        :columns="columns" 
        :data="clientes" 
        :actions="actions"
        @action="handleAction"
      />
    </div>
  </GridSystem>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import GridSystem from '../components/Layout/GridSystem.vue'
import Card from '../components/UI/Card.vue'
import Table from '../components/UI/Table.vue'
import Button from '../components/UI/Button.vue'
import { ClienteService, type Cliente } from '../services/clienteService'

// Estado da aplicação
const router = useRouter()
const clientes = ref<Cliente[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

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

// Carregar clientes da API
const loadClientes = async () => {
  loading.value = true
  error.value = null
  
  try {
    const data = await ClienteService.getClientes()
    clientes.value = data
  } catch (err) {
    error.value = 'Erro ao carregar clientes'
    console.error('Erro ao carregar clientes:', err)
  } finally {
    loading.value = false
  }
}

// Função para lidar com ações
const handleAction = async (actionKey: string, row: any, index: number) => {
  console.log('Ação:', actionKey, 'Linha:', row, 'Índice:', index)
  
  switch (actionKey) {
    case 'edit':
      console.log('Editando cliente:', row)
      // TODO: Implementar modal de edição
      break
    case 'delete':
      console.log('Excluindo cliente:', row)
      // Ja tem implementado o delete no Backend
      break
    case 'view':
      router.push(`/cliente/${row.id}`)
      break
  }
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

/* Melhorar responsividade da tabela */
@media (max-width: 576px) {
  /* Estilos removidos - agora gerenciados pelo componente Table */
}
</style>