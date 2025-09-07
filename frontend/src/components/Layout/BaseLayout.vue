<template>
  <div class="base-layout">
    <!-- Barra de navegação lateral -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <img src="@/assets/images/logo-full-slogan-alt.png" alt="Meu Crediário" style="max-width: 120px; display: block; margin-left: auto; margin-right: auto;" />
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li>
            <router-link to="/" class="nav-link">
              <i class="fas fa-home nav-icon"></i>
              Início
            </router-link>
          </li>
          <li>
            <router-link
              to="/clientes"
              class="nav-link"
              :class="{ 'router-link-active': isClientesActive }"
            >
              <i class="fas fa-users nav-icon"></i>
              Clientes
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Área principal de conteúdo -->
    <main class="main-content">
      <header class="main-header">
        <div class="header-left">
          <!-- <h1>{{ pageTitle }}</h1> -->
        </div>
        <div class="header-actions">
          <i class="fas fa-user-circle user-icon"></i>
        </div>
      </header>
      
      <div class="content-wrapper">
        <slot></slot>
        
        <!-- Loading para navegação -->
        <Loading 
          :show="isLoading" 
          message="Carregando página..." 
        />
      </div>
      
      <!-- Footer -->
      <footer class="footer"></footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import Loading from '../UI/Loading.vue'

interface Props {
  pageTitle?: string
}

defineProps<Props>()

const route = useRoute()
const isLoading = ref(false)

// Computed para verificar se o item Clientes deve estar ativo
const isClientesActive = computed(() => {
  return route.path === '/clientes' || route.path.startsWith('/cliente/')
})

// Watch para detectar mudanças de rota
watch(
  () => route.path,
  (newPath, oldPath) => {
    // Só mostra loading se não for a primeira navegação
    if (oldPath && newPath !== oldPath) {
      isLoading.value = true
      
      // Remove o loading após um pequeno delay
      setTimeout(() => {
        isLoading.value = false
      }, 300)
    }
  }
)
</script>

<style scoped>
.base-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--background);
  position: relative;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: var(--primary);
  color: var(--white);
  flex-shrink: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 10px;
  border-bottom: 1px solid var(--gray-dark);
  max-height: 55px;
  background-color: var(--primary-dark);
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}


.sidebar-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar-nav li {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: var(--white);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;   
}

.nav-link:hover {
  background-color: var(--primary-dark);
  border-left-color: var(--primary-dark);
}

.nav-link.router-link-active {
  background-color: var(--primary-dark);
  border-left-color: var(--alert);
  border-left-width: 5px;
  border-left-style: solid;
  color: var(--white);
}

.nav-icon {
  margin-right: 10px;
  font-size: 1.2rem;
  width: 20px;
  text-align: center;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Permite que o conteúdo seja redimensionado */
  width: 1024px; /* Largura do grid principal */
  max-width: 1024px;
  margin: 0 auto; /* Centraliza quando necessário */
  padding: 0;
  position: relative;
}

.main-header {
  background-color: var(--white);
  padding: 0 30px;
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 55px;
  width: 1024px; /* Largura do grid principal */
  max-width: 1024px;
  margin: 0 auto; /* Centraliza quando necessário */
  box-sizing: border-box;
}

.main-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--primary);
}

/* .header-actions {
  /* display: flex; */
  /* gap: 10px; */
  /* align-items: center; */
  /* justify-content: flex-end; */
  /* padding: 0 20px; */
/* } */

.user-icon {
  font-size: 2rem;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-icon:hover {
  color: var(--primary-dark);
  transform: scale(1.1);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary);
  color: var(--white); 
}

.btn-primary:hover {
  background-color: var(--primary-dark);
}

.content-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0 32px 0; /* Remove padding lateral pois será controlado pelo grid */   
  position: relative;
  box-sizing: border-box;
  width: 1024px; /* Largura do grid principal */
  max-width: 1024px;
  margin: 0 auto; /* Centraliza quando necessário */
}

/* Footer */
.footer {
  height: 55px;
  background-color: var(--primary-dark);
  flex-shrink: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

/* Responsividade para telas menores */
@media (max-width: 1274px) {
  .main-content,
  .main-header,
  .content-wrapper {
    width: 100%;
    max-width: 100%;
    margin: 0;
  }

  .main-header {
    padding: 0 20px;
  }

  .sidebar {
    width: 200px;
  }
}

@media (max-width: 1024px) {
  .main-header {
    padding: 15px 20px;
  }

  .content-wrapper {
    padding: 20px 15px 32px 15px;
  }
}

@media (max-width: 768px) {
  .base-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
  }
  
  .main-content {
    order: 1;
    width: 100%;
    max-width: 100%;
  }
  
  .sidebar-nav ul {
    display: flex;
    overflow-x: auto;
  }
  
  .sidebar-nav li {
    flex-shrink: 0;
  }
  
  .nav-link {
    white-space: nowrap;
    border-left: none;
    border-bottom: 3px solid transparent;
    padding: 12px 16px;
    min-width: 120px;
    justify-content: center;
  }
  
  .nav-link:hover,
  .nav-link.router-link-active {
    border-left: none;
    border-bottom-color: var(--alert);
  }
  
  .content-wrapper {
    padding: 15px 10px;
    min-height: auto;
    max-height: none;
  }
  
  .main-header {
    padding: 10px 15px;
    min-height: 50px;
  }
  
  .header-actions {
    padding: 0 15px;
  }
  
  .user-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .sidebar-header {
    padding: 8px;
  }
  
  .sidebar-header img {
    max-width: 100px;
  }
  
  .nav-link {
    padding: 10px 12px;
    min-width: 100px;
    font-size: 0.9rem;
  }
  
  .nav-icon {
    font-size: 1rem;
    margin-right: 8px;
  }
  
  .content-wrapper {
    padding: 10px 8px;
  }
  
  .main-header {
    padding: 8px 12px;
    min-height: 45px;
  }
  
  .header-actions {
    padding: 0 12px;
  }
  
  .user-icon {
    font-size: 1.3rem;
  }
}
</style>
