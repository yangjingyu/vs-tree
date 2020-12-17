export default class Breadcrumb {
  constructor (node) {
    this.node = node
    this.data = node.data
    this.store = node.store
    const { icon, link, separator = '/' } = this.store.breadcrumb
    this.renderIcon = icon
    this.renderLink = link
    this.renderSeparator = separator
  }

  createDom () {
    const breads = this.store.breadcrumbs
    const index = breads.findIndex(v => v === this.node)
    const last = index === breads.length - 1
    const dom = document.createElement('span')

    if (this.renderIcon) {
      dom.appendChild(this.createIcon())
    }

    dom.appendChild(this.createLink(breads, index, last))

    if (!last) {
      dom.appendChild(this.createSeparator())
    }

    return dom
  }

  createIcon () {
    const icon = document.createElement('span')
    icon.className = 'vs-breadcrumb-icon'
    if (typeof this.renderIcon === 'function') {
      const _iconInner = this.renderIcon(this.node, this.data)
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

  createLink (breads, index, last) {
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
