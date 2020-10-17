import { InnerComponent, TextNode, ElementNode } from '../types'

const toString = Object.prototype.toString;

export function isPlainObject(val: any): val is Object  {
    return toString.call(val) === '[object Object]'
}

export function isTextNode(val: InnerComponent): val is TextNode {
    return val.type === '#text'
}

export function isElementNode(val: InnerComponent): val is ElementNode {
    return val.type !== '#text'
}