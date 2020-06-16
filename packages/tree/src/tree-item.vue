<template>
  <vs-tree-node
    :node="source"
    :props="props"
    :breadcrumb="breadcrumb"
    :render-after-expand="renderAfterExpand"
    :show-checkbox="true"
    :render-content="renderContent"
    @node-expand="handleNodeExpand">
  </vs-tree-node>
</template>

<script>
  /* eslint-disable */
  export default {
    name: 'VsTreeItem',

    componentName: 'VsTreeItem',

    components: {
      VsTreeNode: () => import('./tree-node')
    },

    inject: ['props', 'breadcrumb'],
    props: {
      index: { // index of current item
        type: Number
      },
      renderContent: Function,
      showCheckbox: Boolean,
      handleNodeExpand: Function,
      renderAfterExpand: Boolean,
      source: { // here is: {uid: 'unique_1', text: 'abc'}
        type: Object,
        default() {
          return {};
        }
      }
    }
  };
</script>