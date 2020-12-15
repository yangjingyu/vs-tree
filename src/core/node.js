
import { insterAfter, onDragEnterGap } from './utils'
let setepId = 0

export default class Node {
  constructor (ops) {
    this.id = setepId++
    this.checked = false
    this.expanded = false
    this.indeterminate = false
    this.visbile = false
    this.disabled = false
    this.loaded = false
    this.isLeaf = false

    this.level = 0
    this.childNodes = []

    this.store = ops.store

    this.parent = ops.parent

    this.data = ops.data
    if (typeof this.store.format === 'function' && !ops.data._vsroot) {
      const _data = this.store.format(Object.assign({}, ops.data), this)
      if (typeof _data !== 'object') {
        throw new Error('format must return object! \nformat: function(data) {\n  return {id, name, children, isLeaf}\n}')
      }
      const props = ['id', 'name', 'children', 'isLeaf', 'icon', 'extra']
      props.forEach(key => {
        if (Object.prototype.hasOwnProperty.call(_data, key)) {
          this.data[key] = _data[key]
        }
      })
    }

    if (this.store.expandKeys.includes(this.data.id)) {
      this.expanded = true
    }

    if (this.store.disabledKeys.includes(this.data.id)) {
      this.disabled = true
    }

    if (this.parent) {
      this.level = this.parent.level + 1
    }

    if (this.data) {
      this.setData(this.data)
    }

    this.initData()
  }

  initData () {
    if (this.level > this.store.expandLevel && this.store.expandLevel !== -1 && !(this.parent?.expanded)) {
      this.visbile = false
      return
    }
    this.visbile = true
  }

