
import TreeStore from './tree-store'
import { insterAfter, onDragEnterGap, parseTemplate } from '../utils'

let setepId = 0

interface TreeNodeOptions {
  store: TreeStore;
  parent: TreeNode | any;
  data: any
}

export default class TreeNode {
  // 唯一ID
  id: number = setepId++
  // 是否选中
  checked = false
  // 是否展开
  expanded = false
  // 是否半选
  indeterminate = false
  // 是否显示
  visbile = false
  // 是否禁用
  disabled = false
  // 是否加载完成
  loaded = false
  // 是否为叶子节点
  isLeaf = false
  // 子节点
  childNodes: TreeNode[] = []
  // 公共仓库
  store: TreeStore
  // 父节点
  parent: TreeNode
  // 原始数据
  originData: any
  // 缓存
  __buffer: {
    [key: string]: any;
  }
  // 原属数据备份
  data: {
    [key: string]: any;
  }
  // 排序ID
  sortId: number = 0
  // 子节点数量
  hasChildCount = 0
  // 节点dom
  dom: any
  // 选中的节点
  checkboxNode?: HTMLInputElement
  // 选中单选节点
  radioNode?: HTMLInputElement
  // loading元素
  loadingEl?: HTMLSpanElement
  // 是否加载中
  loading: any
  // 展开元素
  expandEl?: HTMLSpanElement
  // 复选元素
  checkboxEl?: HTMLInputElement
  // 过渡动画节点
  transitionNode: any
  // 是否需要展开节点
  requireExpand?: boolean

  constructor (options: TreeNodeOptions) {
    const { store, parent, data } = options
    this.store = store
    this.parent = parent
    this.originData = data
    this.__buffer = Object.create({})

    this.data = Object.assign({}, data)
    if (typeof this.store.format === 'function' && !data._vsroot) {
      const _data = this.store.format(Object.assign({}, data), this)
      if (typeof _data !== 'object') {
        throw new TypeError('format must return object! \nformat: function(data) {\n  return {id, name, children, isLeaf, icon, extra}\n}')
      }

      ['id', 'name', 'children', 'isLeaf', 'icon', 'extra'].map(key => {
        if (Object.prototype.hasOwnProperty.call(_data, key)) {
          this.data[key] = _data[key]
        }
      })
    }

    // 是否继承父节点选中状态
    if (this.store.checkInherit && this.parent) {
      this.checked = this.parent.checked
    }

    // 是否继承父节点禁用状态
    if (this.store.disabledInherit && this.parent) {
      this.disabled = this.parent.disabled
    }

    // 是否为默认展开节点
    if (this.store.expandKeys.includes(this.data.id)) {
      this.expanded = true
    }

    // 是否为默认禁用节点
    if (this.store.disabledKeys.includes(this.data.id)) {
      this.disabled = true
    }

    if (this.data) {
      if (this.store.async && this.parent?.level === 0 && this.parent?.data?.children.length < 100) {
        setTimeout(() => {
          this.setData(this.data)
          this.store.updateNodes()
        }, 0);
      } else {
        this.setData(this.data)
      }
    }

    this.initData()
  }

  // 节点层级
  get level(): number {
    return this.parent ? this.parent.level + 1 : 0
  }

  initData (): void {
    if (this.level > this.store.expandLevel && this.store.expandLevel !== -1 && !(this.parent?.expanded)) {
      this.visbile = false
    } else {
      this.visbile = true
    }
  }

