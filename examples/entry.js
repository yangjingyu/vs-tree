import Vue from 'vue';
import entry from './app';
import VueRouter from 'vue-router';
import hljs from 'highlight.js';
import routes from './route.config';
import demoBlock from './components/demo-block';
import VsTree from 'main/index.js';
import '../packages/theme-chalk/src/index.scss';
import './assets/styles/common.scss';
import './demo-styles/index.scss';
import 'element-ui/lib/theme-chalk/index.css';

import {
  Button,
  Scrollbar,
  Input
} from 'element-ui';

Vue.component(Scrollbar.name, Scrollbar);
Vue.component(Input.name, Input);
Vue.component(Button.name, Button);
Vue.use(VsTree);
Vue.use(VueRouter);
Vue.component('demo-block', demoBlock);

const globalEle = new Vue({
  data: { $isEle: false } // 是否 ele 用户
});

Vue.mixin({
  computed: {
    $isEle: {
      get: () => (globalEle.$data.$isEle),
      set: (data) => {globalEle.$data.$isEle = data;}
    }
  }
});

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
});

router.afterEach(route => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)');
    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  });
});

new Vue({ // eslint-disable-line
  ...entry,
  router
}).$mount('#app');
