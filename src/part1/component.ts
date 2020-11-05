import { TextNode, ElementNode } from './types';

export default abstract class Component {
    props: {[attr: string]: any}
    _root?: HTMLElement
    children: (TextNode | ElementNode | Component)[]

    abstract render() : ElementNode | Component

    constructor() {
        this.props = Object.create(null)
        this.children = []
    }

    setAttribute(name: string, value: any) {
        this.props[name] = value
    }

    appendChild(component: TextNode | ElementNode | Component) {
        this.children.push(component)
    }

    get root(): HTMLElement {
        if(!this._root) {
            this._root = this.render().root
        }
        return this._root;
    }
}