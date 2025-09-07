<template>
  <div class="table-container">
    <!-- Barra de ferramentas -->
    <div v-if="showFilters || showExport" class="table-toolbar">
      <div v-if="showFilters" class="search-container">
        <div class="search-input-container">
          <input
            v-model="searchTerm"
            type="text"
            :placeholder="isSearchFocused || searchTerm ? '' : 'Pesquisar...'"
            class="search-input"
            @input="handleSearch"
            @focus="isSearchFocused = true"
            @blur="handleSearchBlur"
          />
          <i
            class="fas fa-search search-icon"
            :class="{ 'focused': isSearchFocused }"
          ></i>
        </div>
      </div>

      <!-- Linha de ordenação e exportação -->
      <div v-if="showFilters || showExport" class="sort-export-row">
        <!-- Dropdown de ordenação -->
        <div v-if="showFilters" class="sort-container">
          <div class="select-wrapper">
            <select v-model="sortBy" @change="handleSort" class="sort-select">
              <option value="">Ordenar por...</option>
              <option
                v-for="column in sortableColumns"
                :key="column.key"
                :value="column.key"
              >
                {{ column.label }}
              </option>
            </select>
            <i class="fas fa-chevron-down select-icon"></i>
          </div>
          <div v-if="sortBy" class="sort-direction">
            <button
              @click="toggleSortDirection"
              class="sort-button"
              :class="{ 'asc': sortDirection === 'asc', 'desc': sortDirection === 'desc' }"
            >
              <i :class="sortDirection === 'asc' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            </button>
          </div>
        </div>

        <div v-if="showExport" class="export-container">
          <Button
            variant="secondary"
            size="medium"
            icon="file-export"
            @click="handleExport"
          >
            Exportar
          </Button>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="table-wrapper" ref="tableWrapper">
      <div class="scroll-indicator left" v-if="showScrollLeft" @click="scrollTable('left')">
        <i class="fas fa-chevron-left"></i>
      </div>
      <div class="scroll-indicator right" v-if="showScrollRight" @click="scrollTable('right')">
        <i class="fas fa-chevron-right"></i>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key" class="table-header">
              {{ column.label }}
            </th>
            <th class="table-header actions-header"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paginatedData" :key="index" class="table-row">
            <td v-for="column in columns" :key="column.key" class="table-cell">
              {{ column.formatter ? column.formatter(row[column.key]) : row[column.key] }}
            </td>
            <td class="table-cell actions-cell" v-if="actions.length > 0">
              <div class="actions-container">
                <button 
                  @click="toggleDropdown(index, $event)"
                  class="action-button"
                  type="button"
                >
                  <i class="fas fa-ellipsis-v"></i>
                </button>
                <div 
                  v-if="activeDropdown === index" 
                  class="dropdown-menu"
                  :data-dropdown-index="index"
                  @click.stop
                >
                  <div 
                    v-for="action in actions" 
                    :key="action.key"
                    class="dropdown-item"
                    :style="{ 
                      backgroundColor: 'var(--white)',
                      color: getActionColors(action.color).text
                    }"
                    @click="handleAction(action.key, row, index)"
                  >
                    <i 
                      :class="`fas fa-${action.icon}`"
                      :style="{ color: getActionColors(action.color).icon }"
                    ></i>
                    {{ action.label }}
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Layout de cartões para mobile -->
      <div class="mobile-cards">
        <div 
          v-for="(row, index) in paginatedData" 
          :key="index" 
          class="mobile-card"
        >
          <!-- Botão de ação no canto superior esquerdo -->
          <div class="card-header">
            <div class="actions-container">
              <button 
                @click="toggleDropdown(index, $event)"
                class="action-button"
                type="button"
              >
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <div 
                v-if="activeDropdown === index" 
                class="dropdown-menu"
                :data-dropdown-index="index"
                @click.stop
              >
                <div 
                  v-for="action in actions" 
                  :key="action.key"
                  class="dropdown-item"
                  :style="{ 
                    backgroundColor: 'var(--white)',
                    color: getActionColors(action.color).text
                  }"
                  @click="handleAction(action.key, row, index)"
                >
                  <i 
                    :class="`fas fa-${action.icon}`"
                    :style="{ color: getActionColors(action.color).icon }"
                  ></i>
                  {{ action.label }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="card-content">
            <div
              v-for="column in columns"
              :key="column.key"
              class="card-field"
            >
              <span class="field-label">{{ column.label }}:</span>
              <span class="field-value">{{ column.formatter ? column.formatter(row[column.key]) : row[column.key] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginação -->
    <div v-if="showPagination" class="pagination-container">
      <div class="items-per-page">
        <div class="select-wrapper">
          <select v-model="itemsPerPage" @change="handleItemsPerPageChange" class="items-select">
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <i class="fas fa-chevron-down select-icon"></i>
        </div>
      </div>

      <div class="pagination-section">
        <div class="pagination-info">
          {{ paginationInfo }}
        </div>

        <div class="pagination-controls">
          <Button
            variant="secondary"
            size="small"
            icon="chevron-left"
            @click="previousPage"
            :disabled="currentPage === 1"
            class="pagination-button"
          />
          <Button
            variant="secondary"
            size="small"
            icon="chevron-right"
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="pagination-button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import * as XLSX from 'xlsx'
import Button from './Button.vue'

// Props
interface Column {
  key: string
  label: string
  formatter?: (value: any) => string
}

interface SortConfig {
  [key: string]: {
    type: 'string' | 'number' | 'date' | 'custom'
    customSort?: (a: any, b: any) => number
  }
}

interface Action {
  key: string
  label: string
  icon: string
  color?: 'primary' | 'secondary' | 'info' | 'success' | 'alert' | 'danger'
}

interface Props {
  columns: Column[]
  data: Record<string, any>[]
  actions?: Action[]
  showPagination?: boolean
  showFilters?: boolean
  showExport?: boolean
  sortableColumns?: string[]
  sortConfig?: SortConfig
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [
    { key: 'edit', label: 'Editar', icon: 'edit', color: 'primary' },
    { key: 'delete', label: 'Excluir', icon: 'trash', color: 'danger' }
  ],
  showPagination: true,
  showFilters: true,
  showExport: true
})

// Emits
const emit = defineEmits<{
  action: [actionKey: string, row: Record<string, any>, index: number]
}>()

// Estado reativo
const searchTerm = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const activeDropdown = ref<number | null>(null)
const tableWrapper = ref<HTMLElement | null>(null)
const showScrollLeft = ref(false)
const showScrollRight = ref(false)
const isSearchFocused = ref(false)

// Estado para ordenação
const sortBy = ref('')
const sortDirection = ref<'asc' | 'desc'>('asc')

// Referências para as props
const showPagination = computed(() => props.showPagination)
const showFilters = computed(() => props.showFilters)
const showExport = computed(() => props.showExport)

// Colunas que podem ser ordenadas
const sortableColumns = computed(() => {
  if (!props.sortableColumns || props.sortableColumns.length === 0) {
    return props.columns // Se não especificado, permite ordenar todas
  }
  return props.columns.filter(column => props.sortableColumns!.includes(column.key))
})

// Função para obter cores de uma ação específica
const getActionColors = (color: string = 'primary') => {
  const colorMap = {
    primary: {
      icon: 'var(--primary-lightest)',
      text: 'var(--primary)'
    },
    secondary: {
      icon: 'var(--secondary-light)',
      text: 'var(--secondary)'
    },
    info: {
      icon: 'var(--info-lightest)',
      text: 'var(--info)'
    },
    success: {
      icon: 'var(--success-lightest)',
      text: 'var(--success)'
    },
    alert: {
      icon: 'var(--alert-lightest)',
      text: 'var(--alert)'
    },
    danger: {
      icon: 'var(--danger-lightest)',
      text: 'var(--danger)'
    }
  }
  
  return colorMap[color as keyof typeof colorMap] || colorMap.primary
}

// Dados ordenados primeiro
const sortedData = computed(() => {
  let data = [...props.data]

  // Aplicar ordenação primeiro em todos os dados
  if (sortBy.value) {
    data.sort((a, b) => {
      const sortConfig = props.sortConfig?.[sortBy.value]

      if (sortConfig) {
        // Usar configuração personalizada de ordenação
        const aValue = a[sortBy.value]
        const bValue = b[sortBy.value]

        let comparison = 0

        switch (sortConfig.type) {
          case 'string':
            comparison = String(aValue).localeCompare(String(bValue), 'pt-BR', { sensitivity: 'base' })
            break
          case 'number':
            comparison = Number(aValue) - Number(bValue)
            break
          case 'date':
            const dateA = new Date(aValue)
            const dateB = new Date(bValue)
            comparison = dateA.getTime() - dateB.getTime()
            break
          case 'custom':
            if (sortConfig.customSort) {
              comparison = sortConfig.customSort(aValue, bValue)
            }
            break
          default:
            // Fallback para ordenação por string
            comparison = String(aValue).localeCompare(String(bValue), 'pt-BR', { sensitivity: 'base' })
        }

        return sortDirection.value === 'asc' ? comparison : -comparison
      } else {
        // Lógica de ordenação padrão (usando formatter)
        let aValue = a[sortBy.value]
        let bValue = b[sortBy.value]

        // Usar formatter se disponível para ordenação
        const column = props.columns.find(col => col.key === sortBy.value)
        if (column?.formatter) {
          aValue = column.formatter(aValue)
          bValue = column.formatter(bValue)
        }

        // Comparação inteligente para diferentes tipos de dados
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue, 'pt-BR', { sensitivity: 'base' })
          return sortDirection.value === 'asc' ? comparison : -comparison
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection.value === 'asc' ? aValue - bValue : bValue - aValue
        }

        // Para outros tipos, converter para string
        const aStr = String(aValue).toLowerCase()
        const bStr = String(bValue).toLowerCase()
        const comparison = aStr.localeCompare(bStr, 'pt-BR', { sensitivity: 'base' })
        return sortDirection.value === 'asc' ? comparison : -comparison
      }
    })
  }

  return data
})

