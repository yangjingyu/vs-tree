<template>
  <div
    class="vs-tree"
    :class="{
      'vs-tree--highlight-current': highlightCurrent,
      'is-dragging': !!dragState.draggingNode,
      'is-drop-not-allow': !dragState.allowDrop,
      'is-drop-inner': dragState.dropType === 'inner'
    }"
    role="tree"
  >
    <vs-breadcrumb class="vs-tree-breadcrumb" separator-class="vs-icon-arrow-right" :class="[breadcrumbClass]" v-if="breadcrumb && !breadcrumbCustom">
      <vs-breadcrumb-item><a  @click="onCutCrumb(-1)">根目录</a></vs-breadcrumb-item>
      <vs-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.id">
        <a @click="onCutCrumb(index)">{{item.data[props.label]}}</a>
      </vs-breadcrumb-item>
    </vs-breadcrumb>
    <template v-if="virtual">
      <virtual-list
        :class="virtualClass"
        ref="treeVirtual"
        :size="nodeHeightSize"
        :remain="30"
        :bench="30"
        :start="0"
        :scrollelement="scrollelement"
        :style="virtualStyle"
      >
        <vs-tree-node
          v-for="node in root.childNodes"
          :node="node"
          :props="props"
          :breadcrumb="breadcrumb"
          :render-after-expand="renderAfterExpand"
          :show-checkbox="showCheckbox"
          :key="getNodeKey(node)"
          :render-content="renderContent"
          @node-expand="handleNodeExpand">
        </vs-tree-node>
      </virtual-list>
      <!-- <virtual-list
        ref="treeVirtual"
        :style="virtualStyle"
        :data-key="getNodeKey"
        :data-sources="root.childNodes"
        :estimate-size="nodeHeightSize"
        :extra-props="{showCheckbox, renderContent, renderAfterExpand, handleNodeExpand}"
        :data-component="item">
      </virtual-list> -->
    </template>
    <template v-else>
      <vs-tree-node
        v-for="node in root.childNodes"
        :node="node"
        :props="props"
        :breadcrumb="breadcrumb"
        :render-after-expand="renderAfterExpand"
        :show-checkbox="showCheckbox"
        :key="getNodeKey(node)"
        :render-content="renderContent"
        @node-expand="handleNodeExpand">
      </vs-tree-node>
    </template>

    <div class="vs-tree__empty-block" v-if="isEmpty">
      <span class="vs-tree__empty-text">{{ emptyText }}</span>
    </div>
    <div
      v-show="dragState.showDropIndicator"
      class="vs-tree__drop-indicator"
      ref="dropIndicator">
    </div>
  </div>
</template>

