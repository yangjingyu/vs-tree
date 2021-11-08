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
    this.nodeMap = new Map()

    // 当前选中节点
    this.radioMap = {}

    // 当前展开节点
    this.expandMap = {}

    this.root = new Node({
      data: this.data,
      store: this
    })

    this.updateNodes()

    // 面包屑
    if (this.breadcrumb) {
      this.breadcrumb.list.push(this.root)
    }

    this.changeNodes = []
  }

  setData (val) {
    this.root.childNodes = []
    this.root.setData(val)
    this.updateNodes()
  }

  // 更新节点列表
  updateNodes () {
    this.nodes = this.flattenTreeData()
    this.nodesChange(this.nodes)
  }

  // 获取节点列表
  flattenTreeData () {
    const nodes = []
    const dig = (val) => {
      nodes.push(val)
      if (val.childNodes && val.childNodes.length) {
        for (let i = 0, len = val.childNodes.length; i < len; i++) {
          dig(val.childNodes[i])
        }
      }
    }
    dig(this.root)
    return nodes
  }

  // 根据ID获取节点
  getNodeById (id) {
    return this.dataMap.get(id)
  }

  // 获取选中节点
  getCheckedNodes (isTreeNode = false) {
    const nodes = this.nodes.filter(v => v.checked && !v.data._vsroot && this._checkVerify(v) && (!this.nocheckParent || !v.childNodes.length))
    if (this.sort) {
      const sortNodes = nodes.sort((a, b) => a.sortId - b.sortId)
      if (isTreeNode) {
        return sortNodes
      }
      return sortNodes.map(v => v.data)
    }
    if (isTreeNode) {
      return nodes
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
    if (!this.max) {
      return false
    }

    if (!node.checked && node.hasChildCount > this.max) {
      return true
    }

    const len = this.getCheckedNodes().length

    if (!node.checked && len + (node.isLeaf ? 1 : this.getUnCheckLeafsCount(node)) > this.max) {
      return true
    }

    return false
  }

  getUnCheckLeafsCount (node) {
    let count = this._checkVerify(node) && !node.checked ? 1 : 0
    node.childNodes.forEach(v => {
      count += this.getUnCheckLeafsCount(v)
    })
    return count
  }

  // 关联判断
  allowEmit (check, type) {
    const { Y, N } = this.checkboxType
    if (check) {
      if (!Y.includes(type)) {
        return false
      }
    } else {
      if (!N.includes(type)) {
        return false
      }
    }
    return true
  }

  _checkVerify (node) {
    if (typeof this.checkFilter === 'function') {
      return this.checkFilter(node)
    } else if (this.checkFilterLeaf) {
      return node.isLeaf
    } else {
      return true
    }
  }

  // 节点切换选中时触发
  _change(node) {
    this.changeNodes.push(node)
    if (this._changeTimer) clearTimeout(this._changeTimer)
    this._changeTimer = setTimeout(() => {
      this.change(this.changeNodes)
      this.changeNodes = []
    }, 0)
  }
}
