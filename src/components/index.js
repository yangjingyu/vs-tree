import Tree from './tree/index.vue';
import Breadcrumb from './breadcrumb/index.vue';
import Checkbox from './checkbox/index.vue';

const components = [Tree, Breadcrumb, Checkbox];

const install = function(Vue) {
  if (install.installed) return;
  install.installed = true;
  components.map((component) => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  ...components,
};
