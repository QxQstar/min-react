import TextNode from './textNode'
import ElementNode from './elementNode'
import CustomNode from './customNode'

export { default as TextNode }  from './textNode'
export { default as ElementNode } from './elementNode'
export { default as CustomNode } from './customNode'

export interface IBaseObject {
    [propName: string]: any
}

export type ReactComponent = TextNode | ElementNode | CustomNode

export type InnerComponent = TextNode | ElementNode