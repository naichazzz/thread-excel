import router from './router'
import store from './store'
import { Message } from 'element-ui'
import { Loading } from 'element-ui';
import { getToken } from '@/utils/auth'

let loading;
const whiteList = ['/login', '/auth-redirect', '/bind', '/register']
const startLoading = () => {  // 使用Element loading-start 方法
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  });
};

router.beforeEach((to, from, next) => {
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (store.getters.roles.length === 0) {
        startLoading()
        // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {
          // 拉取user_info
          // console.log(res)
          const roles = res.roles
          const routes=res.data.userMenuList
          // console.log(res)
          store.dispatch('GenerateRoutes', { routes }).then(accessRoutes => {
          // 测试 默认静态页面
          // store.dispatch('permission/generateRoutes', { roles }).then(accessRoutes => {
            // 根据roles权限生成可访问的路由表
            loading.close()
            router.addRoutes(accessRoutes) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成s
          })
        })
          .catch(err => {
            loading.close()
            store.dispatch('FedLogOut').then(() => {
              Message.error(err.message)

              next({ path: '/' })
              loading.close()
            })
          })
      } else {
        next()
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        // if (hasPermission(store.getters.roles, to.meta.roles)) {
        //   next()
        // } else {
        //   next({ path: '/401', replace: true, query: { noGoBack: true }})
        // }
        // 可删 ↑
      }
    }
  } else {

    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
      // next({ path: '/login' })
    }
  }
})
