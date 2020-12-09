
let setepId = 0

export default class Node {
  constructor (ops) {
    this.id = setepId++
    this.checked = false
    this.expanded = false
    this.indeterminate = false
    this.visbile = false
    this.disabled = false

    this.level = 0
    this.childNodes = []

    this.data = ops.data
    this.store = ops.store
    this.parent = ops.parent

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
    if (this.level > 1 && !(this.parent?.expanded)) {
      this.visbile = false
      return
    }
    this.visbile = true
  }

  createNode () {
    if (this.dom) {
      this.checkboxNode && (this.checkboxNode.checked = this.checked)
      return this.dom
    }
    const dom = document.createElement('div')
    dom.className = 'tree-node'

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

      if (this.store.checkOnClickNode) {
        this.handleCheckChange({
          target: { checked: !this.checked }
        })
      }

      this.store.selectedCurrent = this
      this.store.click(e, this)
    }, {
      passive: false
    })
    this.dom = dom
    return dom
  }

  createInner () {
    const dom = document.createElement('div')
    // 当隐藏根节点时减少一级缩进
    const level = this.store.hideRoot ? -1 : 0
    dom.style.paddingLeft = (this.level + level) * this.store.indent + 'px'
    dom.appendChild(this.childNodes && this.childNodes.length ? this.createExpand() : this.createExpandEmpty())
    if (this.store.showCheckbox) {
      if (!this.store.nocheckParent || !this.childNodes.length) {
        dom.appendChild(this.createCheckbox())
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
    tpl.addEventListener('click', (e) => {
      e.stopPropagation()
    }, { passive: false })
    return tpl
  }

  createExpandEmpty () {
    const dom = document.createElement('span')
    dom.className = 'expand-empty'
    return dom
  }

  createExpand () {
    const dom = document.createElement('span')
    dom.className = 'expand'
    dom.innerText = '+'

    if (this.level < 1 || this.expanded) {
      dom.classList.add('expand-true')
      this.expanded = true
      dom.innerText = '-'
    }

    dom.addEventListener('click', (e) => {
      e.stopPropagation()
      const expand = !dom.classList.contains('expand-true')
      dom.innerText = expand ? '-' : '+'
      dom.classList.toggle('expand-true')
      this.setExpand(expand)
    }, {
      passive: false
    })
    this.expandEl = dom
    return dom
  }

  createCheckbox () {
    const dom = document.createElement('label')
    dom.className = 'vs-checkbox'
    const inner = document.createElement('span')
    inner.className = 'vs-checkbox__inner'
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = this.checked
    checkbox.disabled = this.disabled
    checkbox.className = 'vs-checkbox__original'

    dom.appendChild(checkbox)
    dom.appendChild(inner)

    // label 点击会出发两次
    dom.addEventListener('click', (e) => {
      e.stopPropagation()
    }, { passive: false })

    checkbox.addEventListener('click', (e) => {
      this.store.check(e, this)
    }, { passive: false })

    checkbox.addEventListener('change', (e) => {
      e.stopPropagation()
      this.handleCheckChange(e)
    })

    this.checkboxNode = checkbox
    return dom
  }

  handleCheckChange (e) {
    const checked = e.target.checked
    if (checked && this.store.max && this.store.checkMaxNodes(this)) {
      this.store.limitAlert()
      e.target.checked = false
      return
    }
    this.updateChecked(checked)
    this.updateCheckedParent(checked)
    this.store.change(this)
  }

  createText () {
    const dom = document.createElement('span')
    dom.innerText = this.data.name
    dom.className = 'name'
    return dom
  }

  setData (data) {
    this.store.dataMap.set(data.id, this)
    this.data = data
    this.childNodes = []

    let children
    if (this.level === 0 && this.data instanceof Node) {
      children = this.data
    } else {
      children = this.data.children || []
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
      this.parent.checkboxNode.checked = true
      this.parent.dom.classList.remove('is-indeterminate')
    } else if (someChecked) {
      this.parent.checked = false
      this.parent.indeterminate = true
      this.parent.checkboxNode.checked = false
      this.parent.dom.classList.add('is-indeterminate')
    } else {
      this.parent.checked = false
      this.parent.indeterminate = false
      this.parent.checkboxNode.checked = false
      this.parent.dom.classList.remove('is-indeterminate')
    }

    this.parent.updateCheckedParent()
  }

  // 设置是否选中
  setChecked (checked, isInitDefault) {
    if (!this.store.showCheckbox || (!isInitDefault && this.disabled)) return
    this.updateChecked(checked)
    this.updateCheckedParent(checked)
  }

  // 设置默认展开
  setExpand (expand) {
    this.expanded = expand
    this.updateExpand(this.expanded)
    this.store.update()
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
    if (!this.childNodes.length) {
      delete this.dom
    }
    const node = this.insertChild({
      data: data,
      store: this.store
    })
    node.updateCheckedParent()
    this.store.updateNodes()
  }
}
