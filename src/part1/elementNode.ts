import { TextNode, Component } from './types';

export default class ElementNode {
    root: HTMLElement

    constructor(type: string) {
        this.root = document.createElement(type)
    }

    setAttribute(name: string, value: string) {
        this.root.setAttribute(name,value);
    }

    appendChild(component: TextNode | ElementNode | Component) {
        this.root.appendChild(component.root)
    }
}