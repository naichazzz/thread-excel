import { constantRoutes } from '@/router'
// import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'

const permission = {
    state: {
        routes: [],
        addRoutes: []
    },
    mutations: {
        SET_ROUTES: (state, routes) => {
            state.addRoutes = routes
            state.routes = constantRoutes.concat(routes)
        }
    },
    actions: {
        // 生成路由
        GenerateRoutes({ commit, state }, routes) {
            return new Promise(resolve => {
                // 向后端请求路由数据
                // const _accessedRoutes = [{
                //           id: 1,
                //           path: '/',
                //           name: '基本信息管理',
                //           component: 'Layout',
                //           icon: 'build',
                //           children: [
                //             { id: 11, path: '/CarManage', component: 'CarManage', name: '车辆管理', icon: 'chart' },
                //             { id: 12, path: '/SIMCard', component: 'SIMCard', name: 'SIM卡管理', icon: 'dict' },
                //             { id: 13, path: '/terminalManage', component: 'terminalManage', name: '终端管理', icon: 'drag' },
                //             { id: 14, path: '/terminalTpye', component: 'terminalTpye', name: '终端类型管理', icon: 'edit' },
                //             { id: 15, path: '/driverManage', component: 'driverManage', name: '司机管理', icon: 'druid' },
                //             { id: 16, path: '/userManage', component: 'userManage', name: '用户管理', icon: 'excel' },
                //             { id: 17, path: '/roleManage', component: 'roleManage', name: '角色管理', icon: 'date' },
                //             { id: 18, path: '/funcManage', component: 'funcManage', name: '菜单管理', icon: 'icon' },
                //             { id: 19, path: '/groupManage', component: 'groupManage', name: '组管理', icon: 'link' },
                //             { id: 20, path: '/dict', component: 'dict', name: '字典管理', icon: 'link' },
                //           ],
                //           meta: { auth: true }
                //         },
                //         {
                //           id: 2,
                //           path: '/',
                //           name: '车辆监控管理',
                //           component: 'Layout',
                //           icon: 'dict',
                //           children: [
                //             { id: 21, path: '/map', component: 'map', name: '车辆监控', icon: 'icon' },
                //             { id: 22, path: '/carDispatch', component: 'carDispatch', name: '车辆调度', icon: 'link' },
                //             { id: 23, path: '/playback', component: 'playback', name: '轨迹回放', icon: 'link' },
                //           ],
                //           meta: { auth: true }
                //         }
                //         ]
                //   const accessedRoutes = filterAsyncRouter( _accessedRoutes)
                // console.log(routes.routes)
                const accessedRoutes = filterAsyncRouter(routes.routes)

                commit('SET_ROUTES', accessedRoutes)
                    // console.log(accessedRoutes)
                resolve(accessedRoutes)
                    // getRouters().then(res => {
                    //   const accessedRoutes = filterAsyncRouter(res.data)
                    //   accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
                    //   commit('SET_ROUTES', accessedRoutes)
                    //   resolve(accessedRoutes)
                    // })
            })
        }
    }
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
    return asyncRouterMap.filter(route => {

        if (route.component) {
            // Layout组件特殊处理
            if (route.component === 'Layout') {
                route.component = Layout
            } else {
                // console.log(route.component)
                route.component = loadView(route.component)
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
}

export const loadView = (view) => { // 路由懒加载
    if (view == 'dict') {
        return (resolve) => require([`@/views/${view}`], resolve)
    } else {
        return (resolve) => require([`@/views/${view}` + '.vue'], resolve)
    }

}

export default permission