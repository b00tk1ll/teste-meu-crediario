<template>
  <div class="grid-container">
    <div class="grid-row">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// Componente base do sistema de grid
</script>

<style scoped>
.grid-container {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden; /* Previne scroll horizontal */
  box-sizing: border-box;
  padding: 0 15px; /* Padding lateral do sistema de grid global */
}

.grid-row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -7.5px; /* Metade do gutter para compensar o padding dos col */
  width: calc(100% + 15px); /* Compensa o margin negativo */
  box-sizing: border-box;
}

/* Classes de coluna */
:deep(.col) {
  padding: 0 7.5px; /* Metade do gutter de 15px */
  box-sizing: border-box;
}

:deep(.col-1) { flex: 0 0 8.333333%; max-width: 8.333333%; }
:deep(.col-2) { flex: 0 0 16.666667%; max-width: 16.666667%; }
:deep(.col-3) { flex: 0 0 25%; max-width: 25%; }
:deep(.col-4) { flex: 0 0 33.333333%; max-width: 33.333333%; }
:deep(.col-5) { flex: 0 0 41.666667%; max-width: 41.666667%; }
:deep(.col-6) { flex: 0 0 50%; max-width: 50%; }
:deep(.col-7) { flex: 0 0 58.333333%; max-width: 58.333333%; }
:deep(.col-8) { flex: 0 0 66.666667%; max-width: 66.666667%; }
:deep(.col-9) { flex: 0 0 75%; max-width: 75%; }
:deep(.col-10) { flex: 0 0 83.333333%; max-width: 83.333333%; }
:deep(.col-11) { flex: 0 0 91.666667%; max-width: 91.666667%; }
:deep(.col-12) { flex: 0 0 100%; max-width: 100%; }

/* Responsividade para telas menores */

/* Classes responsivas para tablets */
@media (max-width: 768px) {
  :deep(.col-md-1) { flex: 0 0 8.333333%; max-width: 8.333333%; }
  :deep(.col-md-2) { flex: 0 0 16.666667%; max-width: 16.666667%; }
  :deep(.col-md-3) { flex: 0 0 25%; max-width: 25%; }
  :deep(.col-md-4) { flex: 0 0 33.333333%; max-width: 33.333333%; }
  :deep(.col-md-5) { flex: 0 0 41.666667%; max-width: 41.666667%; }
  :deep(.col-md-6) { flex: 0 0 50%; max-width: 50%; }
  :deep(.col-md-7) { flex: 0 0 58.333333%; max-width: 58.333333%; }
  :deep(.col-md-8) { flex: 0 0 66.666667%; max-width: 66.666667%; }
  :deep(.col-md-9) { flex: 0 0 75%; max-width: 75%; }
  :deep(.col-md-10) { flex: 0 0 83.333333%; max-width: 83.333333%; }
  :deep(.col-md-11) { flex: 0 0 91.666667%; max-width: 91.666667%; }
  :deep(.col-md-12) { flex: 0 0 100%; max-width: 100%; }
}

/* Classes responsivas para mobile */
@media (max-width: 576px) {
  .grid-row {
    margin: 0 -10px;
  }
  
  :deep(.col) {
    padding: 0 10px;
  }
  
  :deep(.col-sm-1) { flex: 0 0 8.333333%; max-width: 8.333333%; }
  :deep(.col-sm-2) { flex: 0 0 16.666667%; max-width: 16.666667%; }
  :deep(.col-sm-3) { flex: 0 0 25%; max-width: 25%; }
  :deep(.col-sm-4) { flex: 0 0 33.333333%; max-width: 33.333333%; }
  :deep(.col-sm-5) { flex: 0 0 41.666667%; max-width: 41.666667%; }
  :deep(.col-sm-6) { flex: 0 0 50%; max-width: 50%; }
  :deep(.col-sm-7) { flex: 0 0 58.333333%; max-width: 58.333333%; }
  :deep(.col-sm-8) { flex: 0 0 66.666667%; max-width: 66.666667%; }
  :deep(.col-sm-9) { flex: 0 0 75%; max-width: 75%; }
  :deep(.col-sm-10) { flex: 0 0 83.333333%; max-width: 83.333333%; }
  :deep(.col-sm-11) { flex: 0 0 91.666667%; max-width: 91.666667%; }
  :deep(.col-sm-12) { flex: 0 0 100%; max-width: 100%; }
  
  /* Forçar todas as colunas para 100% em mobile muito pequeno */
  :deep(.col-1), :deep(.col-2), :deep(.col-3), :deep(.col-4), 
  :deep(.col-5), :deep(.col-6), :deep(.col-7), :deep(.col-8), 
  :deep(.col-9), :deep(.col-10), :deep(.col-11), :deep(.col-12) {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
}

/* Classes de offset */
:deep(.offset-1) { margin-left: 8.333333%; }
:deep(.offset-2) { margin-left: 16.666667%; }
:deep(.offset-3) { margin-left: 25%; }
:deep(.offset-4) { margin-left: 33.333333%; }
:deep(.offset-5) { margin-left: 41.666667%; }
:deep(.offset-6) { margin-left: 50%; }
:deep(.offset-7) { margin-left: 58.333333%; }
:deep(.offset-8) { margin-left: 66.666667%; }
:deep(.offset-9) { margin-left: 75%; }
:deep(.offset-10) { margin-left: 83.333333%; }
:deep(.offset-11) { margin-left: 91.666667%; }

/* Utilitários */
:deep(.d-flex) { display: flex; }
:deep(.d-block) { display: block; }
:deep(.d-none) { display: none; }
:deep(.justify-content-start) { justify-content: flex-start; }
:deep(.justify-content-center) { justify-content: center; }
:deep(.justify-content-end) { justify-content: flex-end; }
:deep(.justify-content-between) { justify-content: space-between; }
:deep(.align-items-start) { align-items: flex-start; }
:deep(.align-items-center) { align-items: center; }
:deep(.align-items-end) { align-items: flex-end; }

/* Responsividade para telas menores */
@media (max-width: 1274px) {
  .grid-container {
    padding: 0 20px;
  }
}

@media (max-width: 1024px) {
  .grid-container {
    padding: 0 15px;
  }
}

/* Responsividade para telas muito pequenas */
@media (max-width: 480px) {
  .grid-row {
    margin: 0 -8px;
  }

  :deep(.col) {
    padding: 0 8px;
  }

  /* Forçar todas as colunas para 100% em mobile muito pequeno */
  :deep(.col-1), :deep(.col-2), :deep(.col-3), :deep(.col-4),
  :deep(.col-5), :deep(.col-6), :deep(.col-7), :deep(.col-8),
  :deep(.col-9), :deep(.col-10), :deep(.col-11), :deep(.col-12),
  :deep(.col-md-1), :deep(.col-md-2), :deep(.col-md-3), :deep(.col-md-4),
  :deep(.col-md-5), :deep(.col-md-6), :deep(.col-md-7), :deep(.col-md-8),
  :deep(.col-md-9), :deep(.col-md-10), :deep(.col-md-11), :deep(.col-md-12) {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }
}
</style>
