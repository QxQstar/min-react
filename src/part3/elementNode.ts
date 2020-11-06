import { TextNode, Component } from './types';
import { RENDER_TO_DOM } from './constants';

export default class ElementNode {
    _range: Range
    children: (Component | ElementNode | TextNode)[]
    vChildren?: (ElementNode | TextNode)[]
    props: {[attr: string]: any}
    type: string

    constructor(type: string) {
        this.type = type
        this.children = []
        this.props = Object.create(null)
        this._range = null
    }

    setAttribute(name: string,value: any) {
        this.props[name] = value
    }
    appendChild(component: Component | ElementNode | TextNode) {
        this.children.push(component)
    }

    get vdom(): ElementNode {
        this.vChildren = this.children.map(child => child.vdom);
        return this;
    }

    [RENDER_TO_DOM](range: Range) {
        const root = document.createElement(this.type);
        range.deleteContents()
        // setAttribute
        for (const name in this.props) {
            const value = this.props[name]
            if(name.match(/^on([\s\S]+)/)) {
                const eventName = RegExp.$1.replace(/([\s\S])/,c => c.toLocaleLowerCase())
                root.addEventListener(eventName, value, false)
                continue 
            }
            if (name === 'className') {
                root.setAttribute('class',value);
                continue
            }
            root.setAttribute(name,value);
        }

        // appendChild
        if (!this.vChildren) {
            this.vChildren = this.children.map(child => child.vdom);
        }
        for (const child of this.vChildren) {
            const childRange = document.createRange()
            childRange.setStart(root, root.childNodes.length)
            childRange.setEnd(root, root.childNodes.length)
            child[RENDER_TO_DOM](childRange)
        }
        this._range = range;
        range.insertNode(root)
    }
}