export function insterAfter (newElement, targetElement) {
  var parent = targetElement.parentNode
  if (parent.lastChild === targetElement) {
    parent.appendChild(newElement)
  } else {
    parent.insertBefore(newElement, targetElement.nextSibling)
  }
}

function getOffset (ele) {
  var el = ele
  var _x = 0
  var _y = 0
  while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
    _x += el.offsetLeft - el.scrollLeft
    _y += el.offsetTop - el.scrollTop
    el = el.offsetParent
  }
  return { top: _y, left: _x }
}

export function onDragEnterGap (e, treeNode) {
  var offsetTop = (0, getOffset)(treeNode.dom).top
  var offsetHeight = treeNode.dom.offsetHeight
  var pageY = e.pageY

  var gapHeight = 2
  if (pageY > offsetTop + offsetHeight - 5) {
    return 1 // bottom
  }

  if (pageY < offsetTop + gapHeight) {
    return -1 // top
  }
  return 0
}
