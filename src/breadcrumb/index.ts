
import BreadcrumbItem from "./breadcrumb-item"

export interface BreadcrumbOptions {
  el: string | HTMLElement,
  icon?: Function | string,
  link?: Function | string,
  separator?: Function | string,
  change?: Function
}

export default class Breadcrumb {
  store: any
  list = []
  options: BreadcrumbOptions
  constructor(options: BreadcrumbOptions) {
    this.options = options
  }

  get current(): any {
    return this.list[this.list.length - 1]
  }

  renderBreadcrumb() {
    this.store = this.current.store
    const { el, change = () => { } } = this.options
    let _el: any
    if (el instanceof HTMLElement) {
      _el = el
    } else if (el && typeof el === 'string') {
      _el = document.querySelector(el)
    }
    if (!_el) {
      _el = document.createElement('section')
    }
    _el.classList.add('vs-breadcrumb')

    const bs = this.list.map((node: any) => {
      return new BreadcrumbItem(node, this).createDom()
    })

    _el.innerHTML = ''
    bs.forEach((html: HTMLElement) => {
      _el.appendChild(html)
    })
    change(_el, this.list, this.current)
  }
}
