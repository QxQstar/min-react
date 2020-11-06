import { TextNode, Component } from './types';
import { RENDER_TO_DOM } from './constants';

export default class ElementNode {
    root: HTMLElement

    constructor(type: string) {
        this.root = document.createElement(type)
    }

    setAttribute(name: string, value: any) {
        if (name.match(/^on([\s\S]+)/)) {
            const eventName = RegExp.$1.replace(/([\s\S])/,c => c.toLocaleLowerCase())
            this.root.addEventListener(eventName, value, false)
            return
        }
        if (name === 'className') {
            this.root.setAttribute('class',value)
            return
        }
        this.root.setAttribute(name,value)
    }

    appendChild(component: TextNode | ElementNode | Component) {
        const range: Range = document.createRange()
        // 因为是在节点的最后添加子元素，所以将 range 移动到末尾
        range.setStart(this.root, this.root.childNodes.length)
        range.setEnd(this.root,this.root.childNodes.length)
        component[RENDER_TO_DOM](range)
    }

    [RENDER_TO_DOM](range: Range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}