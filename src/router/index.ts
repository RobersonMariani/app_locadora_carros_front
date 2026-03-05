import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/modules/auth/pages/LoginPage.vue'),
      meta: { layout: 'guest' },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/modules/auth/pages/DashboardPage.vue'),
    },
    {
      path: '/clientes',
      name: 'clientes',
      component: () => import('@/modules/clientes/pages/ClientesPage.vue'),
    },
    {
      path: '/clientes/criar',
      name: 'clientes.create',
      component: () => import('@/modules/clientes/pages/CreateClientePage.vue'),
    },
    {
      path: '/clientes/:id/editar',
      name: 'clientes.edit',
      component: () => import('@/modules/clientes/pages/EditClientePage.vue'),
    },
    {
      path: '/marcas',
      name: 'marcas',
      component: () => import('@/modules/marcas/pages/MarcasPage.vue'),
    },
    {
      path: '/marcas/criar',
      name: 'marcas.create',
      component: () => import('@/modules/marcas/pages/CreateMarcaPage.vue'),
    },
    {
      path: '/marcas/:id/editar',
      name: 'marcas.edit',
      component: () => import('@/modules/marcas/pages/EditMarcaPage.vue'),
    },
    {
      path: '/modelos',
      name: 'modelos',
      component: () => import('@/modules/modelos/pages/ModelosPage.vue'),
    },
    {
      path: '/modelos/criar',
      name: 'modelos.create',
      component: () => import('@/modules/modelos/pages/CreateModeloPage.vue'),
    },
    {
      path: '/modelos/:id/editar',
      name: 'modelos.edit',
      component: () => import('@/modules/modelos/pages/EditModeloPage.vue'),
    },
    {
      path: '/carros',
      name: 'carros',
      component: () => import('@/modules/carros/pages/CarrosPage.vue'),
    },
    {
      path: '/carros/criar',
      name: 'carros.create',
      component: () => import('@/modules/carros/pages/CreateCarroPage.vue'),
    },
    {
      path: '/carros/:id/editar',
      name: 'carros.edit',
      component: () => import('@/modules/carros/pages/EditCarroPage.vue'),
    },
    {
      path: '/locacoes',
      name: 'locacoes',
      component: () => import('@/modules/locacoes/pages/LocacoesPage.vue'),
    },
    {
      path: '/locacoes/criar',
      name: 'locacoes.create',
      component: () => import('@/modules/locacoes/pages/CreateLocacaoPage.vue'),
    },
    {
      path: '/locacoes/:id/editar',
      name: 'locacoes.edit',
      component: () => import('@/modules/locacoes/pages/EditLocacaoPage.vue'),
    },
  ],
})

router.beforeEach(authGuard)

export default router
