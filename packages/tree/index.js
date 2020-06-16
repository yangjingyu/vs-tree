import Tree from './src/tree.vue';
import VirtualList from 'vue-virtual-scroll-list';

/* istanbul ignore next */
Tree.install = function(Vue) {
  Vue.component(Tree.name, Tree);
  Vue.component('virtual-list', VirtualList);
};

export default Tree;
