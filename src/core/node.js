
let setepId = 0

export default class Node {
  constructor(ops) {
    this.id = setepId++
    this.checked = false
    this.expanded = false
    this.indeterminate = false
    this.visbile = false

    this.level = 0
    this.childNodes = []

    this.data = ops.data
    this.store = ops.store
    this.parent = ops.parent

    if (this.parent) {
      this.level = this.parent.level + 1
    }

    if (this.data) {
      this.setData(this.data)
    }

    this.initData()

  }

  initData() {
    if (this.level > 1) {
      return this.visbile = false
    }
    this.visbile = true;
  }

  createNode() {
    if (this.dom) {
      this.checkboxNode.checked = this.checked;
      return this.dom;
    }
    const dom = document.createElement('div')
    dom.className = 'tree-node'
    this.loaded = true;
    dom.appendChild(this.createInner())
    dom.addEventListener('click', (e) => {
      if (this.store.selectedCurrent) {
        this.store.selectedCurrent.dom.classList.remove('selected');
      }
      dom.classList.add('selected');
      this.store.selectedCurrent = this;
    });
    this.dom = dom;
    return dom
  }

  createInner() {
    const dom = document.createElement('div')
    dom.style.paddingLeft = this.level * 10 + 'px'
    dom.appendChild(this.childNodes && this.childNodes.length ? this.createExpand() : this.createExpandEmpty())
    dom.appendChild(this.createCheckbox())
    dom.appendChild(this.createText())
    return dom
  }

  createExpandEmpty() {
    const dom = document.createElement('span')
    dom.className = 'expand-empty'
    return dom
  }

  createExpand() {
    const dom = document.createElement('span')
    dom.className = "expand"
    dom.innerText = "+"

    if (this.level < 1) {
      dom.classList.add('expand-true');
      this.expanded = true
      dom.innerText = "-"
    }

    dom.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dom.classList.contains('expand-true')) {
        dom.classList.remove('expand-true')
        dom.innerText = "+"
        this.expanded = false
      } else {
        dom.innerText = "-"
        dom.classList.add('expand-true')
        this.expanded = true
      }
      this.updateExpand(this.expanded)
      this.store.update()
    })
    return dom;
  }

  createCheckbox() {
    const dom = document.createElement('span')
    const checkbox = document.createElement('input')
    dom.appendChild(checkbox)
    checkbox.type = 'checkbox'
    checkbox.checked = this.checked;

    checkbox.addEventListener('change', (e) => {
      const boo = e.target.checked;
      if (boo && this.store.max && this.store.checkMaxNodes(this)) {
        this.store.limitAlert();
        e.target.checked = false;
        return;
      }
      this.updateChecked(boo)
      this.updateCheckedParent(boo)
    });
    this.checkboxNode = checkbox;
    return dom;
  }

  createText() {
    const dom = document.createElement('span')
    dom.innerText = this.data.name;
    dom.className = 'name'
    return dom;
  }

  setData(data) {
    this.data = data;
    this.childNodes = [];

    let children;
    if (this.level === 0 && this.data instanceof Node) {
      children = this.data
    } else {
      children = this.data.children || []
    }

    for (let i = 0, j = children.length; i < j; i++) {
      this.insertChild({ data: children[i] });
    }
  }

  insertChild(child) {
    if (!(child instanceof Node)) {
      Object.assign(child, {
        parent: this,
        store: this.store
      })
      child = new Node(child)
    }

    child.level = this.level + 1

    this.childNodes.push(child)
  }

  updateExpand(expand) {
    if (this.childNodes.length) {
      this.childNodes.forEach(v => {
        if (expand && this.expanded) {
          v.visbile = true
        } else {
          v.visbile = false
        }
        v.updateExpand(expand)
      });
    }
  }

  updateChecked(check) {
    this.checked = check;
    this.checkboxNode && (this.checkboxNode.checked = check);
    this.parent && (this.parent.indeterminate = false)
    this.dom && this.dom.classList.remove('half-checked')
    if (this.childNodes.length) {
      this.childNodes.forEach(v => {
        v.updateChecked(check)
      });
    }
  }

  updateCheckedParent() {
    if (!this.parent) return;
    const allChecked = this.parent.childNodes.every(v => v.checked);
    const someChecked = this.parent.childNodes.some(v => v.checked || v.indeterminate);
    if (allChecked) {
      this.parent.checked = true;
      this.parent.indeterminate = false;
      this.parent.checkboxNode.checked = true;
      this.parent.dom.classList.remove('half-checked')
    } else if (someChecked) {
      this.parent.checked = false;
      this.parent.indeterminate = true;
      this.parent.checkboxNode.checked = false;
      this.parent.dom.classList.add('half-checked')
    } else {
      this.parent.checked = false;
      this.parent.indeterminate = false;
      this.parent.checkboxNode.checked = false;
      this.parent.dom.classList.remove('half-checked')
    }

    this.parent.updateCheckedParent()
  }
}