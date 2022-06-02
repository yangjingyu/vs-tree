import TreeStore from './store'
import Vlist from '../virtual-list'
import Breadcrumb from '../breadcrumb'

const noop = () => { }
export default class Tree {
  constructor(selector, ops) {
    if (typeof selector === 'string') {
      this.$el = document.querySelector(selector)
    } else {
      this.$el = selector
    }

    if (!(this.$el instanceof HTMLElement)) {
      throw Error('请为组件提供根节点')
    }

    this.$el.classList.add('vs-tree')

    const delimiters = ['#\\[\\[', '\\]\\]']

    const [open, close] = delimiters
    var interpolate = open + '([\\s\\S]+?)' + close
    this.interpolate = new RegExp(interpolate, 'igm')
    const slotsMap = {}
    const slots = this.$el.querySelectorAll('[tree-slot]')
    if (slots && slots.length) {
      slots.forEach(v => {
        const name = v.attributes['tree-slot'].value
        const scope = v.attributes['tree-slot-scope'].value

        slotsMap[name] = {
          scope,
          node: v,
          interpolate: this.interpolate,
          text: v.innerText,
          inner: v.outerHTML
        }

        v.parentNode.removeChild(v)
      })
    }

    // 默认清空根节点
    // this.$el.innerHTML = ''

    if (ops.theme) {
      this.$el.classList.add('vs-theme-' + ops.theme)
    }

    if (Array.isArray(ops.data)) {
      this._data = {
        _vsroot: true,
        name: ops.rootName || '---',
        children: ops.data
      }
      if (!ops.rootName) {
        ops.hideRoot = true
      }
    } else if (typeof ops.data === 'object') {
      this._data = ops.data
    } else {
      throw Error('参数data仅支持对象或数组！')
    }

    this.nodes = []
    const { showCount = 20, itemHeight = 26, maxHeight = '400px', minHeight = '0px' } = ops.virtual || {}
    // 每一项的高度
    this.itemHeight = itemHeight
    // 当前可见数量
    this.showCount = showCount
    // 最大高度
    this.maxHeight = ops.maxHeight || maxHeight
    // 最小高度
    this.minHeight = ops.minHeight || minHeight
    // 当前可见列表
    this.data = []
    // 关键字过滤
    this.keyword = ''
    this.searchFilter = ops.searchFilter
    this.ready = ops.ready || noop

    if (Object.prototype.toString.call(ops.breadcrumb) === '[object Object]') {
      this.$$breadcrumb = new Breadcrumb(ops.breadcrumb)
    }

    const start = () => {
      this.store = new TreeStore({
        data: this._data,
        max: ops.max,
        slots: slotsMap,
        breadcrumb: this.$$breadcrumb || null,
        strictLeaf: ops.strictLeaf || false,
        showCount: this.showCount,
        itemHeight: this.itemHeight,
        hideRoot: ops.hideRoot || false,
        animation: ops.animation || false, // 动画
        expandLevel: typeof ops.expandLevel === 'number' ? ops.expandLevel : 1, // 默认展开1级节点
        beforeCheck: ops.beforeCheck || null,
        showLine: ops.showLine || false, // 是否显示连接线
        showIcon: ops.showIcon || false,
        onlyShowLeafIcon: ops.onlyShowLeafIcon || false,
        showCheckbox: ops.showCheckbox || false,
        checkboxType: ops.checkboxType || { Y: 'ps', N: 'ps' },
        checkInherit: ops.checkInherit || false, // 新加入节点时自动继承父节点选中状态
        disabledInherit: ops.disabledInherit || false, // 新加入节点时自动继承父节点禁用状态
        showRadio: ops.showRadio || false,
        highlightCurrent: ops.highlightCurrent || false,
        checkFilterLeaf: ops.checkFilterLeaf || false, // 过滤非叶子节点
        checkFilter: ops.checkFilter || null, // 过滤选中节点
        accordion: ops.accordion || false, // 手风琴模式
        draggable: ops.draggable || false,
        dropable: ops.dropable || false,
        lazy: ops.lazy || false,
        sort: ops.sort || false,
        indent: ops.indent || 10,
        checkedKeys: ops.checkedKeys || [],
        expandKeys: ops.expandKeys || [],
        disabledKeys: ops.disabledKeys || [],
        limitAlert: ops.limitAlert || noop,
        click: ops.click || noop,
        check: ops.check || noop, // 复选框被点击时出发
        change: ops.change || noop,
        load: ops.load || noop,
        contextmenu: ops.contextmenu || null,
        radioParentoOnly: ops.radioType === 'level' ? 'level' : 'all', // 每个父节点下唯一，仅raido模式有效
        renderContent: ops.renderContent || null,
        nocheckParent: ops.nocheckParent || false, // 只允许叶子节点选中
        checkOnClickNode: ops.checkOnClickNode || false,
        format: ops.format || null,
        searchRender: ops.searchRender || null,
        searchDisabledChecked: ops.searchDisabledChecked || false,
        expandClass: ops.expandClass || 'vs-expand-icon',
        onDragstart: ops.onDragstart || noop,
        onDragenter: ops.onDragenter || noop,
        onDrop: ops.onDrop || noop,
        update: () => {
          this._render()
        },
        nodesChange: (nodes) => {
          this.nodes = nodes
          this.vlist && this._render()
        }
      })

      if (this.store.hideRoot) {
        // 根节点创建dom
        this.store.root.createNode()
      }

      this._init()

      // 设置默认选中
      this.store.setDefaultChecked()
    }

    if (ops.async) {
      setTimeout(() => {
        start()
      }, 0)
    } else {
      start()
    }
  }

