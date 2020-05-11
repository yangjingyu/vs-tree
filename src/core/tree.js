import TreeNode from './tree-node';
import TreeService from './tree-service';

const defalutOptions = {
  default: [],
  rootId: -1
}
export default class Tree {
  constructor(nodes, options = {}) {
    const config = { ...defalutOptions, ...options };
    const data = this.jsonToTree(nodes, config.rootId);
    
    this.service = new TreeService();
    
    this.rootData = this.treeToNodes(data);

    this.service.initTree(this.rootData);
    this.service.setDefaultCheck(config.default);
    this.service.flatTreeData();
  }

  get data() {
    return this.service.flattenData;
  }

  set data(val) {
    // val
  }

  // Json转为Json树
  jsonToTree(data, parentId) {
    const list = [].concat(data);
    const parse = (list, parentId) => {
      return list.reduce((itemArr, node) => {
        if (node.parentid === parentId) {
          const newNode = node;
          newNode.children = parse(list, node.key, node);
          itemArr.push(newNode);
        }
        return itemArr;
      }, []);
    };
    return parse(list, parentId);
  }

  // Json树转为树节点
  treeToNodes(value) {
    let nodes = [];
    if (!this.isArrayOfTreeNode(value)) {
      nodes = value.map(item => new TreeNode(item, null, this.service));
    } else {
      nodes = value.map((item) => {
        item.service = this.service;
        return item;
      });
    }
    return nodes;
  }

  // 是否为树节点
  isArrayOfTreeNode(value) {
    return value.every(item => item instanceof TreeNode);
  }

  // 获取树形根节点
  getTreeNodes() {
    return this.service.rootNodes;
  }

  // 获取选中列表
  getCheckedNodeList() {
    return this.service.getCheckedNodeList();
  }

  // 更新节点
  update(node) {
    this.service.setCheckedNodeList(node);
    this.service.conduct(node);
  }
}
