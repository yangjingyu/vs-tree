export default class Vlist {
    constructor(opts: any);
    range: any;
    $el: any;
    dataSources: any;
    wrapper: HTMLDivElement;
    keeps: any;
    estimateSize: any;
    dataKey: string;
    getOffset(): number;
    getClientSize(): number;
    getScrollSize(): number;
    scrollToIndex(index: any): void;
    reset(): void;
    installVirtual(): void;
    virtual: Virtual | undefined;
    getUniqueIdFromDataSources(): any;
    onRangeChanged(range: any): void;
    onScroll(): void;
    getRenderSlots(): void;
    update(data: any): void;
    render(): void;
}
import Virtual from "./virtual";
