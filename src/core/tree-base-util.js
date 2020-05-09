export function isCheckDisabled(node) {
  const { isDisabled } = node;
  return !!isDisabled;
}

export function isInArray(needle, haystack) {
  return haystack.length > 0 && haystack.indexOf(needle) > -1;
}

export function getIndexOfArray(list, key) {
  return list.findIndex(v => v.key === key);
}

export function flatTreeData(nodes = []) {
  const lists = [];
  function flat(list) {
    return list.map(treeNode => {
      lists.push(treeNode);
      flat(treeNode.children || []);
      return treeNode;
    });
  }
  flat(nodes);
  return lists;
}
