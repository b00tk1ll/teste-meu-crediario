<template>
  <GridSystem>
    <!-- Header com título e botão -->
    <div class="col col-12">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Detalhes do(a) cliente</h2>
          <p>Visualização detalhada do cliente e histórico de compras</p>
        </div>
        <Button
          size="medium"
          variant="primary"
          icon="calculator"
          @click="calcularEndividamento"
          :disabled="loadingEndividamento || !cliente"
          :loading="loadingEndividamento"
        >
          Calcular Endividamento
        </Button>
      </div>
    </div>

    <!-- Loading overlay -->
    <Loading :show="loading" message="Carregando dados do cliente..." />

    <!-- Mensagem de erro geral -->
    <div v-if="error && !loading" class="col col-12">
      <div class="alert alert-danger alert-dismissible fade show">
        {{ error }}
        <button @click="error = null" class="btn-close" aria-label="Fechar"></button>
        <button @click="loadCliente" class="btn btn-sm btn-outline-danger ms-2">
          Tentar novamente
        </button>
      </div>
    </div>

    <!-- Resultado do cálculo de endividamento -->
    <div v-if="resultadoEndividamento" class="col col-12">
      <Card variant="success" class="mb-4"  closable @close="handleClose">
        <template #header>
          <h4 class="mb-0">Resultado do Cálculo</h4>
        </template>
        <div class="resultado-container">
          <div class="resultado-item">
            <strong>Mês de maior endividamento:</strong>
            <span class="resultado-valor">{{ resultadoEndividamento.mes }}</span>
          </div>
          <div class="resultado-item">
            <strong>Valor total:</strong>
            <span class="resultado-valor">R$ {{ formatarMoeda(resultadoEndividamento.total) }}</span>
          </div>
        </div>
      </Card>
    </div>

    <!-- Divider -->
    <!-- <div class="col col-12">
      <hr class="divider">
    </div> -->

    <!-- Dados do cliente -->
    <div class="col col-12">
      <div class="cliente-container">
        <!-- Avatar -->
        <div class="avatar-section">
          <div class="avatar">
            <i class="fas fa-user"></i>
          </div>
        </div>

        <!-- Dados do cliente -->
        <div class="dados-section">
          <div class="row">
            <div class="col col-6">
              <div class="form-group">
                <label>Nome:</label>
                <input type="text" :value="cliente?.nome" readonly class="form-control">
              </div>
            </div>
            <div class="col col-6">
              <div class="form-group">
                <label>Email:</label>
                <input type="email" :value="cliente?.email" readonly class="form-control">
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col col-6">
              <div class="form-group">
                <label>CPF:</label>
                <input type="text" :value="cliente?.cpf" readonly class="form-control">
              </div>
            </div>
            <div class="col col-6">
              <div class="form-group">
                <label>Telefone:</label>
                <input type="text" :value="cliente?.telefone" readonly class="form-control">
              </div>
            </div>
          </div>

          <!-- Endereço -->
          <div class="endereco-section">
            <h5>Endereço</h5>
            <div class="row">
              <div class="col col-8">
                <div class="form-group">
                  <label>Rua:</label>
                  <input type="text" :value="cliente?.endereco.rua" readonly class="form-control">
                </div>
              </div>
              <div class="col col-4">
                <div class="form-group">
                  <label>Número:</label>
                  <input type="text" :value="cliente?.endereco.numero" readonly class="form-control">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col col-6">
                <div class="form-group">
                  <label>Bairro:</label>
                  <input type="text" :value="cliente?.endereco.bairro" readonly class="form-control">
                </div>
              </div>
              <div class="col col-6">
                <div class="form-group">
                  <label>Cidade:</label>
                  <input type="text" :value="cliente?.endereco.cidade" readonly class="form-control">
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col col-6">
                <div class="form-group">
                  <label>Estado:</label>
                  <input type="text" :value="cliente?.endereco.estado" readonly class="form-control">
                </div>
              </div>
              <div class="col col-6">
                <div class="form-group">
                  <label>CEP:</label>
                  <input type="text" :value="cliente?.endereco.cep" readonly class="form-control">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="col col-12">
      <hr class="divider">
    </div>

    <!-- Histórico de compras -->
    <div class="col col-12">
      <div class="compras-section">
        <h4>Histórico de Compras</h4>

        <!-- Loading compras -->
        <div v-if="loadingCompras">
          <Loading :show="loadingCompras" message="Carregando histórico de compras..." />
        </div>

        <!-- Erro compras -->
        <div v-else-if="errorCompras" class="alert alert-danger alert-dismissible fade show">
          {{ errorCompras }}
          <button @click="errorCompras = null" class="btn-close" aria-label="Fechar"></button>
          <button @click="loadComprasCliente" class="btn btn-sm btn-outline-danger ms-2">
            Tentar novamente
          </button>
        </div>

        <!-- Tabela de compras -->
        <div v-else-if="compras.length > 0">
          <Table
            :columns="columnsCompras"
            :data="compras"
            :actions="actionsCompras"
            :sortableColumns="sortableColumnsCompras"
            :sortConfig="sortConfigCompras"
            @action="handleCompraAction"
          />
        </div>

        <!-- Mensagem quando não há compras -->
        <div v-else class="text-center py-5">
          <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Nenhuma compra encontrada</h5>
          <p class="text-muted">Este cliente ainda não possui histórico de compras.</p>
        </div>
      </div>
    </div>
  </GridSystem>

  <!-- Modal para detalhes da compra -->
  <div v-if="modalCompra.show" class="modal-overlay" @click="fecharModalCompra">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h5>Detalhes da Compra</h5>
        <button class="btn-close" @click="fecharModalCompra">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body" v-if="modalCompra.compra">
        <div class="compra-info">
          <!-- <div class="info-row">
            <strong>ID da Compra:</strong>
            <span>{{ modalCompra.compra.id }}</span>
          </div> -->
          <div class="info-row">
            <strong>Valor Total:</strong>
            <span>R$ {{ formatarMoeda(modalCompra.compra.valor) }}</span>
          </div>
          <div class="info-row">
            <strong>Data:</strong>
            <span>{{ formatarData(modalCompra.compra.data) }}</span>
          </div>
          <div class="info-row">
            <strong>Descrição:</strong>
            <span>{{ modalCompra.compra.contrato }}</span>
          </div>
        </div>

        <div class="parcelas-section">
          <h6>Parcelas</h6>
          <Table
            :columns="parcelasColumns"
            :data="modalCompra.compra.parcelas.map((parcela, index) => ({ ...parcela, numero: index + 1 }))"
            :show-pagination="false"
            :show-filters="false"
            :show-export="false"
            :actions="[]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import GridSystem from '../components/Layout/GridSystem.vue'