// Dados filtrados após ordenação
const filteredData = computed(() => {
  let data = [...sortedData.value]

  // Aplicar filtro de pesquisa usando valores formatados
  if (searchTerm.value) {
    data = data.filter(row => {
      // Criar uma string com todos os valores formatados da linha
      const formattedValues = props.columns.map(column => {
        const value = row[column.key]
        return column.formatter ? column.formatter(value) : String(value)
      }).join(' ').toLowerCase()

      return formattedValues.includes(searchTerm.value.toLowerCase())
    })
  }

  return data
})

// Paginação
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / itemsPerPage.value)
})

const paginatedData = computed(() => {
  if (!showPagination.value) {
    return filteredData.value
  }
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredData.value.slice(start, end)
})

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(currentPage.value * itemsPerPage.value, filteredData.value.length)
  const total = filteredData.value.length
  return `${start}-${end} de ${total} itens`
})


// Função de pesquisa
const handleSearch = () => {
  currentPage.value = 1 // Reset para primeira página ao pesquisar
}

// Função para lidar com o blur do campo de pesquisa
const handleSearchBlur = () => {
  // Só remove o foco se não há texto digitado
  if (!searchTerm.value.trim()) {
    isSearchFocused.value = false
  }
}

// Função de ordenação
const handleSort = () => {
  if (!sortBy.value) {
    sortDirection.value = 'asc'
  }
  currentPage.value = 1 // Reset para primeira página ao ordenar
}

