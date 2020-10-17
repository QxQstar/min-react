import BaseComponent from './baseComponent'
import { RENDER_TO_DOM } from './constants'
import { InnerComponent } from './types'

export default class ElementNode extends BaseComponent {
    type: string;
    vChildren: InnerComponent[];
    constructor(tag: string) {
        super()
        this.vChildren = null
        this.type = tag
    }
    get vdom(): ElementNode {
        this.vChildren = this.children.map(child => child.vdom);
        return this;
    }
    [RENDER_TO_DOM](range: Range){
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