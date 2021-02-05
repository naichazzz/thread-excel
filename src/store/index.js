import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import getters from './getters'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import carInfo from './modules/carInfo'
//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
    modules: {
        user,
        permission,
        tagsView,
        carInfo
    },
    getters
})

export default store