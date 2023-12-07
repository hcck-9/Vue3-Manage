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
    component: () => import('@/views/menu/index.vue'),
    children: [
      {
        name: 'home',
        path: '/home',
        component: () => import('@/views/home/index.vue')
      },
      {
        name: 'set',
        path: '/set',
        component: () => import('@/views/set/index.vue')
      },
      {
        name: 'overview',
        path: '/overview',
        component: () => import('@/views/overview/index.vue')
      },
      {
        name: 'user_product_manage',
        path: '/user_product_manage',
        component: () => import('@/views/user_manage/product_manage/index.vue')
      },
      {
        name: 'user_message_manage',
        path: '/user_message_manage',
        component: () => import('@/views/user_manage/message_manage/index.vue')
      },
      {
        name: 'user_users_manage',
        path: '/user_users_manage',
        component: () => import('@/views/user_manage/users_manage/index.vue')
      },
      {
        name: 'user_user_list',
        path: '/user_user_list',
        component: () => import('@/views/user_manage/user_list/index.vue')
      },
      {
        name: 'product_product_manage',
        path: '/product_product_manage',
        component: () => import('@/views/product/product_manage_list/index.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