  _init() {
    this.vlist = new Vlist({
      root: this.$el,
      data: [],
      maxHeight: this.maxHeight,
      minHeight: this.minHeight,
      estimateSize: this.itemHeight,
      keeps: this.showCount
    })
    this._render()
    this.ready && this.ready(this)
  }

  _render(update = true) {
    if (this.$$breadcrumb) {
      const { current } = this.$$breadcrumb
      this.data = this.nodes.filter(v => v.parent && v.parent.id === current.id)
      // 当前仅过滤面包屑当前层级
      this._keywordFilter(this.data)
      this.$$breadcrumb.renderBreadcrumb()
    } else {
      this._keywordFilter(this.nodes)
    }
    update && this.vlist.update(this.data)
  }

  _keywordFilter(data) {
    this.data = data.filter(v => {
      // 过滤隐藏节点 ｜ 隐藏root节点
      return this._hasKeyword(v) && v.visbile && !(this.store.hideRoot && v.level === 0)
    })
  }

  _hasKeyword(v) {
    if (!this.keyword) return true
    let boo = this._checkFilter(v)
    if (!boo) {
      v.childNodes.forEach(node => {
        if (!boo) {
          boo = this._hasKeyword(node)
        }
      })
    } else {
      v.parent && (v.parent.requireExpand = true)
    }
    return boo
  }

  _checkFilter(v) {
    if (!this.keyword) return
    if (typeof this.searchFilter === 'function') {
      return this.searchFilter(this.keyword, v, v.data)
    }
    return v.data.name && v.data.name.includes(this.keyword)
  }

  // 过滤节点
  filter(keyword = '', onlySearchLeaf) {
    this.keyword = keyword
    this.store.onlySearchLeaf = onlySearchLeaf && !!keyword
    this.store.isSearch = !!keyword
    if (this.store.onlySearchLeaf) {
      const data = this.nodes.filter(v => !v.childNodes.length && this._checkFilter(v) && !(this.store.hideRoot && v.level === 0))
      this.vlist.update(data)
      return data
    }

    this._render(false)
    for (let i = 0, len = this.data.length; i < len; i++) {
      const v = this.data[i]
      if (v.requireExpand) {
        v.requireExpand = false
        v.setExpand(true, true)
      }
    }
    this._render()
    return this.data
  }

  // 根据ID获取节点
  getNodeById(id) {
    return this.store.getNodeById(id)
  }

  // 获取选中节点
  getCheckedNodes() {
    return this.store.getCheckedNodes(...arguments)
  }

  // 设置最大可选
  setMaxValue(value = 0) {
    this.store.max = value
  }

  // 滚动到索引位置
  scrollToIndex(index = 0) {
    this.vlist.scrollToIndex(index)
  }

  // 清空选中元素
  clearCheckedNodes() {
    const nodes = this.getCheckedNodes(true)
    nodes.forEach(node => {
      node.setChecked(false)
    })
  }
}
