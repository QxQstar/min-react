import { TextNode, ElementNode } from './types';
import { RENDER_TO_DOM } from './constants';

export default abstract class Component {
    props: {[attr: string]: any}
    state: {[attr: string]: any}
    _range?: Range
    children: (TextNode | ElementNode | Component)[]

    abstract render() : ElementNode | Component

    constructor() {
        this.props = Object.create(null)
        this.children = []
        this.state = null
    }

    setAttribute(name: string, value: any) {
        this.props[name] = value
    }

    appendChild(component: TextNode | ElementNode | Component) {
        this.children.push(component)
    }

    setState(newState: {[attr: string]: any}) {
        if(this.state === null || typeof this.state !== 'object') {
            this.state = newState;
            this.rerender()
            return ;
        }
        const merge = (oldState: {[attr: string]: any}, newState: {[attr: string]: any}) => {
            for (const key in newState) {
                if(oldState[key] !== null && typeof oldState[key] === 'object') {
                    merge(oldState[key], newState[key])
                } else {
                    oldState[key] = newState[key]
                }
            }
        }
    
        merge(this.state, newState)
        this.rerender()
    }
    rerender() {
        this._range.deleteContents()
        this[RENDER_TO_DOM](this._range)
    }

    [RENDER_TO_DOM](range: Range) {
        // 将 range 保存下来，供 rerender 的时候使用
        this._range = range
        // 这里会导致一个递归调用，一直到 render 方法返回的是一个 ElementNode 类型为止
        this.render()[RENDER_TO_DOM](range)
    }
}