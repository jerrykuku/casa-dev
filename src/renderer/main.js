import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import i18n from '@/plugins/i18n'
import api from '@/service/api.js'
import Buefy from 'buefy'
import VueTour from 'vue-tour'
import '@/assets/scss/app.scss'
import 'vue-tour/dist/vue-tour.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(Buefy)
Vue.use(VueTour)

/* eslint-disable no-new */
Vue.config.productionTip = false
Vue.prototype.$api = api
new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')
