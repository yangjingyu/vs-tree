import Node from "./node";
export default class TreeStore {
  constructor(options) {
    for (let option in options) {
      if (options.hasOwnProperty(option)) {
        this[option] = options[option];
      }
    }

    this.dataMap = new Map();

    this.root = new Node({
      data: this.data,
      store: this
    });
  }

  setData(val) {
    this.root.setData(val)
  }

  // 获取选中节点
  getCheckedNodes() {
    const nodes = this.nodes.filter(v => v.checked);
    if (this.sort) {
      return nodes.sort((a, b) => a.sortId - b.sortId).map(v => v.data)
    }
    return nodes.map(v => v.data)
  }

  // 验证是否已经选到最大
  checkMaxNodes(node) {
    const len = this.getCheckedNodes().length;
    if (len > this.max) {
      return true;
    }
    
    if(node.childNodes.length > this.max) {
      return true
    }
    return false
  }
}