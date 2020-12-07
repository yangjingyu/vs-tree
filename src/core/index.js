import TreeStore from "./store"
import Vlist from "../virtual-list"
const noop = () => {}
export default class Tree {
  constructor(selector, ops) {
    this.$options = ops;
    this.$el = document.querySelector(selector)

    if (!this.$el) {
      throw Error('请为组件提供根节点')
    }
    // 每一项的高度
    this.itemHeight = ops.itemHeight || 26;
    // 当前可见数量
    this.showCount = ops.showCount || 20;
    // 最大高度
    this.maxHeight = ops.maxHeight || '400px';
    // 唯一ID
    this.dataKey = ops.dataKey || 'id'
    // 当前可见项
    this.data = [];

    this.store = new TreeStore({
      data: ops.data,
      max: ops.max,
      limitAlert: ops.limitAlert || noop,
      update: () => {
        this.createNode();
      },
    });

    this.store.setData(ops.data)

    this.root = this.store.root;

    this.nodes = this.getAllNodes(this.root)

    this.store.nodes = this.nodes;

    this.init()

  }

  init() {
    this.vlist = new Vlist({
      root: this.$el,
      data: this.data,
      maxHeight: this.maxHeight,
      estimateSize: this.itemHeight,
      keeps: this.showCount,
    })
    this.createNode()
  }

  getAllNodes(node) {
    const nodes = []
    const expand = (val) => {
      nodes.push(val)
      if (val.childNodes && val.childNodes.length) {
        val.childNodes.forEach(element => {
          expand(element)
        });
      }
    }
    expand(node)
    return nodes;
  }

  createNode() {
    this.data = this.nodes.filter(v => {
      return v.visbile
    });

    this.vlist.update(this.data)
  }

  // 获取选中节点
  getCheckedNodes() {
    return this.store.getCheckedNodes();
  }

}