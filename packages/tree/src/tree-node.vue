<template>
  <div
    class="vs-tree-node"
    @click.stop="handleClick"
    @contextmenu="($event) => this.handleContextMenu($event)"
    v-show="node.visible"
    :class="{
      'is-expanded': expanded,
      'is-current': node.isCurrent,
      'is-hidden': !node.visible,
      'is-focusable': !node.disabled,
      'is-checked': !node.disabled && node.checked,
      'is-last-node': isLastNode
    }"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    :draggable="tree.draggable"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
    ref="node"
  >
    <div class="vs-tree-node__content"
      :style="!breadcrumb && {'padding-left': (node.level - 1) * tree.indent + 'px'}">
      <span
        v-if="!breadcrumb"
        @click.stop="handleExpandIconClick"
        :class="[
          { 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded },
          'vs-tree-node__expand-icon',
          tree.iconClass ? tree.iconClass : 'vs-icon-caret-right'
        ]"
      >
      </span>
      <vs-checkbox
        v-if="showCheckbox"
        :value="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.native.stop
        @change="handleCheckChange"
      >
      </vs-checkbox>
      <span
        v-if="node.loading"
        class="vs-tree-node__loading-icon vs-icon-loading">
      </span>
      <span 
        v-else-if="node.error"
        class="vs-tree-node__warn-icon vs-icon-warning">
      </span>
      <node-content :node="node"></node-content>
    </div>
    <vs-collapse-transition v-if="!breadcrumb && !virtual">
      <div
        class="vs-tree-node__children"
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        role="group"
        :aria-expanded="expanded"
      >
        <vs-tree-node
          :render-content="renderContent"
          v-for="child in node.childNodes"
          :render-after-expand="renderAfterExpand"
          :show-checkbox="showCheckbox"
          :key="getNodeKey(child)"
          :node="child"
          @node-expand="handleChildNodeExpand">
        </vs-tree-node>
      </div>
    </vs-collapse-transition>
  </div>
</template>

