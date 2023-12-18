import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index.vue')
  },
  {
    name: 'menu',
    path: '/menu',
    component: () => import('@/views/menu/index.vue')
  },
  {
    name: '404',
    path: '/:catchAll(.*)',
    component: () => import('@/views/error/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
