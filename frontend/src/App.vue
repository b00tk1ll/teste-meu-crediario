<script setup lang="ts">
import BaseLayout from './components/Layout/BaseLayout.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    clientes: 'Clientes',
    vendas: 'Vendas',
    relatorios: 'Relatórios',
    cores: 'Paleta de Cores'
  }
  return titles[route.name as string] || 'Meu Crediário'
})
</script>

<template>
  <div class="app-container">
    <BaseLayout :page-title="pageTitle">
      <router-view />
    </BaseLayout>
  </div>
</template>

<style>
@import '@fortawesome/fontawesome-free/css/all.min.css';
@import './styles/colors.css';
@import './styles/global.css';
</style>
