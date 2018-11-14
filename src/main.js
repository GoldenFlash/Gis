import Vue from 'vue'
import App from './App.vue'

import router from './router/index.js'
import "./styles/reset.css"
Vue.config.productionTip = false
/* eslint-disable */ 
new Vue({
	router:router,
  render: h => h(App),
}).$mount('#app')
