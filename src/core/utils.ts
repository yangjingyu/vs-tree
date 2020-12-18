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
