import Node from "./node";
export declare function insterAfter(newElement: HTMLElement, targetElement: HTMLElement): void;
export declare function onDragEnterGap(e: MouseEvent, treeNode: HTMLElement): 1 | -1 | 0;
export declare const findNearestNode: (element: HTMLElement, name: string) => any;
export declare const parseTemplate: (name: string, ctx: Node) => any;
