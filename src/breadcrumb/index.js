export default class Breadcrumb {
  constructor (node) {
    this.node = node
    this.data = node.data
    this.store = node.store
  }

  createDom () {
    const breads = this.store.breadcrumbs
    const index = breads.findIndex(v => v === this.node)
    const last = index === breads.length - 1
    const dom = document.createElement('span')

    if (typeof this.store.breadcrumbRenderIcon === 'function') {
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
    icon.innerHTML = this.store.breadcrumbRenderIcon(this.node, this.data)
    return icon
  }

  createLink (breads, index, last) {
    const link = document.createElement('span')
    link.className = 'vs-breadcrumb-link'

    if (typeof this.store.breadcrumbRender === 'function') {
      link.innerHTML = this.store.breadcrumbRenderLink(this.node, this.data)
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
    if (typeof this.store.breadcrumbRenderSeparator === 'function') {
      separator.innerHTML = this.store.breadcrumbRenderSeparator(this.node, this.data)
    } else if (typeof this.store.breadcrumbRenderSeparator === 'string') {
      separator.innerHTML = this.store.breadcrumbRenderSeparator
    } else {
      separator.innerHTML = '/'
    }
    return separator
  }
}
