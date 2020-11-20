import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import ('../views/Home.vue')
  },
  {
    path: '/explorer',
    component: () => import ('../views/Explorer.vue')
  },
  {
    path: '/a/:id',
    component: () => import ('../views/Address.vue')
  },
  {
    path: '/tx/:id',
    component: () => import ('../views/Transaction.vue')
  },
  {
    path: '/block/:id',
    component: () => import ('../views/Block.vue')
  },
  {
    path: '/folder/:id',
    component: () => import ('../views/Folder.vue')
  },
  {
    path: '/new',
    component: () => import ('../views/New.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