<script>
  import TreeStore from './model/tree-store';
  import { getNodeKey, findNearestComponent } from './model/util';
  import VsTreeNode from './tree-node.vue';
  import VsTteeItem from './tree-item.vue';
  import emitter from 'vs-tree/src/mixins/emitter';
  import { addClass, removeClass } from 'vs-tree/src/utils/dom';
  import VsBreadcrumb from 'vs-tree/packages/breadcrumb';

  export default {
    name: 'VsTree',

    mixins: [emitter],

    components: {
      VsTreeNode,
      VsBreadcrumb
    },

    provide() {
      return {
        nodePrarnt: this,
        props: this.props,
        breadcrumb: this.breadcrumb,
        virtual: this.virtual,
        nodeHeightSize: this.nodeHeightSize,
        virtualStyle: this.virtualStyle
      };
    },

    data() {
      return {
        item: VsTteeItem,
        store: null,
        root: null,
        rootCopy: null,
        currentNode: null,
        treeItems: null,
        checkboxItems: [],
        breadcrumbs: [],
        dragState: {
          showDropIndicator: false,
          draggingNode: null,
          dropNode: null,
          allowDrop: true
        }
      };
    },

    props: {
      data: {
        type: Array
      },
      emptyText: {
        type: String,
        default() {
          return '暂无数据';
        }
      },
      virtualStyle: {
        type: Object,
        default() {
          return {maxHeight: '360px', overflowY: 'auto'};
        }
      },
      renderAfterExpand: {
        type: Boolean,
        default: true
      },
      nodeKey: String,
      checkStrictly: Boolean,
      defaultExpandAll: Boolean,
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      checkOnClickNode: Boolean,
      checkOnClickLeaf: Boolean,
      checkDescendants: {
        type: Boolean,
        default: false
      },
      autoExpandParent: {
        type: Boolean,
        default: true
      },
      defaultCheckedKeys: Array,
      defaultExpandedKeys: Array,
      currentNodeKey: [String, Number],
      renderContent: Function,
      showCheckbox: {
        type: Boolean,
        default: false
      },
      draggable: {
        type: Boolean,
        default: false
      },
      breadcrumbCustom: Boolean,
      allowDrag: Function,
      allowDrop: Function,
      props: {
        default() {
          return {
            children: 'children',
            label: 'label',
            disabled: 'disabled',
            parentid: 'parentid',
            count: null
          };
        }
      },
      breadcrumb: {
        type: Boolean,
        default: false
      },
      virtual: {
        type: Boolean,
        default: false
      },
      expandedOnlyLoad: {
        type: Boolean,
        default: false
      },
      lazy: {
        type: Boolean,
        default: false
      },
      highlightCurrent: Boolean,
      load: Function,
      filterNodeMethod: Function,
      accordion: Boolean,
      indent: {
        type: Number,
        default: 18
      },
      max: {
        type: Number,
        default: -1
      },
      nodeHeightSize: {
        type: Number,
        default: 26
      },
      ignoreIds: {
        type: Array,
        default: () => []
      },
      maxRegular: Function,
      iconClass: String,
      showLeafDivider: Boolean,
      breadcrumbClass: String,
      scrollelement: null,
      virtualClass: String
    },

    computed: {
      children: {
        set(value) {
          this.data = value;
        },
        get() {
          return this.data;
        }
      },

      treeItemArray() {
        return Array.prototype.slice.call(this.treeItems);
      },

      isEmpty() {
        const { childNodes } = this.root;
        return !childNodes || childNodes.length === 0 || childNodes.every(({visible}) => !visible);
      }
    },

    watch: {
      defaultCheckedKeys(newVal) {
        this.store.setDefaultCheckedKey(newVal);
      },

      defaultExpandedKeys(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },

      data(newVal) {
        this.store.setData(newVal);
      },

      checkboxItems(val) {
        Array.prototype.forEach.call(val, (checkbox) => {
          checkbox.setAttribute('tabindex', -1);
        });
      },

      checkStrictly(newVal) {
        this.store.checkStrictly = newVal;
      },

      breadcrumbs(newVal) {
        this.$emit('breadcrumb-change', newVal);
      }
    },

    methods: {
      filter(value) {
        if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
        this.store.filter(value);
      },

      getNodeKey(node) {
        return getNodeKey(this.nodeKey, node.data);
      },

      getNodePath(data) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getNodePath');
        const node = this.store.getNode(data);
        if (!node) return [];
        const path = [node.data];
        let parent = node.parent;
        while (parent && parent !== this.root) {
          path.push(parent.data);
          parent = parent.parent;
        }
        return path.reverse();
      },

      getCheckedNodes(leafOnly, includeHalfChecked) {
        return this.store.getCheckedNodes(leafOnly, includeHalfChecked);
      },

      getCheckedLeafNum() {
        return this.store.getCheckedLeafNum();
      },

      getCheckedKeys(leafOnly) {
        return this.store.getCheckedKeys(leafOnly);
      },

      getCurrentNode() {
        const currentNode = this.store.getCurrentNode();
        return currentNode ? currentNode.data : null;
      },

      getCurrentKey() {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getCurrentKey');
        const currentNode = this.getCurrentNode();
        return currentNode ? currentNode[this.nodeKey] : null;
      },

      setCheckedNodes(nodes, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedNodes(nodes, leafOnly);
      },

      setCheckedKeys(keys, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedKeys');
        this.store.setCheckedKeys(keys, leafOnly);
      },

      setChecked(data, checked, deep) {
        this.store.setChecked(data, checked, deep);
      },

      getHalfCheckedNodes() {
        return this.store.getHalfCheckedNodes();
      },

      getHalfCheckedKeys() {
        return this.store.getHalfCheckedKeys();
      },

      setCurrentNode(node) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentNode');
        this.store.setUserCurrentNode(node);
      },

      setCurrentKey(key) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentKey');
        this.store.setCurrentNodeKey(key);
      },

      getNode(data) {
        return this.store.getNode(data);
      },

      remove(data) {
        this.store.remove(data);
      },

      append(data, parentNode) {
        this.store.append(data, parentNode);
      },

      insertBefore(data, refNode) {
        this.store.insertBefore(data, refNode);
      },

      insertAfter(data, refNode) {
        this.store.insertAfter(data, refNode);
      },

      handleNodeExpand(nodeData, node, instance) {
        this.broadcast('VsTreeNode', 'tree-node-expand', node);
        this.$emit('node-expand', nodeData, node, instance);
      },

      updateKeyChildren(key, data) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in updateKeyChild');
        this.store.updateChildren(key, data);
      },

      initTabIndex() {
        this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]');
        this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
        const checkedItem = this.$el.querySelectorAll('.is-checked[role=treeitem]');
        if (checkedItem.length) {
          checkedItem[0].setAttribute('tabindex', 0);
          return;
        }
        this.treeItems[0] && this.treeItems[0].setAttribute('tabindex', 0);
      },

      handleKeydown(ev) {
        const currentItem = ev.target;
        if (currentItem.className.indexOf('vs-tree-node') === -1) return;
        const keyCode = ev.keyCode;
        this.treeItems = this.$el.querySelectorAll('.is-focusable[role=treeitem]');
        const currentIndex = this.treeItemArray.indexOf(currentItem);
        let nextIndex;
        if ([38, 40].indexOf(keyCode) > -1) { // up、down
          ev.preventDefault();
          if (keyCode === 38) { // up
            nextIndex = currentIndex !== 0 ? currentIndex - 1 : 0;
          } else {
            nextIndex = (currentIndex < this.treeItemArray.length - 1) ? currentIndex + 1 : 0;
          }
          this.treeItemArray[nextIndex].focus(); // 选中
        }
        if ([37, 39].indexOf(keyCode) > -1) { // left、right 展开
          ev.preventDefault();
          currentItem.click(); // 选中
        }
        const hasInput = currentItem.querySelector('[type="checkbox"]');
        if ([13, 32].indexOf(keyCode) > -1 && hasInput) { // space enter选中checkbox
          ev.preventDefault();
          hasInput.click();
        }
      },
      onload(node, resolve, expandedOnlyLoad) {
        node.isLoading = true;
        this.load(node, (data, addbread) => {
          if (data && Array.isArray(data)) {
            resolve(data);

            if (this.breadcrumb && !node.isLeaf && addbread && !expandedOnlyLoad && !node.isCheckLoading) {
              this.breadcrumbs.push(node);
              node.expanded = false;
              this.root = node;
              this.forceRender();
            }
            this.$nextTick(() => {
              if (node.isCheckLoading) {
                node.childNodes.forEach(v => {
                  v.checked = true;
                  this.store.setChecked(v, true);
                });
              }
              node.isLoading = false;
              node.isCheckLoading = false;
              this.$emit('load-change', data, node);
            });
          }
        });
      },
      onCutCrumb(idx) {
        idx = idx < 0 ? -1 : idx;
        if (idx === -1) {
          this.breadcrumbs = [];
        } else {
          this.breadcrumbs = this.breadcrumbs.splice(0, idx + 1);
        }

        if (this.breadcrumbs.length) {
          this.root = this.breadcrumbs[this.breadcrumbs.length - 1];
        } else {
          this.root = this.store.root;
        }
        this.forceRender();
      },
      forceRender() {
        this.$nextTick(()=> {
          if (this.$refs.treeVirtual) {
            this.$refs.treeVirtual.setScrollTop();
            this.$refs.treeVirtual.forceRender();
          }
        });
      },
      clearCheckAll(noClear) {
        noClear = noClear || this.ignoreIds || [];
        this.store.getCheckedKeys().filter(v=> {
          if (!noClear.find(id => v === id)) {
            this.store.setChecked(v, false);
          }
          return false;
        });
        return [];
      },
      setRootCrumb() {
        this.onCutCrumb(-1);
      }
    },

    created() {
      this.isTree = true;

      this.store = new TreeStore({
        key: this.nodeKey,
        data: this.data,
        lazy: this.lazy,
        max: this.max,
        maxRegular: this.maxRegular,
        props: this.props,
        load: this.onload,
        ignoreIds: this.ignoreIds,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly,
        checkDescendants: this.checkDescendants,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod,
        expandedOnlyLoad: this.expandedOnlyLoad
      });

      this.root = this.store.root;

      let dragState = this.dragState;
      this.$on('tree-node-drag-start', (event, treeNode) => {
        if (typeof this.allowDrag === 'function' && !this.allowDrag(treeNode.node)) {
          event.preventDefault();
          return false;
        }
        event.dataTransfer.effectAllowed = 'move';

        // wrap in try catch to address IE's error when first param is 'text/plain'
        try {
          // setData is required for draggable to work in FireFox
          // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
          event.dataTransfer.setData('text/plain', '');
        } catch (e) {}
        dragState.draggingNode = treeNode;
        this.$emit('node-drag-start', treeNode.node, event);
      });

      this.$on('tree-node-drag-over', (event, treeNode) => {
        const dropNode = findNearestComponent(event.target, 'VsTreeNode');
        const oldDropNode = dragState.dropNode;
        if (oldDropNode && oldDropNode !== dropNode) {
          removeClass(oldDropNode.$el, 'is-drop-inner');
        }
        const draggingNode = dragState.draggingNode;
        if (!draggingNode || !dropNode) return;

        let dropPrev = true;
        let dropInner = true;
        let dropNext = true;
        let userAllowDropInner = true;
        if (typeof this.allowDrop === 'function') {
          dropPrev = this.allowDrop(draggingNode.node, dropNode.node, 'prev');
          userAllowDropInner = dropInner = this.allowDrop(draggingNode.node, dropNode.node, 'inner');
          dropNext = this.allowDrop(draggingNode.node, dropNode.node, 'next');
        }
        event.dataTransfer.dropEffect = dropInner ? 'move' : 'none';
        if ((dropPrev || dropInner || dropNext) && oldDropNode !== dropNode) {
          if (oldDropNode) {
            this.$emit('node-drag-leave', draggingNode.node, oldDropNode.node, event);
          }
          this.$emit('node-drag-enter', draggingNode.node, dropNode.node, event);
        }

        if (dropPrev || dropInner || dropNext) {
          dragState.dropNode = dropNode;
        }

        if (dropNode.node.nextSibling === draggingNode.node) {
          dropNext = false;
        }
        if (dropNode.node.previousSibling === draggingNode.node) {
          dropPrev = false;
        }
        if (dropNode.node.contains(draggingNode.node, false)) {
          dropInner = false;
        }
        if (draggingNode.node === dropNode.node || draggingNode.node.contains(dropNode.node)) {
          dropPrev = false;
          dropInner = false;
          dropNext = false;
        }

        const targetPosition = dropNode.$el.getBoundingClientRect();
        const treePosition = this.$el.getBoundingClientRect();

        let dropType;
        const prevPercent = dropPrev ? (dropInner ? 0.25 : (dropNext ? 0.45 : 1)) : -1;
        const nextPercent = dropNext ? (dropInner ? 0.75 : (dropPrev ? 0.55 : 0)) : 1;

        let indicatorTop = -9999;
        const distance = event.clientY - targetPosition.top;
        if (distance < targetPosition.height * prevPercent) {
          dropType = 'before';
        } else if (distance > targetPosition.height * nextPercent) {
          dropType = 'after';
        } else if (dropInner) {
          dropType = 'inner';
        } else {
          dropType = 'none';
        }

        const iconPosition = dropNode.$el.querySelector('.vs-tree-node__expand-icon').getBoundingClientRect();
        const dropIndicator = this.$refs.dropIndicator;
        if (dropType === 'before') {
          indicatorTop = iconPosition.top - treePosition.top;
        } else if (dropType === 'after') {
          indicatorTop = iconPosition.bottom - treePosition.top;
        }
        dropIndicator.style.top = indicatorTop + 'px';
        dropIndicator.style.left = (iconPosition.right - treePosition.left) + 'px';

        if (dropType === 'inner') {
          addClass(dropNode.$el, 'is-drop-inner');
        } else {
          removeClass(dropNode.$el, 'is-drop-inner');
        }

        dragState.showDropIndicator = dropType === 'before' || dropType === 'after';
        dragState.allowDrop = dragState.showDropIndicator || userAllowDropInner;
        dragState.dropType = dropType;
        this.$emit('node-drag-over', draggingNode.node, dropNode.node, event);
      });

      this.$on('tree-node-drag-end', (event) => {
        const { draggingNode, dropType, dropNode } = dragState;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';

        if (draggingNode && dropNode) {
          const draggingNodeCopy = { data: draggingNode.node.data };
          if (dropType !== 'none') {
            draggingNode.node.remove();
          }
          if (dropType === 'before') {
            dropNode.node.parent.insertBefore(draggingNodeCopy, dropNode.node);
          } else if (dropType === 'after') {
            dropNode.node.parent.insertAfter(draggingNodeCopy, dropNode.node);
          } else if (dropType === 'inner') {
            dropNode.node.insertChild(draggingNodeCopy);
          }
          if (dropType !== 'none') {
            this.store.registerNode(draggingNodeCopy);
          }

          removeClass(dropNode.$el, 'is-drop-inner');

          this.$emit('node-drag-end', draggingNode.node, dropNode.node, dropType, event);
          if (dropType !== 'none') {
            this.$emit('node-drop', draggingNode.node, dropNode.node, dropType, event);
          }
        }
        if (draggingNode && !dropNode) {
          this.$emit('node-drag-end', draggingNode.node, null, dropType, event);
        }

        dragState.showDropIndicator = false;
        dragState.draggingNode = null;
        dragState.dropNode = null;
        dragState.allowDrop = true;
      });

      this.$on('node-click', (event, node) => {
        if (this.breadcrumb && !node.isLeaf && !node.isLoading) {
          this.breadcrumbs.push(node);
          this.root = node;
          this.forceRender();
        }
      });
    },

    mounted() {
      this.initTabIndex();
      this.$el.addEventListener('keydown', this.handleKeydown);
    },

    updated() {
      this.treeItems = this.$el.querySelectorAll('[role=treeitem]');
      this.checkboxItems = this.$el.querySelectorAll('input[type=checkbox]');
    }
  };
</script>
