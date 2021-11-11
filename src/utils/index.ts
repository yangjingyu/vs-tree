import TreeNode from "../core/tree-node"

export const noop = () => { }

/**
 * @function insterAfter
 * @memberof utils
 * @desc 目标节点后插入新节点
 * @param {HTMLElement} newElement 新的dom
 * @param {HTMLElement} targetElement 目标的dom
 * @return {HTMLElement|null}
 */
export function insterAfter(newElement: HTMLElement, targetElement: HTMLElement) {
  const parent = targetElement.parentNode
  if (!parent) { return }
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling)
  }
}

/**
 * @function onDragEnterGap
 * @memberof utils
 * @desc 目标节点后插入新节点
 * @param {MouseEvent} e 鼠标事件
 * @param {HTMLElement} treeNode 当前node节点
 * @return {(-1|0|1)} -1 top 0 center 1 bottom
 */
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

export const parseTemplate = (name: string, ctx: TreeNode) => {
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

/**
 * @function getDom
 * @memberof utils
 * @desc 获取节点dom
 * @param {string|HTMLElement} selector 选择器或dom
 * @return {HTMLElement|null}
 */
export function getDom(selector: string | HTMLElement): HTMLElement | null {
  if (typeof selector === 'string') {
    return document.querySelector(selector)
  } else if (selector instanceof HTMLElement){
    return selector
  }
  return null
}