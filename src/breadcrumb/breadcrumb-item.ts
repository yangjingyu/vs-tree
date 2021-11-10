import Breadcrumb from '.'
import TreeNode from '../core/tree-node'
import TreeStore from '../core/tree-store'
export default class BreadcrumbItem {
  node: TreeNode
  data: { [key: string]: any }
  store: TreeStore
  parent: Breadcrumb
  renderIcon: any
  renderLink: any
  renderSeparator: any
  constructor (node: TreeNode, parent: Breadcrumb) {
    this.node = node
    this.data = node.data
    this.store = node.store
    this.parent = parent

    const { icon, link, separator = '/' } = this.parent.options
    this.renderIcon = icon
    this.renderLink = link
    this.renderSeparator = separator
  }

  createDom () {
    const breads = this.parent.list
    const index = breads.findIndex(v => v === this.node)
    const last = index === breads.length - 1
    const dom = document.createElement('span')

    if (this.renderIcon) {
      const icon = this.createIcon()
      icon && dom.appendChild(icon)
    }

    dom.appendChild(this.createLink(breads, index, last))

    if (!last) {
      dom.appendChild(this.createSeparator())
    }

    return dom
  }

  createIcon () {
    let _iconInner
    if (typeof this.renderIcon === 'function') {
      _iconInner = this.renderIcon(this.node, this.data)
    } else {
      _iconInner = this.renderIcon
    }
    if (!_iconInner) return false

    const icon = document.createElement('span')
    icon.className = 'vs-breadcrumb-icon'
    if (typeof this.renderIcon === 'function') {
      if (_iconInner instanceof HTMLElement) {
        icon.appendChild(_iconInner)
      } else {
        icon.innerHTML = _iconInner
      }
    } else {
      icon.innerHTML = this.renderIcon
    }
    return icon
  }

  createLink (breads: Breadcrumb[], index: number, last: boolean) {
    const link = document.createElement('span')
    link.className = 'vs-breadcrumb-link'

    if (typeof this.renderLink === 'function') {
      const _linkR = this.renderLink(this.node, this.data)
      if (_linkR instanceof HTMLElement) {
        link.appendChild(_linkR)
      } else {
        link.innerHTML = _linkR
      }
    } else {
      link.innerHTML = this.data.name
    }

    link.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      if (last) return
      breads.splice(index + 1)
      this.store.update()
    })
    return link
  }

  createSeparator () {
    const separator = document.createElement('span')
    separator.className = 'vs-breadcrumb-separator'
    if (typeof this.renderSeparator === 'function') {
      separator.innerHTML = this.renderSeparator(this.node, this.data)
    } else {
      separator.innerHTML = this.renderSeparator
    }
    return separator
  }
}