// Função para alternar direção da ordenação
const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

// Função de exportação
const handleExport = () => {
  try {
    // Criar workbook
    const wb = XLSX.utils.book_new()

    // Preparar dados com formatação
    const dadosFormatados = filteredData.value.map(row => {
      const formattedRow: any = {}
      props.columns.forEach(column => {
        formattedRow[column.label] = column.formatter ? column.formatter(row[column.key]) : row[column.key]
      })
      return formattedRow
    })

    // Converter dados para worksheet
    const ws = XLSX.utils.json_to_sheet(dadosFormatados)

    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Dados')

    // Gerar nome do arquivo com timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `export_${timestamp}.xlsx`

    // Fazer download
    XLSX.writeFile(wb, filename)
  } catch (error) {
    console.error('Erro ao exportar arquivo:', error)
    alert('Erro ao exportar arquivo. Tente novamente.')
  }
}

// Controle de dropdown
const toggleDropdown = (index: number, event: MouseEvent) => {
  event.stopPropagation()
  
  if (activeDropdown.value === index) {
    activeDropdown.value = null
  } else {
    activeDropdown.value = index
    
        // Posicionar dropdown no desktop (telas maiores que 768px)
        if (window.innerWidth > 768) {
          nextTick(() => {
            const dropdown = document.querySelector(`[data-dropdown-index="${index}"]`) as HTMLElement
            if (dropdown) {
              const button = event.currentTarget as HTMLElement
              const rect = button.getBoundingClientRect()
              
              // Posicionar abaixo do botão, alinhado à direita
              dropdown.style.top = `${rect.bottom + 4}px`
              dropdown.style.left = `${rect.right - dropdown.offsetWidth}px`
              dropdown.style.width = 'auto'
              dropdown.style.minWidth = '120px'
              dropdown.style.maxWidth = '200px'
            }
          })
        }
  }
}

