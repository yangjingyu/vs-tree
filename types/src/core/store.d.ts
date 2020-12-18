export default class TreeStore {
    constructor(options: any);
    nodes: any[];
    dataMap: Map<any, any>;
    nodeMap: Map<any, any>;
    radioMap: {};
    expandMap: {};
    root: Node;
    setData(val: any): void;
    updateNodes(): void;
    flattenTreeData(): any[];
    getNodeById(id: any): any;
    getCheckedNodes(): any[];
    setDefaultChecked(): void;
    checkMaxNodes(node: any): boolean;
    getUnCheckLeafsCount(node: any): number;
    allowEmit(check: any, type: any): boolean;
    _checkVerify(node: any): any;
}
import Node from "./node";
