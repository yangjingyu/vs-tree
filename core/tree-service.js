import {
  flatTreeData,
  isCheckDisabled,
  isInArray,
  getIndexOfArray
} from './tree-base-util';

export default class TreeService {
  constructor(nodes) {
    this.rootNodes = [];
    this.checkedNodeList = [];
    this.flattenData = [];

    this.rootNodes = nodes;
    this.checkedNodeList = [];
  }

  initTree(nodes) {
    this.rootNodes = nodes;
    this.checkedNodeList = [];
  }

  /**
   * 展平节点数据
   * @param {Tree=} nodes 
   */
  flatTreeData(nodes = this.rootNodes) {
    this.flattenData = flatTreeData(nodes);
  }

  /**
   * 返回选中的列表
   * @return TreeNode[]
   */
  getCheckedNodeList() {
    const unique = node => {
      const parentNode = node.getParentNode();
      if (parentNode) {
        if (
          this.checkedNodeList.findIndex(n => n.key === parentNode.key) > -1
        ) {
          return true;
        }
        return unique(parentNode);
      }
      return false;
    };
    return this.checkedNodeList.filter(n => !unique(n));
  }

  /**
   * 保存已选中节点
   * @param {TreeNode=} node 
   */
  setCheckedNodeList(node) {
    const index = getIndexOfArray(this.checkedNodeList, node.key);
    if (node.isChecked && index === -1) {
      this.checkedNodeList.push(node);
    } else if (!node.isChecked && index > -1) {
      this.checkedNodeList = this.checkedNodeList.filter(
        n => node.key !== n.key
      );
    }
  }

  /**
   * 重置其他节点的状态
   * @param {TreeNode=} node 
   */
  conduct(node) {
    const { isChecked } = node;
    if (node) {
      this.conductUp(node);
      this.conductDown(node, isChecked);
    }
  }

  /**
   * 设置祖先节点的选中状态
   * @param {TreeNode=} node
   */
  conductUp(node) {
    const parentNode = node.getParentNode();
    if (parentNode) {
      if (!isCheckDisabled(parentNode)) {
        if (parentNode.children.every(child => isCheckDisabled(child) || (!child.isHalfChecked && child.isChecked))) {
          parentNode.isChecked = true;
          parentNode.isHalfChecked = false;
        } else if (parentNode.children.some(child => child.isHalfChecked || child.isChecked)) {
          parentNode.isChecked = false;
          parentNode.isHalfChecked = true;
        } else {
          parentNode.isChecked = false;
          parentNode.isHalfChecked = false;
        }
      }
      this.setCheckedNodeList(parentNode);
      this.conductUp(parentNode);
    }
  }

  /**
   * 设置子孙节点的选中状态
   * @param {TreeNode=} node
   * @param {Boolean=} value
   */
  conductDown(node, value) {
    if (!isCheckDisabled(node)) {
      node.isChecked = value;
      node.isHalfChecked = false;
      this.setCheckedNodeList(node);
      node.children.forEach(n => {
        this.conductDown(n, value);
      });
    }
  }

  /**
   * 初始默认选中
   * @param {Array=} keys
   */
  setDefaultCheck(keys) {
    this.checkedNodeList = [];
    const check = nodes => {
      nodes.forEach(node => {
        if (isInArray(node.key, keys)) {
          node.isChecked = true;
          node.isHalfChecked = false;
        } else {
          node.isChecked = false;
          node.isHalfChecked = false;
        }
        if (node.children.length > 0) {
          check(node.children);
        }
      });
    };
    check(this.rootNodes);
    this.refreshCheckState();
  }

  /**
   * 刷新选中节点
   */
  refreshCheckState() {
    this.checkedNodeList.forEach(node => {
      this.conduct(node);
    });
  }
}
