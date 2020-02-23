import Vue from 'vue'
import App from './App.vue'
/* import router from './router' */
/* import store from './store' */
import Element from 'element-ui'
import i18n from './i18n/i18n'
Vue.use(Element)
/* import 'element-ui/lib/theme-chalk/index.css' */
import '@/assets/theme/index.css'
import '@/assets/css-font/iconfont.css'
import '@/assets/css/reset.css'
import '@/assets/css/common.scss'
/* import '@/assets/css/reset-el-table.scss' */
Vue.config.productionTip = false

new Vue({
  i18n,
  render: h => h(App)
}).$mount('#app')
