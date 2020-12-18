export interface BreadcrumbOptions {
    el: string | HTMLElement;
    icon?: Function | string;
    link?: Function | string;
    separator?: Function | string;
    change?: Function;
}
export default class Breadcrumb {
    store: any;
    list: never[];
    options: BreadcrumbOptions;
    constructor(options: BreadcrumbOptions);
    get current(): any;
    renderBreadcrumb(): void;
}
