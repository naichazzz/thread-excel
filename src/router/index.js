import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/Main.vue'
import layout from '@/layout/index.vue'
import CarManage from '@/views/CarManage.vue'
import Login from '@/views/login.vue'
import Layout from '@/layout/index'

Vue.use(Router)
export const constantRoutes=[
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ],
    meta:{auth:false}
  },
  {
    path: '/',
    menuName: 'Main',
    component: layout,
    meta:{auth:false}
  },
  {
    path:'/login',
    menuName:'Login',
    component:Login,
    meta:{auth:false}
  },
  {
    path: '/dict/data',
    component: Layout,
    menuName:'dict',
    children: [
      {
        path: ':dictId(\\d+)',
        component: (resolve) => require(['@/views/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ],
    meta:{auth:false}
  },
]
export default new Router({

  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
