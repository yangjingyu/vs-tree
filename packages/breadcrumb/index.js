import VsBreadcrumb from './src/breadcrumb';

/* istanbul ignore next */
VsBreadcrumb.install = function(Vue) {
  Vue.component(VsBreadcrumb.name, VsBreadcrumb);
};

export default VsBreadcrumb;
