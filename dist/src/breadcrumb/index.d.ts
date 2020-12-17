export default class Breadcrumb {
    constructor(node: any);
    node: any;
    data: any;
    store: any;
    renderIcon: any;
    renderLink: any;
    renderSeparator: any;
    createDom(): HTMLSpanElement;
    createIcon(): false | HTMLSpanElement;
    createLink(breads: any, index: any, last: any): HTMLSpanElement;
    createSeparator(): HTMLSpanElement;
}
