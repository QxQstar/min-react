import { TextNode, ElementNode } from './types';
import { RENDER_TO_DOM } from './constants';
import { isTextNode } from './helpers';

export default abstract class Component {
    props: {[attr: string]: any}
    state: {[attr: string]: any}
    _range: Range
    children: (TextNode | ElementNode | Component)[]
    _vdom?: ElementNode

    abstract render() : ElementNode | Component

    constructor() {
        this.props = Object.create(null)
        this._range = null
        this.children = []
        this.state = null
        this._vdom = null;
    }

    get vdom(): ElementNode {
        // 这里会触发递归调用，一直到 render 返回是非 Component 结束
        const vdom = this.render().vdom
        // 将本次用于渲染的 vNode 保存下来
        if (!this._vdom) {
            this._vdom = vdom
        }
        return vdom
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
            this.update()
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
        this.update()
    }
    update() {
        function isSameNode(oldNode: TextNode | ElementNode, newNode: TextNode | ElementNode) {
            if(oldNode.type !== newNode.type) {
                return false
            }

            if(isTextNode(newNode)) {
                if(newNode.content !== (oldNode as TextNode).content) {
                    return false
                }
            } else {
                for (const name in newNode.props) {
                    if(oldNode[name] !== newNode[name]) {
                        return false
                    }
                }
                if (Object.keys(newNode.props).length < Object.keys((oldNode as ElementNode).props).length) {
                    return false
                }
            }
            return true
        }
        const update = (oldNode: TextNode | ElementNode, newNode: TextNode | ElementNode) => {
            if (!isSameNode(oldNode, newNode)) {
                newNode[RENDER_TO_DOM](oldNode._range)
                return;
            }
            newNode._range = oldNode._range

            if(isTextNode(newNode) || isTextNode(oldNode)) {
                return ;
            }

            const newChildren = newNode.vChildren;
            const oldChildren = oldNode.vChildren;
            if(!newChildren || newChildren.length === 0) {
                return 
            }
            // 遗留问题：如果 oldChildren 为空数组怎么解决？

            // 最后一个 node 所在的 range
            let tailRange = oldChildren[oldChildren.length - 1]._range

            for (let i = 0; i < newChildren.length; i++) {
                let newChild = newChildren[i];
                let oldChild = oldChildren[i];

                if(i < oldChildren.length) {
                    update(oldChild, newChild)
                } 

                // 如果 newChildren 的长度大于 oldChildren 的长度，将新的 node 插入到末尾
                else { 
                    let range = document.createRange()
                    range.setStart(tailRange.endContainer, tailRange.endOffset);
                    range.setEnd(tailRange.endContainer, tailRange.endOffset);
                    newChild[RENDER_TO_DOM](range)
                    tailRange = range;
                }
            }
        }
        const vdom = this.vdom;
        update(this._vdom,vdom);
        this._vdom = vdom;
    }
    [RENDER_TO_DOM](range: Range) {
        this._range = range
        this.vdom[RENDER_TO_DOM](range)
    }
}