const closeDropdown = () => {
  activeDropdown.value = null
}

// Ações do dropdown
const handleAction = (actionKey: string, row: Record<string, any>, index: number) => {
  emit('action', actionKey, row, index)
  closeDropdown()
}

// Controles de paginação
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handleItemsPerPageChange = () => {
  currentPage.value = 1 // Reset para primeira página ao mudar itens por página
}


// Função para verificar scroll da tabela
const checkScrollIndicators = () => {
  if (!tableWrapper.value) return
  
  const { scrollLeft, scrollWidth, clientWidth } = tableWrapper.value
  showScrollLeft.value = scrollLeft > 0
  showScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1
}

// Função para scroll suave
const scrollTable = (direction: 'left' | 'right') => {
  if (!tableWrapper.value) return
  
  const scrollAmount = 200
  const currentScroll = tableWrapper.value.scrollLeft
  const targetScroll = direction === 'left' 
    ? currentScroll - scrollAmount 
    : currentScroll + scrollAmount
    
  tableWrapper.value.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  })
}

// Fechar dropdown ao clicar fora
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.actions-container') && !target.closest('.dropdown-menu')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Adicionar listener para scroll da tabela
  if (tableWrapper.value) {
    tableWrapper.value.addEventListener('scroll', checkScrollIndicators)
    // Verificar indicadores inicialmente
    nextTick(() => {
      checkScrollIndicators()
    })
  }
  
  // Verificar indicadores quando a janela redimensionar
  window.addEventListener('resize', checkScrollIndicators)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  
  if (tableWrapper.value) {
    tableWrapper.value.removeEventListener('scroll', checkScrollIndicators)
  }
  
  window.removeEventListener('resize', checkScrollIndicators)
})
</script>

<style scoped>
.table-container {
  width: 100%;
  background: transparent;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  gap: 16px;
}

.search-container {
  flex: 2;
  max-width: 400px;
  min-width: 250px;
}

.sort-export-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.sort-container {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  min-width: 200px;
}

.sort-select {
  padding: 0 25px 0 10px;
  border: 1px solid var(--gray-light);
  border-radius: 2px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  color: var(--primary);
  font-weight: 500;
  height: 35px;
  min-height: 35px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  outline: none;
  transition: border-color 0.2s ease;
  min-width: 150px;
}

.sort-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.sort-select:hover {
  border-color: var(--gray-light);
}

.sort-direction {
  display: flex;
  align-items: center;
}

.sort-button {
  border: 1px solid var(--gray-light);
  background: white;
  color: var(--primary);
  cursor: pointer;
  padding: 8px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 35px;
  transition: all 0.2s ease;
  outline: none;
}

.sort-button:hover {
  background: var(--gray-lightest);
  border-color: var(--gray-light);
}

.sort-button.asc i {
  color: var(--success);
}

.sort-button.desc i {
  color: var(--primary);
}

.sort-button i {
  font-size: 12px;
  transition: color 0.2s ease;
}

.search-input-container {
  position: relative;
  width: 100%;
}

.search-input {
  height: 35px;
  width: 100%;
  padding: 8px 40px 8px 12px;
  border: 1px solid var(--gray-light);
  border-radius: 4px;
  font-size: var(--font-size-sm);
  background: white;
  transition: all 0.2s ease;
  border-radius: 2px;
  color: var(--primary);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-normal);
  caret-color: var(--text);
}

.search-input::placeholder {
  color: var(--gray-dark);
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
}

.search-input:focus {
  outline: none;
  border-color: var(--info);
  box-shadow: 0 0 0 2px rgba(0, 102, 171, 0.1);
}


.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary-lightest);
  font-size: 14px;
  pointer-events: none;
  transition: color 0.2s ease;
}

.search-icon.focused {
  color: var(--primary);
}

.export-container {
  display: flex;
  align-items: center;
  margin-left: auto;
}


.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background: transparent;
  margin-top: 15px;
  position: relative;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}

.table-header {
  background-color: #F1F6F5;
  color: #333;
  font-weight: 600;
  text-transform: uppercase;
  padding: 6px 20px;
  text-align: left;
  font-size: 12px;
  letter-spacing: 0.5px;
  height: 30px;
  box-sizing: border-box;
}

.table-row {
  background: transparent;
  transition: background-color 0.2s ease;
}

.table-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.table-cell {
  padding: 12px 20px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: var(--primary);
}


