import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 使用英文版
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

// 引入api
import API from '@/api'
Vue.prototype.$API = API

// 引入三级联动组件
import CategorySelect from '@/components/CategorySelect'
// 注册全局组件
Vue.component(CategorySelect.name, CategorySelect)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