  createNode () {
    if (this.dom) {
      this.checkboxNode && (this.checkboxNode.checked = this.checked)
      this.radioNode && (this.radioNode.checked = this.checked)
      return this.dom
    }

    const dom = document.createElement('div')
    dom.className = 'vs-tree-node'
    dom.setAttribute('vs-index', this.id)

    dom.appendChild(this.createInner())

    if (this.store.renderContent) {
      dom.appendChild(this.createContent())
    }

    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      if (this.store.highlightCurrent) {
        if (this.store.selectedCurrent) {
          this.store.selectedCurrent.dom.classList.remove('selected')
        }
        dom.classList.add('selected')
      }

      if (this.store.checkOnClickNode && !this.disabled) {
        this.handleCheckChange({
          target: { checked: !this.checked }
        })
      }

      this.store.selectedCurrent = this
      this.store.click(e, this)
    }, {
      passive: false
    })

    dom.addEventListener('contextmenu', (e) => {
      if (this.store.contextmenu && typeof this.store.contextmenu === 'function') {
        e.stopPropagation()
        e.preventDefault()
        this.store.contextmenu(e, this)
      }
    })
    if (this.store.draggable) {
      this.createDragable(dom)
    }

    this.dom = dom
    return dom
  }

  createInner () {
    const dom = document.createElement('div')
    dom.className = 'vs-tree-inner'
    // 当隐藏根节点时减少一级缩进
    const level = this.store.hideRoot ? -1 : 0

    if (this.store.showLine) {
      for (let i = 0; i < this.level + level; i++) {
        const indent = document.createElement('span')
        indent.className = 'vs-indent-unit'
        dom.appendChild(indent)
      }
    } else {
      dom.style.paddingLeft = (this.level + level) * this.store.indent + 'px'
    }

    const checkDom = (this.childNodes?.length || this.store.lazy) && !this.isLeaf ? this.createExpand() : this.createExpandEmpty()
    dom.appendChild(checkDom)
    if (this.store.showCheckbox || this.store.showRadio) {
      if (!this.store.nocheckParent || !this.childNodes.length) {
        dom.appendChild(this.createCheckbox())
      }
    }

    if (this.store.showIcon) {
      if (!this.store.onlyShowLeafIcon || (!this.childNodes.length || this.isLeaf)) {
        dom.appendChild(this.createIcon())
      }
    }

    dom.appendChild(this.createText())
    return dom
  }

  // 自定义Dom 节点
  cusmtomNode (name, info) {
    const box = document.createElement(name)
    info.text && (box.innerText = info.text)
    info.className && (box.className = info.className)
    if (info.children) {
      info.children.forEach(v => {
        box.appendChild(v)
      })
    }
    if (typeof info.click === 'function') {
      box.addEventListener('click', (e) => {
        e.stopPropagation()
        info.click(e, this)
      }, { passive: false })
    }
    return box
  }

  // 自定义内容
  createContent () {
    const tpl = this.store.renderContent(this.cusmtomNode.bind(this), this)
    if (!tpl) {
      return document.createElement('span')
    }
    tpl.addEventListener('click', (e) => {
      e.stopPropagation()
    }, { passive: false })
    return tpl
  }

  // 叶子节点-无需展开
  createExpandEmpty () {
    const dom = document.createElement('span')
    dom.className = 'expand-empty'
    return dom
  }

  // 有子元素-需要展开
  createExpand () {
    const dom = document.createElement('span')
    dom.className = 'expand'

    if (this.level < this.store.expandLevel || this.store.expandLevel === -1 || this.expanded) {
      dom.classList.add('expanded')
      this.expanded = true
    }

    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      if (this.loading) return
      const expand = !dom.classList.contains('expanded')
      // dom.classList.toggle('expanded')
      this.setExpand(expand)
    }, {
      passive: false
    })
    this.expandEl = dom
    return dom
  }

  createCheckbox () {
    let label = 'checkbox'
    if (this.store.showRadio) {
      label = 'radio'
    }
    const dom = document.createElement('label')
    dom.className = `vs-${label}`
    const inner = document.createElement('span')
    inner.className = `vs-${label}__inner`
    const checkbox = document.createElement('input')
    checkbox.type = label
    checkbox.checked = this.checked
    checkbox.disabled = this.disabled
    checkbox.className = `vs-${label}__original`
    checkbox.name = label === 'radio' ? 'vs-radio' + (this.store.radioParentoOnly ? this.parent.id : '') : 'vs-checkbox'

    if (label === 'radio') {
      checkbox.name = 'vs-radio' + (this.store.radioParentoOnly ? this.parent.id : '')
      this.radioNode = checkbox
    } else {
      checkbox.name = 'vs-checkbox'
      this.checkboxNode = checkbox
    }

    dom.appendChild(checkbox)
    dom.appendChild(inner)

    // label 点击会出发两次
    dom.addEventListener('click', (e) => {
      e.stopPropagation()
    }, { passive: false })

    // 点击回调
    checkbox.addEventListener('click', (e) => {
      this.store.check(e, this)
    }, { passive: false })

    checkbox.addEventListener('change', (e) => {
      e.stopPropagation()
      this.handleCheckChange(e)
    })

    this.checkboxEl = checkbox

    return dom
  }

  handleCheckChange (e) {
    const checked = e.target.checked

    if (typeof this.store.beforeCheck === 'function') {
      if (!this.store.beforeCheck(this)) {
        e.target.checked = !checked
        return
      }
    }

    if (checked && this.store.checkMaxNodes(this)) {
      this.store.limitAlert()
      e.target.checked = false
      return
    }

    if (this.store.showRadio) {
      this.updateRadioChecked(checked)
    } else {
      this.updateChecked(checked)
      this.updateCheckedParent(checked)
    }
    this.store.change(this)
  }

  createText () {
    const dom = document.createElement('span')
    dom.innerText = this.data.name
    dom.className = 'vs-tree-text'
    return dom
  }

  createIcon () {
    const icon = document.createElement('span')
    icon.className = (this.isLeaf || !this.childNodes.length) ? 'vs-icon-leaf' : 'vs-icon-parent'
    if (this.data.icon) {
      if (this.data.icon instanceof HTMLElement) {
        icon.style.backgroundImage = 'none'
        icon.appendChild(this.data.icon)
      } else {
        icon.classList.add(this.data.icon)
      }
    }
    return icon
  }

  setData (data) {
    this.store.dataMap.set(data.id, this)
    this.store.nodeMap.set(this.id, this)
    this.data = data
    this.childNodes = []

    if (typeof data.isLeaf === 'boolean') {
      this.isLeaf = data.isLeaf
    } else if (!data.children && !this.store.lazy) {
      this.isLeaf = true
    }

    let children
    if (this.level === 0 && this.data instanceof Node) {
      children = this.data
    } else {
      children = this.data.children || []
    }

    if (children.length) {
      this.loaded = true
    }

    for (let i = 0, j = children.length; i < j; i++) {
      this.insertChild({ data: children[i] })
    }
  }

  insertChild (child) {
    if (!(child instanceof Node)) {
      Object.assign(child, {
        parent: this,
        store: this.store
      })
      child = new Node(child)
    }

    child.level = this.level + 1

    this.childNodes.push(child)
    return child
  }

  updateExpand (expand) {
    if (this.childNodes.length) {
      this.childNodes.forEach(v => {
        if (expand && this.expanded) {
          v.visbile = true
        } else {
          v.visbile = false
        }
        v.updateExpand(expand)
      })
    }
  }

  updateChecked (check) {
    this.checked = check
    this.sortId = Date.now()
    this.checkboxNode && (this.checkboxNode.checked = check)
    this.parent && (this.parent.indeterminate = false)
    this.dom && this.dom.classList.remove('is-indeterminate')
    if (this.childNodes.length) {
      this.childNodes.forEach(v => {
        v.updateChecked(check)
      })
    }
  }

  updateCheckedParent () {
    if (!this.parent || this.store.nocheckParent) return
    const allChecked = this.parent.childNodes.every(v => v.checked)
    const someChecked = this.parent.childNodes.some(v => v.checked || v.indeterminate)
    if (allChecked) {
      this.parent.checked = true
      this.parent.indeterminate = false
      this.parent.checkboxNode && (this.parent.checkboxNode.checked = true)
      this.parent.dom && this.parent.dom.classList.remove('is-indeterminate')
    } else if (someChecked) {
      this.parent.checked = false
      this.parent.indeterminate = true
      this.parent.checkboxNode && (this.parent.checkboxNode.checked = false)
      this.parent.dom && this.parent.dom.classList.add('is-indeterminate')
    } else {
      this.parent.checked = false
      this.parent.indeterminate = false
      this.parent.checkboxNode && (this.parent.checkboxNode.checked = false)
      this.parent.dom && this.parent.dom.classList.remove('is-indeterminate')
    }

    this.parent.updateCheckedParent()
  }

  // 更新单选节点选中
  updateRadioChecked (checked) {
    // 父节点下唯一
    if (this.store.radioParentoOnly) {
      if (this.store.radioMap[this.parent.id]) {
        this.store.radioMap[this.parent.id].checked = false
      }
      this.store.radioMap[this.parent.id] = this
    } else {
      if (this.store.radioNode) {
        this.store.radioNode = false
      }
      this.store.radioNode = this
    }

    this.checked = checked
    this.radioNode && (this.radioNode.checked = checked)
  }

  // 设置是否选中
  setChecked (checked, isInitDefault) {
    if ((!isInitDefault && this.disabled)) return
    if (this.store.showRadio) {
      this.updateRadioChecked(checked)
      return
    }
    if (!this.store.showCheckbox) return
    this.updateChecked(checked)
    this.updateCheckedParent(checked)
  }

  // 设置禁止选中
  setDisabled (disabled = true) {
    this.disabled = disabled
    this.checkboxEl && (this.checkboxEl.disabled = disabled)
  }

  // 设置默认展开
  setExpand (expand, noUpdate) {
    this.expanded = expand
    this.updateExpand(this.expanded)
    this.setAccordion(expand)

    if (this.expandEl) {
      if (expand) {
        this.expandEl.classList.add('expanded')
      } else {
        this.expandEl.classList.remove('expanded')
      }
    }

    if (this.store.lazy && !this.loaded) {
      this.loadData((data) => {
        if (data) {
          !noUpdate && this.storeUpdate()
        }
      })
    } else {
      !noUpdate && this.storeUpdate()
    }
  }

  storeUpdate () {
    if (this.store.animation) {
      this.createAnimation()
    } else {
      this.store.update()
    }
  }

  // 创建动画
  createAnimation () {
    this.transitionNode && this.transitionNode.parentNode && this.transitionNode.parentNode.removeChild(this.transitionNode)
    const tg = document.createElement('div')
    tg.className = 'vs-transition'

    if (this.childNodes.length > this.store.showCount) {
      for (let i = 0; i < this.store.showCount - 1; i++) {
        const _v = this.childNodes[i]
        tg.appendChild(_v.dom || _v.createNode())
      }
    } else {
      this.childNodes.forEach((_v) => {
        tg.appendChild(_v.dom || _v.createNode())
      })
    }

    insterAfter(tg, this.dom)

    const animatHeight = ((this.childNodes.length > this.store.showCount ? this.store.showCount : this.childNodes.length) * this.store.itemHeight) + 'px'
    if (this.expanded) {
      setTimeout(() => {
        tg.style.height = animatHeight
      }, 0)
    } else {
      tg.style.height = animatHeight
      setTimeout(() => {
        tg.style.height = 0
      }, 0)
    }

    const transend = () => {
      tg.removeEventListener('transitionend', transend)
      tg.parentNode && tg.parentNode.removeChild(tg)
      tg.removeEventListener('transitionend', transend)
      this.store.update()
    }

    tg.addEventListener('transitionend', transend)

    this.transitionNode = tg
  }

  // 创建拖拽
  createDragable (dom) {
    dom.draggable = true

    dom.addEventListener('dragstart', (e) => {
      console.log(e)
    })

    dom.addEventListener('dragenter', (e) => {
      e.stopPropagation()
      const key = e.target.getAttribute('vs-index')
      if (!key) return
      const enterGap = onDragEnterGap(e, this)
      if (dom === e.target && enterGap === 0) return

      console.log(this.store.nodeMap)
      console.log(this.store.nodeMap.get(Number(key)))

      e.target.classList.add('vs-drag-enter')

      if (enterGap === -1) {
        e.target.classList.remove('vs-drag-over-gap-bottom')
        e.target.classList.add('vs-drag-over-gap-top')
      }
      if (enterGap === 1) {
        e.target.classList.remove('vs-drag-over-gap-top')
        e.target.classList.add('vs-drag-over-gap-bottom')
      }
    })

    dom.addEventListener('dragleave', (e) => {
      e.target.classList.remove('vs-drag-enter')
      e.target.classList.remove('vs-drag-over-gap-bottom')
      e.target.classList.remove('vs-drag-over-gap-top')
    })
  }

  // 更新手风琴状态
  setAccordion (expand) {
    if (this.store.accordion && this.parent && expand) {
      const preExpand = this.store.expandMap[this.parent.id]
      if (preExpand === this) return
      if (preExpand) {
        preExpand.setExpand(false)
      }
      this.store.expandMap[this.parent.id] = this
    }
  }

  // 加载数据
  loadData (callback) {
    if (this.loading) return
    this.loading = true
    if (this.expandEl) {
      this.expandEl.classList.add('is-loading')
    }

    const resolve = (children = []) => {
      this.loaded = true
      this.loading = false
      if (this.expandEl) {
        this.expandEl.classList.remove('is-loading')
      }

      if (children.length) {
        children.forEach(data => {
          this.insertChild({
            data: data,
            store: this.store
          })
        })
        this.childNodes[0].updateCheckedParent()
        this.store.updateNodes()
      }

      if (callback) {
        callback.call(this, children)
      }
    }

    this.store.load(this, resolve)
  }

  // 删除节点
  remove () {
    const parent = this.parent
    if (!parent) return
    const children = parent.childNodes || []
    const index = children.findIndex(d => d.id === this.id)
    if (index > -1) {
      children.splice(index, 1)
    }
    this.store.updateNodes()
  }

  // 添加节点
  append (data) {
    if (!data || typeof data !== 'object') return
    let olddom = this.dom
    if (this.childNodes.length !== 0) {
      olddom = null
    }
    const node = this.insertChild({
      data: data,
      store: this.store
    })
    if (olddom) {
      delete this.dom
      olddom.parentNode.replaceChild(this.createNode(), olddom)
    }
    node.updateCheckedParent()
    this.store.updateNodes()
  }
}
