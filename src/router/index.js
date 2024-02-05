import Vue from 'vue'
import VueRouter from 'vue-router'

import { Layout } from '@/layouts/index'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

export const routes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    path: '/personal',
    name: 'personal',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'center',
        name: 'personalCenter',
        component: () => import('@/views/personal'),
        meta: {
          title: '个人中心'
        }
      }
    ]
  },
  {
    path: '/',
    name: 'root',
    redirect: '/index/main',
    hidden: true
  },
  {
    path: '/index',
    name: 'index',
    component: Layout,
    hidden: false,
    meta: {
      title: '功能面板',
      icon: 'dashboard'
    },
    children: [
      {
        path: 'main',
        name: 'Main',
        component: () => import('@/views/index'),
        meta: {
          title: '主控台',
          affix: true,
          cacheable: false
        }
      },
      {
        path: 'alarm',
        name: 'alarm',
        component: () => import('@/views/device/alarm/index'),
        meta: {
          title: '报警列表',
          cacheable: false
        }
      },
      {
        path: 'operator',
        name: 'operator',
        component: () => import('@/views/device/operator/index'),
        meta: {
          title: '人员名单',
          cacheable: false
        }
      },
      {
        path: 'scheduling',
        name: 'scheduling',
        component: () => import('@/views/device/scheduling/index'),
        meta: {
          title: '排班表',
          cacheable: false
        }
      }
      // {
      //   path: 'workplace',
      //   name: 'WorkPlace',
      //   component: () => import('@/views/index/work-place'),
      //   meta: {
      //     title: '工作台',
      //     cacheable: true
      //   }
      // }
    ]
  }
]

const createRouter = () => new VueRouter({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
