import Vue from 'vue'
import App from './App.vue'
import MobileTree from "../lib/mobile-tree.umd"
import "../lib/mobile-tree.css";
Vue.use(MobileTree);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
