export default class TreeStore {
    constructor(options: any);
    nodes: any[];
    dataMap: Map<any, any>;
    nodeMap: Map<any, any>;
    radioMap: {};
    expandMap: {};
    root: Node;
    breadcrumbs: Node[];
    setData(val: any): void;
    updateNodes(): void;
    flattenTreeData(): any[];
    getNodeById(id: any): any;
    getCheckedNodes(): any[];
    setDefaultChecked(): void;
    checkMaxNodes(node: any): boolean;
    getUnCheckLeafsCount(node: any): number;
    _checkVerify(node: any): any;
}
import Node from "./node";