  createNode (): HTMLElement {
    if (this.dom) {
      this.checkboxNode && (this.checkboxNode.checked = this.checked)
      this.radioNode && (this.radioNode.checked = this.checked)
      if (this.indeterminate) this.dom.classList.add('is-indeterminate')
      return this.dom
    }

    const dom = document.createElement('div')
    dom.className = 'vs-tree-node'
    dom.setAttribute('vs-index', `${this.id}`)
    if (this.indeterminate) dom.classList.add('is-indeterminate')

    !this.isLeaf && this.data.children?.length && dom.setAttribute('vs-child', `${true}`)

    dom.appendChild(this.createInner())

    const slotAppend = parseTemplate('append', this)
    if (slotAppend) {
      dom.appendChild(slotAppend)
    } else if (this.store.renderContent) {
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

      if (this.store.checkOnClickNode && !this.disabled && !(this.store.breadcrumb && !this.isLeaf)) {
        this.handleCheckChange({
          target: { checked: !this.checked }
        })
      }

      this.store.selectedCurrent = this

      if (this.store.breadcrumb && !this.isLeaf) {
        this.store.breadcrumb.list.push(this)
        this.setExpand(true)
      }

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

  createInner (): HTMLElement {
    const dom = document.createElement('div')
    dom.className = 'vs-tree-inner'
    // 当隐藏根节点时减少一级缩进
    let level = this.level + (this.store.hideRoot ? -1 : 0)

    if (this.store.breadcrumb) {
      level = 0
    }

    if (this.store.showLine) {
      for (let i = 0; i < level; i++) {
        const indent = document.createElement('span')
        indent.className = 'vs-indent-unit'
        dom.appendChild(indent)
      }
    } else {
      dom.style.paddingLeft = level * this.store.indent + 'px'
    }

    let expandDom
    if (!this.store.breadcrumb) {
      if (this.store.strictLeaf) {
        expandDom = !this.isLeaf ? this.createExpand() : this.createExpandEmpty()
      } else {
        expandDom = (this.data.children?.length || this.store.lazy) && !this.isLeaf ? this.createExpand() : this.createExpandEmpty()
      }
      dom.appendChild(expandDom)
    } else {
      this.loadingEl = document.createElement('span')
      this.loadingEl.className = 'vs-loading-unit'
      dom.appendChild(this.loadingEl)
    }

    if (this.store.showCheckbox || this.store.showRadio) {
      if ((!this.store.nocheckParent) || (this.isLeaf && !this.data.children?.length)) {
        dom.appendChild(this.createCheckbox())
      }
    }

    if (this.store.showIcon) {
      if (!this.store.onlyShowLeafIcon || (!this.data.children?.length || this.isLeaf)) {
        dom.appendChild(this.createIcon())
      }
    }

    dom.appendChild(this.createText())
    return dom
  }

  // 自定义Dom 节点
  cusmtomNode (name: string, info: any): HTMLElement {
    const box = document.createElement(name)
    info.text && (box.innerText = info.text)
    info.className && (box.className = info.className)
    if (info.children) {
      info.children.forEach((v: HTMLElement) => {
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
    tpl.addEventListener('click', (e: any) => {
      e.stopPropagation()
    }, { passive: false })
    return tpl
  }

  // 叶子节点-无需展开
  createExpandEmpty () {
    const dom = document.createElement('span')
    dom.className = 'expand-empty ' + this.store.expandClass
    return dom
  }

  // 有子元素-需要展开
  createExpand () {
    const dom = document.createElement('span')
    dom.className = 'expand ' + this.store.expandClass

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

  createCheckbox (): HTMLElement {
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

  handleCheckChange (e: any): void {
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
    this.store._change(this)
  }

  createText (): HTMLElement {
    const slot = parseTemplate('name', this)
    if (slot) {
      return slot
    }

    const dom = document.createElement('span')
    dom.innerText = this.data.name
    dom.className = 'vs-tree-text'
    return dom
  }

  createIcon (): HTMLElement {
    const icon = document.createElement('span')
    icon.className = (this.isLeaf && !this.childNodes.length) ? 'vs-icon-leaf' : 'vs-icon-parent'
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

  setData (data: any): void {
    this.store.dataMap.set(data.id, this)
    this.store.nodeMap.set(this.id, this)
    this.data = data
    this.childNodes = []

    if (typeof data.isLeaf === 'boolean') {
      this.isLeaf = data.isLeaf
    } else if (!data.children && !this.store.lazy) {
      this.isLeaf = true
    }

    let children: any[]
    if (this.level === 0 && this.data instanceof TreeNode) {
      children = [this.data]
    } else {
      children = this.data.children || []
    }

    if (children.length) {
      this.loaded = true
    }

    const next = () => {
      for (let i = 0, j = children.length; i < j; i++) {
        this.insertChild({ data: children[i] })
      }
    }
    next()
  }

  insertChild (child: any, index = -1): TreeNode {
    if (!(child instanceof TreeNode)) {
      Object.assign(child, {
        parent: this,
        store: this.store
      })
      child = new TreeNode(child)
    }

    if (typeof index === 'undefined' || index < 0) {
      this.childNodes.push(child)
    } else {
      this.childNodes.splice(index, 0, child)
    }
    return child
  }

  insertBefore (child: any, ref: TreeNode): void {
    let index
    if (ref) {
      index = this.childNodes.indexOf(ref)
    }
    this.insertChild(child, index)
  }

  insertAfter (child: any, ref: TreeNode): void {
    let index
    if (ref) {
      index = this.childNodes.indexOf(ref)
      if (index !== -1) index += 1
    }
    this.insertChild(child, index)
  }

  // 设置展开状态
  updateExpand (expand = false): void {
    this.childNodes.map(v => {
      v.visbile = expand && this.expanded
      v.updateExpand(expand)
    })
  }

  // 更新本身及子节点状态
  updateChecked (check = false, isInitDefault = false): void {
    if ((!isInitDefault && this.disabled)) return
    if (!this.store.showCheckbox) return
    // if (this.disabled) return
    this.checked = check
    this.sortId = Date.now()
    this.checkboxNode && (this.checkboxNode.checked = check)
    this.dom && this.dom.classList.remove('is-indeterminate')

    // 验证关联关系
    if (this.store.allowEmit(check, 'p')) {
      this.parent && (this.parent.indeterminate = false)
    }

    if (!this.store.allowEmit(check, 's')) {
      return
    }

    if (this.childNodes.length) {
      this.childNodes.forEach(v => {
        v.updateChecked(check)
      })
    }
  }

  // 更新父节点状态
  updateCheckedParent (_checked = false, isInitDefault = false): void {
    if ((!isInitDefault && this.disabled)) return
    if (!this.store.showCheckbox) return
    if (!this.store.allowEmit(_checked, 'p')) {
      return
    }

    if (!this.parent || this.store.nocheckParent) return
    const isAll = this.parent.childNodes.every(v => v.checked)
    const isSome = this.parent.childNodes.some(v => v.checked || v.indeterminate)
    if (isAll) {
      this.parent.checked = true
      this.parent.indeterminate = false
      this.parent.checkboxNode && (this.parent.checkboxNode.checked = true)
      this.parent.dom && this.parent.dom.classList.remove('is-indeterminate')
    } else if (isSome) {
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
  updateRadioChecked (checked = false, isInitDefault = false): void {
    if ((!isInitDefault && this.disabled)) return

    if (this.store.nocheckParent && (this.childNodes.length || !this.isLeaf)) return
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
  setChecked (checked = false, isInitDefault = false): void {
    if (checked && this.store.checkMaxNodes(this)) {
      this.store.limitAlert()
      return
    }

    if (this.store.showRadio) {
      this.updateRadioChecked(checked, isInitDefault)
      return
    }
    if (!this.store.showCheckbox) return

    this.updateChecked(checked, isInitDefault)
    this.updateCheckedParent(checked, isInitDefault)

    this.store._change(this)
  }

  // 设置禁止选中
  setDisabled (disabled = true): void {
    this.disabled = disabled
    this.checkboxEl && (this.checkboxEl.disabled = disabled)
  }

  // 设置默认展开
  setExpand (expand: boolean, noUpdate = false) {
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
      this.loadData((data: any) => {
        if (data) {
          !noUpdate && this.storeUpdate()
        }
      })
    } else {
      !noUpdate && this.storeUpdate()
    }
  }

  storeUpdate (): void {
    if (this.store.animation) {
      this.createAnimation()
    } else {
      this.store.update()
    }
  }

  // 创建动画
  createAnimation (): void {
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
        tg.style.height = '0'
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
  createDragable (dom: HTMLElement): void {
    dom.draggable = true

    dom.addEventListener('dragstart', (e) => {
      e.stopPropagation()
      this.store.dragNode = this
      this.store.onDragstart(e, this)
      // wrap in try catch to address IE's error when first param is 'text/plain'
      try {
        // setData is required for draggable to work in FireFox
        // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
        (e as any).dataTransfer.setData('text/plain', '')
      } catch (e) { }
    })

    // Chorme下，拖拽必须禁止默认事件否则drop事件不会触发
    dom.addEventListener('dragover', (e) => {
      e.preventDefault()
    })

    dom.addEventListener('dragenter', (e) => {
      e.stopPropagation()
      e.preventDefault()

      removeClass(this.store.dropNode)

      const dropNode = this.dom
      if (!dropNode) return

      const enterGap = onDragEnterGap(e, dropNode)
      if (this.store.dragNode.dom === dropNode && enterGap === 0) return

      this.store.dropPostion = enterGap

      this.store.dropNode = dropNode

      this.store.onDragenter(e, this, dropNode, enterGap)

      if (this.store.dropable) {
        if (!this.expanded && !this.isLeaf) {
          this.setExpand(true)
        }
        if (enterGap === -1) {
          dropNode.classList.add('vs-drag-over-gap-top')
          return
        }

        if (enterGap === 1) {
          dropNode.classList.add('vs-drag-over-gap-bottom')
          return
        }
        if (!this.isLeaf) {
          dropNode.classList.add('vs-drag-enter')
        }
      }
    })

    function removeClass (dom: HTMLElement) {
      if (!dom) return
      dom.classList.remove('vs-drag-enter')
      dom.classList.remove('vs-drag-over-gap-bottom')
      dom.classList.remove('vs-drag-over-gap-top')
    }

    dom.addEventListener('dragleave', (e) => {
      if (this.store.dropable) {
        removeClass((e as any).target)
      }
    })

    dom.addEventListener('drop', (e) => {
      e.stopPropagation()
      this.store.onDrop(e, this, this.store.dropPostion)
      if (this.store.dropable) {
        removeClass(this.store.dropNode)
        const dragNode = this.store.dragNode
        if (dragNode && this.parent) {
          const data = Object.assign({}, dragNode.data)
          dragNode.remove()
          if (!data) return
          if (this.store.dropPostion === -1) {
            this.parent.insertBefore({ data }, this)
            this.updateCheckedParent()
            this.store.updateNodes()
          } else if (this.store.dropPostion === 1) {
            this.parent.insertAfter({ data }, this)
            this.updateCheckedParent()
            this.store.updateNodes()
          } else if (!this.isLeaf) {
            this.append(data)
          }
        }
      }
    })
  }

  // 更新手风琴状态
  setAccordion (expand: boolean): void {
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
  loadData (callback: Function): void {
    if (this.loading) return
    this.loading = true
    if (this.expandEl) {
      this.expandEl.classList.add('is-loading')
    } else if (this.loadingEl) {
      this.loadingEl.classList.add('is-loading')
    }

    const resolve = (children = []) => {
      this.loaded = true
      this.loading = false
      if (this.expandEl) {
        this.expandEl.classList.remove('is-loading')
      } else if (this.loadingEl) {
        this.loadingEl.classList.remove('is-loading')
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
  remove (): void {
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
  append (data: any): void {
    if (!data || typeof data !== 'object') return
    let olddom = this.dom
    if (this.childNodes.length !== 0) {
      olddom = null
    }
    const node = this.insertChild({
      data: data,
      store: this.store
    })
    this.data.children ? this.data.children.push(data) : this.data.children = [data]
    this.isLeaf = false
    if (olddom) {
      delete this.dom
      olddom.parentNode.replaceChild(this.createNode(), olddom)
    }
    node.updateCheckedParent()
    this.store.updateNodes()
  }
}
