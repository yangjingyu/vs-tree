/* eslint-disable no-empty */

export default class TreeNode {
  constructor(option, parent = null, service = null) {
    if (option instanceof TreeNode) {
      return option;
    }
    this.service = service || null;
    this.origin = option;
    this.key = option.key;
    this.parentNode = parent;
    this._title = option.title || '---';
    this._isLeaf = option.isLeaf || false;
    this._children = [];
    // option params
    this._isChecked = option.checked || false;
    this._isDisabled = option.disabled || false;
    this._isHalfChecked = false;
    this._isLoading = false;

    if (parent) {
      this.level = parent.level + 1;
    } else {
      this.level = 0;
    }

    if (typeof option.children !== 'undefined' && option.children !== null) {
      option.children.forEach(nodeOptions => {
        if (option.checked && !option.disabled && !nodeOptions.disabled) {
          nodeOptions.checked = option.checked;
        }
        this._children.push(new TreeNode(nodeOptions, this));
      });
    }
  }

  get treeService() {
    return this.service || (this.parentNode && this.parentNode.treeService);
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  get children() {
    return this._children;
  }

  set children(value) {
    this._children = value;
  }

  get isLeaf() {
    return this._isLeaf;
  }

  set isLeaf(value) {
    this._isLeaf = value;
  }

  get isChecked() {
    return this._isChecked;
  }

  set isChecked(value) {
    this._isChecked = value;
    this.origin.checked = value;
    this.refresh('isChecked');
  }

  get isHalfChecked() {
    return this._isHalfChecked;
  }

  set isHalfChecked(value) {
    this._isHalfChecked = value;
  }

  get isDisabled() {
    return this._isDisabled;
  }

  set isDisabled(value) {
    this._isDisabled = value;
  }

  get isLoading() {
    return this._isLoading;
  }

  set isLoading(value) {
    this._isLoading = value;
  }

  // 获取父节点
  getParentNode() {
    return this.parentNode;
  }

  // 获取子节点
  getChildren() {
    return this.children;
  }

  // 添加子节点
  addChildren(children) {
    if (!this.isLeaf) {
      children.forEach(node => {
        const child = new TreeNode(node, this);
        child.level = this.level + 1;
        child.origin.level = child.level;
        this.children.push(child);
      });
      this.origin.children = this.getChildren().map(v => v.origin);
      this.isLoading = false;
    }
    this.refresh('reRender');
  }

  // 刷新节点
  refresh(key) {
    if (this.treeService) {
      switch (key) {
        case 'isChecked':
          this.treeService.setCheckedNodeList(this);
          break;
        case 'reRender':
          this.treeService.flatTreeData();
          break;
      }
    }
  }
}
