export default class BreadcrumbItem {
    constructor(node: any, parent: any);
    node: any;
    data: any;
    store: any;
    parent: any;
    renderIcon: any;
    renderLink: any;
    renderSeparator: any;
    createDom(): HTMLSpanElement;
    createIcon(): false | HTMLSpanElement;
    createLink(breads: any, index: any, last: any): HTMLSpanElement;
    createSeparator(): HTMLSpanElement;
}
