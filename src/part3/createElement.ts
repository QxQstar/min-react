import { Component, ElementNode, ConstructorOf } from './types';
import TextNode from './textNode';

export default function createElement(type: string | ConstructorOf<Component>, attrs: {[attr: string]: any}, ...children: (string |  Component | ElementNode)[]): Component | ElementNode {
    let component: Component | ElementNode;
    if (typeof type === 'string') {
        component = new ElementNode(type)
    } else {
        component = new type()
    }

    for (const attrName in attrs) {
        component.setAttribute(attrName, attrs[attrName])
    }
    function insertChildren(children: any[]) {
        for (let child of children) {
            let childComponent: Component | ElementNode | TextNode
            if (child === null) {
                continue;
            }
            if (typeof child === 'string') {
                childComponent = new TextNode(child)
            } else {
                childComponent = child
            }
            if (Array.isArray(child)) {
                insertChildren(child)
            } else {
                component.appendChild(childComponent)
            }
        }
    }

    insertChildren(children)
    return component
}