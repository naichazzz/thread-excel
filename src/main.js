// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import store from './store'

import Cookies from 'js-cookie'
// import VueAMap from 'vue-amap';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/common.css';
import App from './App'
import router from './router'
import SIdentify from './components/identify' //注意引入路径
import './permission'
import { getDicts } from "@/api/system/dict/data";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, download, handleTree,checkPromis,utc2beijing,changeTime,localTime} from "@/utils/ruoyi";
import './assets/icons'
var _ = require("lodash");
// register globally

Vue.use(SIdentify)
Vue.use(ElementUI);
// Vue.use(VueAMap);
Vue.config.productionTip = false
Vue.prototype.handleTree = handleTree
Vue.prototype.resetForm = resetForm
Vue.prototype.parseTime = parseTime
Vue.prototype.utc2beijing = utc2beijing
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.checkPromis = checkPromis
Vue.prototype.addDateRange = addDateRange
Vue.prototype.getDicts = getDicts
Vue.prototype.download = download
Vue.prototype.changeTime = changeTime
Vue.prototype.localTime = localTime
Vue.prototype.msgSuccess = function (msg) {
  this.$message({ showClose: true, message: msg, type: "success" });
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
