export default class TreeStore {
    constructor(options: any);
    nodes: any[];
    dataMap: Map<any, any>;
    nodeMap: Map<any, any>;
    radioMap: {};
    expandMap: {};
    root: Node;
    changeNodes: any[];
    setData(val: any): void;
    updateNodes(): void;
    flattenTreeData(): any[];
    getNodeById(id: any): any;
    getCheckedNodes(isTreeNode?: boolean): any[];
    setDefaultChecked(): void;
    checkMaxNodes(node: any): boolean;
    getUnCheckLeafsCount(node: any): number;
    allowEmit(check: any, type: any): boolean;
    _checkVerify(node: any): any;
    _change(node: any): void;
    _changeTimer: NodeJS.Timeout | undefined;
}
import Node from "./node";
