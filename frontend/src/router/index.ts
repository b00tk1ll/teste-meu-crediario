import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('../views/Clientes.vue')
    },
    {
      path: '/cliente/:id',
      name: 'cliente-detalhes',
      component: () => import('../views/ClientDetails.vue')
    }
  ],
})

export default router