import Table from '../components/UI/Table.vue'
import Button from '../components/UI/Button.vue'
import Loading from '../components/UI/Loading.vue'
import { ClienteService, type Cliente, type Compra, type Parcela } from '../services/clienteService'
import Card from '../components/UI/Card.vue'

// Estado da aplicação
const route = useRoute()
const cliente = ref<Cliente | null>(null)
const compras = ref<Compra[]>([])
const loading = ref(false)
const loadingCompras = ref(false)
const loadingEndividamento = ref(false)
const error = ref<string | null>(null)
const errorCompras = ref<string | null>(null)
const resultadoEndividamento = ref<{ mes: string; total: number } | null>(null)

// Modal para compra
const modalCompra = ref({
  show: false,
  compra: null as Compra | null
})

// Funções de formatação
const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const formatarData = (data: string): string => {
  return new Date(data).toLocaleDateString('pt-BR')
}

// Colunas da tabela de compras
const columnsCompras = [
  { key: 'data', label: 'Data', formatter: (value: string) => formatarData(value) },
  { key: 'valor', label: 'Valor (R$)', formatter: (value: number) => formatarMoeda(value) },
  { key: 'contrato', label: 'Contrato' },
  {
    key: 'parcelas',
    label: 'Parcelas',
    formatter: (value: any[]) => `${value.length} parcelas`
  }
]

// Colunas da tabela de parcelas
const parcelasColumns = [
  { key: 'datavencimento', label: 'Vencimento', formatter: (value: string) => formatarData(value) },
  { key: 'valorvencimento', label: 'Valor (R$)', formatter: (value: number) => formatarMoeda(value) },
  { key: 'dataultimopagamento', label: 'Último Pagamento', formatter: (value: string) => formatarData(value) },
  { key: 'totalpago', label: 'Valor (R$)', formatter: (value: number) => formatarMoeda(value) },
  { key: 'capitalaberto', label: 'Capital Aberto', formatter: (value: number) => `R$ ${formatarMoeda(value)}` }
]

// Ações da tabela de compras
const actionsCompras = [
  { key: 'view', label: 'Visualizar', icon: 'eye', color: 'primary' as const }
]

// Configuração de campos ordenáveis (apenas valor e data)
const sortableColumnsCompras = ['valor', 'data']

// Configuração de ordenação personalizada
const sortConfigCompras = {
  valor: {
    type: 'number' as const
  },
  data: {
    type: 'date' as const
  }
}

// Configuração para tabela de parcelas
const sortableColumnsParcelas = ['numero', 'datavencimento', 'valorvencimento', 'dataultimopagamento', 'totalpago', 'capitalaberto']

const sortConfigParcelas = {
  numero: {
    type: 'number' as const
  },
  datavencimento: {
    type: 'date' as const
  },
  valorvencimento: {
    type: 'number' as const
  },
  dataultimopagamento: {
    type: 'date' as const
  },
  totalpago: {
    type: 'number' as const
  },
  capitalaberto: {
    type: 'number' as const
  }
}

