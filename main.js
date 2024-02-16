import Vue from 'vue'
import cssLoading from '@/components/css-loading/loading.vue'
import cssLoadingMixin from '@/components/css-loading/loading.js'


Vue.component('css-loading', cssLoading)
Vue.mixin(cssLoadingMixin)

// #ifdef APP-PLUS
import Down from './common/download.js'
Vue.prototype.$down = Down
// #endif

Vue.config.productionTip = false

import App from './App.vue'
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