/* Ações */
.actions-header {
  width: 30px;
  text-align: center;
}

.actions-cell {
  text-align: center;
  width: 30px;
  padding-right: 10px;
}

.actions-container {
  position: relative;
  display: inline-block;
}

.action-button {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  outline: none !important;
  color: var(--primary-lightest);
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  pointer-events: auto;
}

.action-button:hover {
  background: var(--gray-lightest) !important;
  color: var(--primary);
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.action-button:focus {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
  color: var(--primary);
  background: var(--gray-lightest) !important;
}

.action-button:active {
  background: var(--gray-light) !important;
  color: var(--primary);
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.action-button:focus-visible {
  outline: 2px solid var(--primary) !important;
  outline-offset: 2px !important;
}

.action-button i {
  color: #8CBFB7;
  font-size: 16px;
  transition: color 0.2s ease;
  pointer-events: none;
}

.action-button:hover i {
  color: var(--primary);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--white); 
  border: 1px solid var(--gray-light);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 120px;
  overflow: hidden;
  margin-top: 4px;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--gray-lightest);
}

.dropdown-item i {
  width: 16px;
  text-align: center;
}

/* Paginação */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding: 20px 0;
  margin-bottom: var(--spacing-4);
}

.items-per-page {
  display: flex;
  align-items: center;
  gap: 5px;
}

.items-per-page label {
  font-size: 12px;
  color: var(--primary);
  /* white-space: nowrap; */
}

.select-wrapper {
  position: relative;
  display: inline-block;
}

.items-select {
  padding: 0 25px 0 10px;
  border: 1px solid var(--gray-light);
  border-radius: 4px;
  font-size: 12px;
  background: white;
  cursor: pointer;
  color: var(--primary);
  font-weight: 500;
  height: 30px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  outline: none;
  transition: none;
}

.items-select:focus {
  border: 1px solid var(--gray-light);
  outline: none;
  box-shadow: none;
}

.items-select:hover {
  border: 1px solid var(--gray-light);
}

.select-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary);
  font-size: 10px;
  pointer-events: none;
}

.pagination-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pagination-info {
  font-size: 14px;
  color: var(--primary);
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  gap: 5px;
}

.pagination-button {
  padding: 6px 10px !important;
  border: 1px solid var(--gray-light) !important;
  gap: 5px !important;
  height: 30px !important;
}

.pagination-button i {
  color: var(--primary) !important;
  font-size: 10px !important;
}

/* Indicadores de scroll */
.scroll-indicator {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.scroll-indicator:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.9);
}

.scroll-indicator.left {
  left: 10px;
}

.scroll-indicator.right {
  right: 10px;
}

.scroll-indicator i {
  font-size: 12px;
}

/* Layout de cartões para mobile */
.mobile-cards {
  display: none;
}

.mobile-card {
  background: var(--white);
  border: 1px solid var(--gray-light);
  border-radius: 2px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  position: relative;
}

.mobile-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.card-header {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.card-content {
  margin-top: 8px;
}

.card-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--gray-lightest);
}

.card-field:last-child {
  border-bottom: none;
}

.field-label {
  font-weight: 600;
  color: var(--primary);
  font-size: 14px;
  min-width: 80px;
}

.field-value {
  color: var(--primary-dark);
  font-size: 14px;
  text-align: right;
  flex: 1;
  margin-left: 12px;
  word-break: break-word;
}

/* Alinhamento específico para mobile */
@media (max-width: 768px) {
  .field-value {
    text-align: left;
    margin-left: 0;
  }
}

/* Removido - card-actions não é mais usado */


