import TreeStore from './store'
import Vlist from '../virtual-list'
import Breadcrumb from '../breadcrumb'

const noop = () => { }
export default class Tree {
  constructor (selector, ops) {
    var obj = new Proxy(ops, {
      get: function (target, propKey, receiver) {
        console.log(`getting ${propKey}!`)
        return Reflect.get(target, propKey, receiver)
      },
      set: function (target, propKey, value, receiver) {
        console.log(`setting ${propKey}!`)
        return Reflect.set(target, propKey, value, receiver)
      }
    })
    this.$options = obj

    if (typeof selector === 'string') {
      this.$el = document.querySelector(selector)
    } else {
      this.$el = selector
    }

    if (!(this.$el instanceof HTMLElement)) {
      throw Error('请为组件提供根节点')
    }

    this.$el.classList.add('vs-tree')

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

    //
    this.nodes = []
    // 每一项的高度
    this.itemHeight = ops.itemHeight || 26
    // 当前可见数量
    this.showCount = ops.showCount || 20
    // 最大高度
    this.maxHeight = ops.maxHeight || '400px'
    // 唯一ID
    this.dataKey = ops.dataKey || 'id'
    // 当前可见项
    this.data = []
    // 关键字过滤
    this.keyword = ''
    this.searchFilter = ops.searchFilter
    this.ready = ops.ready || noop

    const start = () => {
      this.store = new TreeStore({
        data: this._data,
        max: ops.max,
        breadcrumb: ops.breadcrumb || null,
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
        radioParentoOnly: ops.radioParentoOnly || false, // 每个父节点下唯一，仅raido模式有效
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
          this.render()
        },
        nodesChange: (nodes) => {
          this.nodes = nodes
          this.vlist && this.render()
        }
      })

      // this.store.setData(this._data)

      if (this.store.hideRoot) {
        // 跟节点创建dom
        this.store.root.createNode()
      }

      this.init()

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

  init () {
    this.vlist = new Vlist({
      root: this.$el,
      data: [],
      maxHeight: this.maxHeight,
      estimateSize: this.itemHeight,
      keeps: this.showCount
    })
    this.render()
    this.ready && this.ready(this)
  }

  render (update = true) {
    if (typeof this.store.breadcrumb === 'object') {
      const bread = this.store.breadcrumbs[this.store.breadcrumbs.length - 1]
      this.data = this.nodes.filter(v => v.parent && v.parent.data.id === bread.data.id)
    } else {
      this.data = this.nodes.filter(v => {
        // 过滤隐藏节点 ｜ 隐藏root节点
        return this.hasKeyword(v) && v.visbile && !(this.store.hideRoot && v.level === 0)
      })
    }
    update && this.vlist.update(this.data)

    this.renderBreadcrumb()
  }

  renderBreadcrumb () {
    const { el, change = noop } = this.store.breadcrumb
    let _el
    if (el instanceof HTMLElement) {
      _el = el
    } else if (el && typeof el === 'string') {
      _el = document.querySelector(el)
    }
    if (!_el) {
      _el = document.createElement('section')
    }
    _el.classList.add('vs-breadcrumb')

    const bs = this.store.breadcrumbs.map((node) => {
      return new Breadcrumb(node).createDom()
    })

    _el.innerHTML = ''
    bs.forEach(html => {
      _el.appendChild(html)
    })
    change(_el, this.store.breadcrumbs)
  }

  // TODO:
  hasKeyword (v) {
    if (!this.keyword) return true
    let boo = this.checkFilter(v)
    if (!boo) {
      v.childNodes.forEach(node => {
        if (!boo) {
          boo = this.hasKeyword(node)
        }
      })
    } else {
      v.parent && (v.parent.requireExpand = true)
    }
    return boo
  }

  checkFilter (v) {
    if (!this.keyword) return
    if (typeof this.searchFilter === 'function') {
      return this.searchFilter(this.keyword, v, v.data)
    }
    return v.data.name && v.data.name.includes(this.keyword)
  }

  // 过滤节点
  filter (keyword = '', onlySearchLeaf) {
    this.keyword = keyword

    this.store.onlySearchLeaf = onlySearchLeaf && !!keyword
    this.store.isSearch = !!keyword
    if (this.store.onlySearchLeaf) {
      const data = this.nodes.filter(v => !v.childNodes.length && this.checkFilter(v) && !(this.store.hideRoot && v.level === 0))
      this.vlist.update(data)
      return data
    }

    this.render(false)
    for (let i = 0, len = this.data.length; i < len; i++) {
      const v = this.data[i]
      if (v.requireExpand) {
        v.requireExpand = false
        v.setExpand(true, true)
      }
    }
    this.render()
    return this.data
  }

  // 根据ID获取节点
  getNodeById (id) {
    return this.store.getNodeById(id)
  }

  // 获取选中节点
  getCheckedNodes () {
    return this.store.getCheckedNodes()
  }

  // 设置最大可选
  setMaxValue (value = 0) {
    this.store.max = value
  }

  // 滚动到索引位置
  scrollToIndex (index = 0) {
    this.vlist.scrollToIndex(index)
  }
}
