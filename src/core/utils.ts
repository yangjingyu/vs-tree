import Node from "./node"

export function insterAfter(newElement: HTMLElement, targetElement: HTMLElement) {
  const parent = targetElement.parentNode
  if (!parent) { return }
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling)
  }
}

export function onDragEnterGap(e: MouseEvent, treeNode: HTMLElement) {
  var offsetTop = treeNode.getBoundingClientRect().top
  var offsetHeight = treeNode.offsetHeight
  var pageY = e.pageY
  var gapHeight = 2
  if (pageY > offsetTop + offsetHeight - offsetHeight) {
    return 1 // bottom
  }
  if (pageY < offsetTop + gapHeight) {
    return -1 // top
  }
  return 0
}

export const findNearestNode = (element: HTMLElement, name: string) => {
  let target: any = element
  while (target && target?.tagName !== 'BODY') {
    if (target.className && target.className.includes(name)) {
      return target
    }
    target = target.parentNode
  }
  return null
}


export const parseTemplate = (name: string, ctx: Node) => {
  const slotName = ctx.store.slots[name]
    if (slotName) {
      const node = slotName.node.cloneNode(true)
      node.classList.add('vs-tree-text')
      node.setAttribute('tree-node-id', ctx.id)
      ctx.__buffer = {}

      var prefix = `
        var ${slotName.scope} = _;
      `
      slotName.text
        .replace(slotName.interpolate, (a: string, b: string) => {
          prefix += `_.__buffer['${a}'] = ${b};`
        })

      // eslint-disable-next-line no-new-func
      const render = new Function('_', prefix)

      render.call(ctx, ctx)

      node.innerText = node.innerText.replace(slotName.interpolate, (a: any) => {
        return (ctx as any).__buffer[a]
      }).replace(/\n/g, '')

      return node
    }
    return false
}