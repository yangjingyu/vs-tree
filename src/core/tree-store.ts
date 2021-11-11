import { DataItem } from '.'
import Breadcrumb from '../breadcrumb'
import TreeNode from './tree-node'

interface TreeStoreOptions {
  data: DataItem
  max: number
  slots: any
  breadcrumb: Breadcrumb | null
  strictLeaf: boolean
  showCount: number
  itemHeight: number
  hideRoot: boolean
  animation: boolean // 动画
  expandLevel: number // 默认展开1级节点
  showLine: boolean // 是否显示连接线
  showIcon: boolean
  onlyShowLeafIcon: boolean
  showCheckbox: boolean
  checkboxType: { Y: string, N: string }
  checkInherit: boolean // 新加入节点时自动继承父节点选中状态
  disabledInherit: boolean // 新加入节点时自动继承父节点禁用状态
  showRadio: boolean
  highlightCurrent: boolean
  checkFilterLeaf: boolean // 过滤非叶子节点
  accordion: boolean // 手风琴模式
  draggable: boolean
  dropable: boolean
  lazy: boolean
  sort: boolean
  indent: number
  checkedKeys: (string|number)[]
  expandKeys: (string|number)[]
  disabledKeys: (string|number)[]
  radioParentoOnly: 'level' | 'all' // 每个父节点下唯一，仅raido模式有效
  nocheckParent: boolean // 只允许叶子节点选中
  checkOnClickNode: boolean
  searchDisabledChecked: boolean
  expandClass: string
  beforeCheck: Function
  checkFilter: Function | null // 过滤选中节点
  limitAlert: Function
  click: Function
  check: Function
  change: Function
  load: Function
  contextmenu: Function | null
  renderContent: Function | null
  format: Function | null
  searchRender: Function | null
  onDragstart: Function
  onDragenter: Function
  onDrop: Function
  update: Function | null
  nodesChange: Function | null
  [key: string]: any
}

export default class TreeStore {
  [key: string]: any;
  // 根节点
  root: TreeNode
  // 节点列表
  nodes: TreeNode[] = []
  // 当前选中节点
  radioMap: {
    [index: number]: TreeNode
  } = {}
  // 当前展开节点
  expandMap: {
    [index: number]: TreeNode
  } = {}

  constructor (options: TreeStoreOptions) {
    for (const option in options) {
      if (Object.prototype.hasOwnProperty.call(options, option)) {
        this[option] = options[option]
      }
    }

    this.dataMap = new Map()
    this.nodeMap = new Map()

    this.root = new TreeNode({
      data: this.data,
      store: this,
      parent: null
    })

    this.updateNodes()

    // 面包屑
    if (this.breadcrumb) {
      this.breadcrumb.list.push(this.root)
    }

    this.changeNodes = []
  }

  setData (val: any) {
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
    const nodes: TreeNode[] = []
    const dig = (val: TreeNode) => {
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
  getNodeById (id: number|string) {
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
    this.checkedKeys.forEach((id: number) => {
      const node = this.getNodeById(id)
      if (node) {
        node.setChecked(true, true)
      } else {
        console.warn('not found node by ' + id)
      }
    })
  }

  // 验证是否已经选到最大
  checkMaxNodes (node: TreeNode) {
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

  getUnCheckLeafsCount (node: TreeNode) {
    let count = this._checkVerify(node) && !node.checked ? 1 : 0
    node.childNodes.forEach(v => {
      count += this.getUnCheckLeafsCount(v)
    })
    return count
  }

  // 关联判断
  allowEmit (check: boolean, type: string) {
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

  _checkVerify (node: TreeNode) {
    if (typeof this.checkFilter === 'function') {
      return this.checkFilter(node)
    } else if (this.checkFilterLeaf) {
      return node.isLeaf
    } else {
      return true
    }
  }

  // 节点切换选中时触发
  _change(node: TreeNode) {
    this.changeNodes.push(node)
    if (this._changeTimer) clearTimeout(this._changeTimer)
    this._changeTimer = setTimeout(() => {
      this.change(this.changeNodes)
      this.changeNodes = []
    }, 0)
  }
}