// Carregar dados do cliente
const loadCliente = async () => {
  const clienteId = route.params.id as string
  if (!clienteId) return

  loading.value = true
  error.value = null

  try {
    const data = await ClienteService.getCliente(parseInt(clienteId))
    cliente.value = data
    await loadComprasCliente()
  } catch (err) {
    console.error('Erro ao carregar cliente:', err)
    error.value = err instanceof Error ? err.message : 'Erro ao carregar dados do cliente'
  } finally {
    loading.value = false
  }
}

// Carregar compras do cliente
const loadComprasCliente = async () => {
  const clienteId = route.params.id as string
  if (!clienteId) return

  loadingCompras.value = true
  errorCompras.value = null

  try {
    const comprasData = await ClienteService.getClienteCompras(parseInt(clienteId))
    compras.value = comprasData
  } catch (err) {
    console.error('Erro ao carregar compras:', err)
    errorCompras.value = err instanceof Error ? err.message : 'Erro ao carregar histórico de compras'
  } finally {
    loadingCompras.value = false
  }
}

// Calcular endividamento
const calcularEndividamento = async () => {
  if (!cliente.value) return

  loadingEndividamento.value = true
  error.value = null

  try {
    const resultado = await ClienteService.calcularEndividamento(cliente.value)
    resultadoEndividamento.value = resultado
  } catch (err) {
    console.error('Erro ao calcular endividamento:', err)
    error.value = err instanceof Error ? err.message : 'Erro ao calcular endividamento'
  } finally {
    loadingEndividamento.value = false
  }
}

const handleClose = () => {
  resultadoEndividamento.value = null
}

// Ações da tabela de compras
const handleCompraAction = (actionKey: string, row: Record<string, any>, index: number) => {
  if (actionKey === 'view') {
    modalCompra.value = {
      show: true,
      compra: row as Compra
    }
  }
}

// Fechar modal de compra
const fecharModalCompra = () => {
  modalCompra.value = {
    show: false,
    compra: null
  }
}

// Carregar dados quando o componente for montado
onMounted(() => {
  loadCliente()
})
</script>

<style scoped>
/* Resultado do cálculo */
.resultado-container {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.resultado-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.resultado-valor {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--secondary);
}

/* Divider */
.divider {
  border: none;
  border-top: 2px solid var(--gray-light);
  margin: 2rem 0;
}

/* Container do cliente */
.cliente-container {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  margin-top: var(--spacing-4);
}

/* Avatar */
.avatar-section {
  flex: 0 0 120px;
}

.avatar {
  width: 120px;
  height: 120px;
  /* border-radius: 50%; */
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 6px;
}

.avatar i {
  margin: 0;
}

/* Dados do cliente */
.dados-section {
  flex: 1;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-light);
  border-radius: 4px;
  background-color: var(--white-dark);
  color: var(--gray-dark);
  font-size: var(--font-size-sm);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  letter-spacing: var(--letter-spacing-normal);
  cursor: not-allowed;
  pointer-events: none;
  min-height: 35px;
  max-height: 35px;
  border-radius: 2px;
}

.form-control:focus {
  outline: none;
  border-color: var(--gray-light);
  box-shadow: none;
}

/* Seção de endereço */
.endereco-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-light);
}

.endereco-section h5 {
  color: var(--primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

/* Seção de compras */
.compras-section h4 {
  color: var(--primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background: white;
  border-radius: 2px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--gray-light);
}

.modal-header h5 {
  margin: 0;
  color: var(--primary);
  font-size: 1.25rem;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--gray);
  padding: 0.5rem;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background-color: var(--gray-lightest);
  color: var(--primary);
}

.modal-body {
  padding: 1.5rem;
}

/* Informações da compra */
.compra-info {
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--gray-lightest);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row strong {
  color: var(--primary);
  min-width: 150px;
}

.info-row span {
  color: var(--primary-dark);
  font-weight: 500;
}

/* Seção de parcelas */
.parcelas-section h6 {
  color: var(--primary);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}


/* Responsividade */
@media (max-width: 768px) {
  .cliente-container {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .avatar-section {
    flex: none;
  }

  .avatar {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }

  .resultado-container {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .resultado-valor {
    font-size: 1.25rem;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .parcela-header,
  .parcela-row {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .parcela-header span:nth-child(n+3),
  .parcela-row span:nth-child(n+3) {
    display: none;
  }

  .form-control {
    min-height: 35px;
    max-height: 35px;
    border-radius: 2px;
    color: var(--primary-lightest); /* Cor do texto diferente no celular pois testando no meu celular ficou ruim de ler se fosse a mesma cor do PC */
  }
}

@media (max-width: 576px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .parcela-header,
  .parcela-row {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
}

/* Estilos das mensagens */
.alert {
  border-radius: 8px;
  border: none;
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

/* Responsividade para o header */
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

  .spinner-border {
    width: 1.5rem;
    height: 1.5rem;
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
</style>
