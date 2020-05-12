<template>
  <div>
    <m-breadcrumb :data="crumb" @change="onCrumbChange" />
    <div class="m-tree">
      <m-checkbox
        v-for="n of current.children"
        :key="n.key"
        :title="n.title"
        :value="n.isChecked"
        :disabled="n.isDisabled"
        :half-checked="n.isHalfChecked"
        @label-click="onLabelClick(n, $event)"
        @change="onClick(n, $event)"
      >
        <slot name="label" :node="n"></slot>
      </m-checkbox>
      <div class="m-tree__nodata" v-if="current.children && !current.children.length">
        <slot name="nodata" />
      </div>
    </div>
  </div>
</template>

<script>
import Tree from '../../core';
import breadcrumb from '../breadcrumb';
import checkbox from '../checkbox';

export default {
  name: 'm-tree',
  components: {
    [checkbox.name]: checkbox,
    [breadcrumb.name]: breadcrumb
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => Object.create({})
    }
  },
  data() {
    return {
      tree: null,
      crumb: []
    };
  },
  computed: {
    current() {
      return this.crumb.length ? this.crumb[this.crumb.length - 1] : {};
    }
  },
  watch: {
    data: {
      handler() {
        this.init();
      },
      immediate: true
    }
  },
  methods: {
    init() {
      this.tree = new Tree(this.data, this.options);
      this.crumb = this.tree.rootData;
    },
    onClick(n) {
      n.isChecked = !n.isChecked;
      this.tree.update(n);
      this.$emit('change', n, this.tree);
      this.$emit('selected', this.tree.getCheckedNodeList());
    },
    onLabelClick(n, event) {
      event.stopPropagation();
      this.$emit('click', n);
      if (!n.isLeaf) {
        this.crumb.push(n);
      } else {
        this.onClick(n);
      }
    },
    onCrumbChange(item, index) {
      this.crumb.splice(index + 1);
    },
    popCrumb() {
      this.canPopCrumb && this.crumb.pop();
    }
  }
};
</script>

<style lang="less">
.m-tree {
  & ~ .m-tree {
    margin-top: 10px;
  }

  &__nodata {
    text-align: center;
  }
}

.m-tree {
  .m-checkbox {
    height: 50px;
    padding: 0 16px;
    background-color: white;
    font-size: 20px;
    border-bottom: 1px solid #eee;

    &__label {
      font-size: 16px;
    }
  }
}
</style>