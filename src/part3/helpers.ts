import { TextNode, ElementNode } from './types';

export function isTextNode(val: any): val is TextNode {
    return val.type === '#text'
}

export function isElementNode(node: ElementNode | TextNode): node is ElementNode {
    return node.type !== '#text'
}