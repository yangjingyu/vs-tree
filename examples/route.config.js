const route = [{
  path: '/',
  redirect: '/',
  component: r => require.ensure([], () =>
    r(require('./pages/component.vue'))),
  children: [{
    path: '',
    name: 'component-tree',
    component: r => require.ensure([], () =>
      r(require('./docs/tree.md'))).default
  }]}, {
  path: '*',
  redirect: '/'
}];

export default route;
