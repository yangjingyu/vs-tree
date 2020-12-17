export default class Tree {
    constructor(selector: any, ops: any);
    $el: HTMLElement;
    _data: any;
    nodes: any[];
    itemHeight: any;
    showCount: any;
    maxHeight: any;
    dataKey: any;
    data: any[];
    keyword: string;
    searchFilter: any;
    ready: any;
    store: TreeStore;
    init(): void;
    vlist: Vlist | undefined;
    render(update?: boolean): void;
    renderBreadcrumb(bread: any): void;
    hasKeyword(v: any): any;
    checkFilter(v: any): any;
    filter(keyword: string | undefined, onlySearchLeaf: any): any[];
    getNodeById(id: any): any;
    getCheckedNodes(): any[];
    setMaxValue(value?: number): void;
    scrollToIndex(index?: number): void;
}
import TreeStore from "./store";
import Vlist from "../virtual-list";
