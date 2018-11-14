import Vue from "vue";
import Router from "vue-router";
Vue.use(Router)

import HellowWorld from '../components/HelloWorld.vue'
import MapView from '../view/map.vue'
export default new Router({
	routes:[
		{
			path:"/",
			name:"home",
			component:HellowWorld
		},
		{
			path:"/map",
			name:"map",
			component:MapView
		}
	]
})