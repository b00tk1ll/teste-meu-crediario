<template>
  <div class="card" :class="cardClasses">
    <div v-if="$slots.header || closable" class="card-header">
      <div class="header-content">
        <slot name="header"></slot>
      </div>
      <button
        v-if="closable"
        class="close-button"
        @click="emit('close')"
        type="button"
        aria-label="Fechar"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <div class="card-body">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  shadow: 'md',
  padding: 'md',
  closable: false
})

const emit = defineEmits<{
  close: []
}>()

const cardClasses = computed(() => [
  `card-${props.variant}`,
  `card-shadow-${props.shadow}`,
  `card-padding-${props.padding}`
])
</script>

<style scoped>
.card {
  background-color: var(--white);
  /* border-radius: 8px; */
  /* border: 1px solid var(--gray-light); */
  overflow: hidden;
  transition: all 0.3s ease;
}

/* Variantes */
.card-default {
  border-color: var(--gray-light);
}

.card-primary {
  border-color: var(--primary);
  border-left: 4px solid var(--primary);
}

.card-success {
  border-color: var(--secondary);
  border-left: 4px solid var(--secondary);
}

.card-warning {
  border-color: var(--alert);
  border-left: 4px solid var(--alert);
}

.card-danger {
  border-color: var(--danger);
  border-left: 4px solid var(--danger);
}

/* Sombras */
.card-shadow-none {
  box-shadow: none;
}

.card-shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Padding */
.card-padding-none .card-body {
  padding: 0;
}

.card-padding-sm .card-body {
  padding: 15px;
}

.card-padding-md .card-body {
  padding: 20px;
}

.card-padding-lg .card-body {
  padding: 30px;
}

.card-header {
  padding: 15px 20px;
  background-color: var(--white-dark);
  /* border-bottom: 1px solid var(--gray-light); */
  font-weight: 600;
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-content {
  flex: 1;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray);
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--danger);
}

.close-button svg {
  width: 16px;
  height: 16px;
}

.card-body {
  padding: 20px;
}

.card-footer {
  padding: 15px 20px;
  background-color: var(--white-dark);
  border-top: 1px solid var(--gray-light);
}

/* Hover effect */
/* .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
} */

/* Responsividade */
@media (max-width: 768px) {
  .card-body {
    padding: 15px;
  }

  .card-header,
  .card-footer {
    padding: 12px 15px;
  }

  .close-button {
    padding: 2px;
  }

  .close-button svg {
    width: 14px;
    height: 14px;
  }
}
</style>
