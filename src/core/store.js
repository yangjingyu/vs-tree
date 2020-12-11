import Node from './node'
export default class TreeStore {
  constructor (options) {
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option)) {
        this[option] = options[option]
      }
    }

    this.nodes = []

    this.dataMap = new Map()

    // 当前选中节点
    this.radioMap = {}

    // 当前展开节点
    this.expandMap = {}

    this.root = new Node({
      data: this.data,
      store: this
    })
  }

  setData (val) {
    this.root.setData(val)
    this.updateNodes()
  }

  // 更新节点列表
  updateNodes () {
    this.nodes = this.getAllNodes()
    this.nodesChange(this.nodes)
  }

  // 获取节点列表
  getAllNodes () {
    const nodes = []
    const expand = (val) => {
      nodes.push(val)
      if (val.childNodes && val.childNodes.length) {
        val.childNodes.forEach(element => {
          expand(element)
        })
      }
    }
    expand(this.root)
    return nodes
  }

  // 根据ID获取节点
  getNodeById (id) {
    return this.dataMap.get(id)
  }

  // 获取选中节点
  getCheckedNodes () {
    const nodes = this.nodes.filter(v => v.checked && !v.data._vsroot && (!this.nocheckParent || !v.childNodes.length))
    if (this.sort) {
      return nodes.sort((a, b) => a.sortId - b.sortId).map(v => v.data)
    }
    return nodes.map(v => v.data)
  }

  // 设置默认选中
  setDefaultChecked () {
    this.checkedKeys.forEach(id => {
      const node = this.getNodeById(id)
      if (node) {
        node.setChecked(true, true)
      } else {
        console.warn('not found node by ' + id)
      }
    })
  }

  // 验证是否已经选到最大
  checkMaxNodes (node) {
    const len = this.getCheckedNodes().length
    if (len > this.max) {
      return true
    }

    if (node.childNodes.length > this.max) {
      return true
    }
    return false
  }
}
