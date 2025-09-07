<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled"
    @click="$emit('click', $event)"
    type="button"
  >
    <i v-if="icon && iconPosition === 'left'" :class="iconClass" :style="iconStyle"></i>
    <span v-if="$slots.default" class="button-text" :style="textStyle">
      <slot></slot>
    </span>
    <i v-if="icon && iconPosition === 'right'" :class="iconClass" :style="iconStyle"></i>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large' | 'route'
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'info' | 'alert'
  icon?: string
  iconPosition?: 'left' | 'right'
  disabled?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  variant: 'primary',
  iconPosition: 'left',
  disabled: false,
  fullWidth: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'btn',
  `btn-${props.size}`,
  `btn-${props.variant}`,
  {
    'btn-disabled': props.disabled,
    'btn-full-width': props.fullWidth,
    'btn-with-icon': props.icon,
    'btn-icon-left': props.icon && props.iconPosition === 'left',
    'btn-icon-right': props.icon && props.iconPosition === 'right'
  }
])

const iconClass = computed(() => {
  if (!props.icon) return ''
  return `fas fa-${props.icon}`
})

const iconStyle = computed(() => {
  const sizes = {
    small: '10px',
    medium: '12px',
    large: '16px',
    route: '16px'
  }
  return {
    fontSize: sizes[props.size]
  }
})

const textStyle = computed(() => {
  const sizes = {
    small: '12px',
    medium: '14px',
    large: '16px',
    route: '16px'
  }
  return {
    fontSize: sizes[props.size]
  }
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
  outline: none;
  position: relative;
  overflow: hidden;
}

.btn:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-full-width {
  width: 100%;
}

/* Tamanhos */
.btn-small {
  padding: 6px 10px;
  gap: 5px;
}

.btn-medium {
  padding: 7px 15px;
  gap: 5px;
}

.btn-large {
  padding: 8px 15px;
  gap: 5px;
}

.btn-route {
  padding: 15px;
  gap: 15px;
}

/* Botões sem ícone - gap maior */
.btn-small:not(.btn-with-icon) {
  gap: 10px;
}

.btn-medium:not(.btn-with-icon) {
  gap: 10px;
}

.btn-large:not(.btn-with-icon) {
  gap: 10px;
}

.btn-route:not(.btn-with-icon) {
  gap: 15px;
}

/* Variantes de cor */
.btn-primary {
  background-color: var(--primary);
  color: var(--white);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 97, 81, 0.2);
}

.btn-secondary {
  background-color: var(--white);
  color: var(--text);
  border: 1px solid var(--gray-light);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--white-dark);
  border-color: var(--gray-light);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-success {
  background-color: var(--secondary);
  color: var(--white);
}

.btn-success:hover:not(:disabled) {
  background-color: var(--secondary-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(1, 134, 95, 0.2);
}

.btn-danger {
  background-color: var(--danger);
  color: var(--white);
}

.btn-danger:hover:not(:disabled) {
  background-color: var(--danger-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(201, 29, 29, 0.2);
}

.btn-info {
  background-color: var(--info);
  color: var(--white);
}

.btn-info:hover:not(:disabled) {
  background-color: var(--info-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 102, 171, 0.2);
}

.btn-alert {
  background-color: var(--alert);
  color: var(--white);
}

.btn-alert:hover:not(:disabled) {
  background-color: var(--alert-dark);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(246, 171, 53, 0.2);
}

/* Estilos para ícones */
.btn i {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.button-text {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Estados especiais */
.btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Responsividade */
@media (max-width: 768px) {
  .btn-small {
    padding: 5px 8px;
    font-size: 11px;
  }
  
  .btn-medium {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .btn-large {
    padding: 7px 12px;
    font-size: 15px;
  }
  
  .btn-route {
    padding: 12px;
    font-size: 15px;
  }
}
</style>