<script type="text/jsx">
  import VsCollapseTransition from 'vs-tree/src/transitions/collapse-transition';
  import VsCheckbox from 'vs-tree/packages/checkbox';
  import emitter from 'vs-tree/src/mixins/emitter';
  import { getNodeKey } from './model/util';

  export default {
    name: 'VsTreeNode',

    componentName: 'VsTreeNode',

    mixins: [emitter],

    inject: ["nodePrarnt", "virtual", "nodeHeightSize", "virtualStyle"],

    props: {
      node: {
        default() {
          return {};
        }
      },
      props: {},
      renderContent: Function,
      renderAfterExpand: {
        type: Boolean,
        default: true
      },
      showCheckbox: {
        type: Boolean,
        default: false
      },
      breadcrumb: {
        type: Boolean,
        default: false
      }
    },

    components: {
      VsCollapseTransition,
      VsCheckbox,
      NodeContent: {
        props: {
          node: {
            required: true
          }
        },
        render(h) {
          const parent = this.$parent;
          const tree = parent.tree;
          const node = this.node;
          const { data, store } = node;
          return (
            parent.renderContent
              ? parent.renderContent.call(parent._renderProxy, h, { _self: tree.$vnode.context, node, data, store })
              : tree.$scopedSlots.default
                ? tree.$scopedSlots.default({ node, data })
                : <span class="vs-tree-node__label">{ node.label }</span>
          );
        }
      }
    },

    data() {
      return {
        tree: null,
        expanded: false,
        childNodeRendered: false,
        oldChecked: null,
        oldIndeterminate: null
      };
    },

    computed: {
      isLastNode() {
        return (!this.node.isLeaf || (this.node.data && this.node.data.children)) && this.node.nextSibling && this.node.nextSibling.isLeaf && !this.node.nextSibling.data.children && this.tree && this.tree.showLeafDivider;
      }
    },

    watch: {
      'node.indeterminate'(val) {
        this.handleSelectChange(this.node.checked, val);
      },

      'node.checked'(val) {
        this.handleSelectChange(val, this.node.indeterminate);
      },

      'node.expanded'(val) {
        this.$nextTick(() => this.expanded = val);
        if (val) {
          this.childNodeRendered = true;
        }
      }
    },

    methods: {
      getNodeKey(node) {
        return getNodeKey(this.tree.nodeKey, node.data);
      },

      handleSelectChange(checked, indeterminate) {
        if (this.oldChecked !== checked && this.oldIndeterminate !== indeterminate) {
          this.tree.$emit('check-change', this.node.data, checked, indeterminate);
        }
        this.oldChecked = checked;
        this.indeterminate = indeterminate;
      },

      handleClick() {
        const store = this.tree.store;
        store.setCurrentNode(this.node);
        this.tree.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
        this.tree.currentNode = this;
        if (this.tree.expandOnClickNode) {
          this.handleExpandIconClick();
        }
        if ((this.tree.checkOnClickNode || (this.tree.checkOnClickLeaf && this.node.isLeaf)) && !this.node.disabled) {
          this.handleCheckChange(null, {
            target: { checked: !this.node.checked }
          });
        }
        this.tree.$emit('node-click', this.node.data, this.node, this);
      },

      handleContextMenu(event) {
        if (this.tree._events['node-contextmenu'] && this.tree._events['node-contextmenu'].length > 0) {
          event.stopPropagation();
          event.preventDefault();
        }
        this.tree.$emit('node-contextmenu', event, this.node.data, this.node, this);
      },

      handleExpandIconClick() {
        if (this.node.isLeaf) return;
        if (this.expanded) {
          this.tree.$emit('node-collapse', this.node.data, this.node, this);
          this.node.collapse();
        } else {
          this.node.expand();
          this.$emit('node-expand', this.node.data, this.node, this);
        }
      },

      handleCheckChange(value, ev) {
        this.tree.store.checkMax(this.node, value).then(() => {
          this.node.setChecked(ev.target.checked, !this.tree.checkStrictly);
          this.node.isCheckLoading = true;
          !this.expanded && value && !this.node.isLeaf && this.node.expand(()=>{}, false, false, true);
          this.$nextTick(() => {
            const store = this.tree.store;
            this.tree.$emit('check', this.node.data, {
              checkedNodes: store.getCheckedNodes(),
              checkedKeys: store.getCheckedKeys(),
              halfCheckedNodes: store.getHalfCheckedNodes(),
              halfCheckedKeys: store.getHalfCheckedKeys(),
              checkedLeafsNum: store.getCheckedLeafNum()
            });
          });
        }, () => {
          this.node.checked = false;
          ev.target.checked = false;
          this.tree.$emit('limit-check', this.node.data);
        });
      },

      handleChildNodeExpand(nodeData, node, instance) {
        this.broadcast('VsTreeNode', 'tree-node-expand', node);
        this.tree.$emit('node-expand', nodeData, node, instance);
      },

      handleDragStart(event) {
        if (!this.tree.draggable) return;
        this.tree.$emit('tree-node-drag-start', event, this);
      },

      handleDragOver(event) {
        if (!this.tree.draggable) return;
        this.tree.$emit('tree-node-drag-over', event, this);
        event.preventDefault();
      },

      handleDrop(event) {
        event.preventDefault();
      },

      handleDragEnd(event) {
        if (!this.tree.draggable) return;
        this.tree.$emit('tree-node-drag-end', event, this);
      }
    },

    created() {
      const parent = this.nodePrarnt;

      if (parent.isTree) {
        this.tree = parent;
      } else {
        this.tree = parent.tree;
      }

      const tree = this.tree;
      if (!tree) {
        console.warn('Can not find node\'s tree.');
      }

      const props = tree.props || {};
      const childrenKey = props['children'] || 'children';

      this.$watch(`node.data.${childrenKey}`, () => {
        this.node.updateChildren();
      });

      if (this.node.expanded) {
        this.expanded = true;
        this.childNodeRendered = true;
      }

      if(this.tree.accordion) {
        this.$on('tree-node-expand', node => {
          if(this.node !== node) {
            this.node.collapse();
          }
        });
      }
    }
  };
</script>