/* Desktop - z-index mais alto e posicionamento fixo para evitar corte */
@media (min-width: 769px) {
  .dropdown-menu {
    z-index: 99999;
    position: fixed !important;
    width: auto !important;
    min-width: 120px !important;
    max-width: 120px !important;
    white-space: nowrap;
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-container {
    width: 100%;
    max-width: none;
    margin-bottom: 8px;
  }

  .sort-export-row {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  .sort-container {
    display: flex;
    gap: 8px;
    flex: 1;
    min-width: 180px;
  }

  .sort-select {
    flex: 1;
    min-width: 120px;
    font-size: 12px;
    height: 35px;
  }

  .export-container {
    display: flex;
    flex-shrink: 0;
    margin-left: auto;
  }
  
  .pagination-container {
    flex-direction: row;
    gap: 12px;
    align-items: center;
  }
  
  .items-per-page {
    justify-content: flex-start;
  }
  
  .pagination-section {
    justify-content: flex-end;
    flex-direction: row;
    gap: 16px;
  }
  
  .pagination-info {
    text-align: left;
  }
  
  .pagination-controls {
    justify-content: flex-end;
  }
  
  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .data-table {
    min-width: 600px;
  }
  
  /* Layout de cartões para mobile */
  .table-wrapper {
    overflow: visible;
  }
  
  .data-table {
    display: none;
  }
  
  .mobile-cards {
    display: block;
  }
  
  /* Mobile - dropdown com posicionamento absoluto */
  .dropdown-menu {
    position: absolute !important;
    z-index: 9999;
  }
}

@media (max-width: 576px) {
  .table-toolbar {
    gap: 10px;
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    width: 100%;
  }

  .sort-export-row {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  .sort-container {
    display: flex;
    gap: 8px;
    flex: 1;
    min-width: 180px;
  }

  .sort-select {
    flex: 1;
    min-width: 100px;
    font-size: 12px;
    height: 32px;
  }

  .sort-button {
    height: 32px;
    width: 32px;
  }

  .export-container {
    display: flex;
    flex-shrink: 0;
    margin-left: auto;
  }
  
  .search-input {
    font-size: 16px; /* Previne zoom no iOS */
    padding: 8px 40px 8px 12px;
  }

  .search-icon {
    font-size: 13px;
    right: 12px;
  }
  
  .table-cell {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .table-header {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  .data-table {
    min-width: 500px;
  }
  
  .pagination-container {
    gap: 10px;
    flex-direction: row;
    align-items: center;
  }
  
  .items-select {
    font-size: 14px;
    padding: 0 25px 0 8px;
    height: 32px;
  }
  
  .select-icon {
    right: 10px;
    font-size: 12px;
  }
  
  .pagination-info {
    font-size: 13px;
  }
  
  /* Melhorias para cartões mobile */
  .mobile-card {
    padding: 12px;
    margin-bottom: 12px;
  }
  
  .card-field {
    padding: 6px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .field-label {
    font-size: 12px;
    min-width: auto;
    color: var(--primary-light);
    text-align: left;
  }
  
  .field-value {
    font-size: 14px;
    text-align: left;
    margin-left: 0;
    font-weight: 500;
    width: 100%;
  }
  
  /* Removido - card-actions não é mais usado */
  
  /* Dropdown específico para mobile */
  .dropdown-menu {
    min-width: 140px;
    font-size: 14px;
    right: 0;
    left: auto;
  }
  
  .dropdown-item {
    padding: 8px 12px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .table-toolbar {
    gap: 8px;
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    width: 100%;
  }

  .sort-export-row {
    display: flex;
    gap: 8px;
    width: 100%;
  }

  .sort-container {
    display: flex;
    gap: 8px;
    flex: 1;
    min-width: 180px;
  }

  .sort-select {
    flex: 1;
    min-width: 80px;
    font-size: 11px;
    height: 30px;
  }

  .sort-button {
    height: 30px;
    width: 30px;
  }

  .export-container {
    display: flex;
    flex-shrink: 0;
    margin-left: auto;
  }
  
  .search-input {
    padding: 10px 40px 10px 12px;
  }

  .search-input::placeholder {
    color: var(--primary-lightest); /* Cor do texto diferente no celular pois testando no meu celular ficou ruim de ler se fosse a mesma cor do PC */
  }

  .search-icon {
    font-size: 12px;
    right: 10px;
  }
  
  .table-cell {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .table-header {
    padding: 5px 10px;
    font-size: 10px;
  }
  
  .data-table {
    min-width: 450px;
  }
  
  .dropdown-menu {
    min-width: 100px;
  }
  
  .dropdown-item {
    padding: 5px 8px;
    font-size: 13px;
  }
  
  .items-select {
    font-size: 13px;
    padding: 0 22px 0 6px;
    height: 30px;
  }
  
  .select-icon {
    right: 10px;
    font-size: 10px;
  }
  
  /* Indicadores de scroll para mobile */
  .scroll-indicator {
    width: 25px;
    height: 25px;
  }
  
  .scroll-indicator.left {
    left: 5px;
  }
  
  .scroll-indicator.right {
    right: 5px;
  }
  
  .scroll-indicator i {
    font-size: 10px;
  }
}

/* Garantir que margin-bottom seja aplicado em mobile */
@media (max-width: 768px) {
  .pagination-container {
    margin-bottom: var(--spacing-8) !important;
  }
}
</style>
