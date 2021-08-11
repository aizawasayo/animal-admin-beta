import '@/assets/icons' // icon
import '@/permission' // permission control
import '@/styles/index.scss' // global css
import * as commonApi from '@/utils/common'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import Vue from 'vue'
import App from './App.vue'
// import * as ：一次性导入包含全部变量的模块对象
import * as filters from './filters' // global filters
// 自动注册全局组件
import './globalComs'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.prototype.commonApi = commonApi
Vue.prototype.apiUrl = process.env.VUE_APP_BASE_API

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
