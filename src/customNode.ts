import { RENDER_TO_DOM } from './constants'
import { IBaseObject, ReactComponent, InnerComponent, TextNode, ElementNode } from './types'
import { isPlainObject, isTextNode, isElementNode } from './helper/utils'
import BaseComponent from './baseComponent'

export default abstract class CustomNode extends BaseComponent{
    state: IBaseObject;
    constructor() {
        super();
        this.state = null;
    }
    abstract render() : ReactComponent

    get vdom(): InnerComponent {
        return this.render().vdom
    }
    setState(newState: IBaseObject) {
        if(!isPlainObject(this.state)) {
            this.state = newState;
            this.update()
            return ;
        }
        const merge = (oldState: IBaseObject, newState: IBaseObject) => {
            for (const key in newState) {
                if(isPlainObject(oldState[key])) {
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
        function isSameNode(oldNode: InnerComponent, newNode: InnerComponent) {
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
        const update = (oldNode: InnerComponent, newNode: InnerComponent) => {
            if (!isSameNode(oldNode, newNode)) {
                newNode[RENDER_TO_DOM](oldNode._range)
                return;
            }
            newNode._range = oldNode._range

            if(!isElementNode(newNode) || !isElementNode(oldNode)) {
                return ;
            }

            const newChildren = newNode.vChildren;
            const oldChildren = oldNode.vChildren;
            if(!newChildren || newChildren.length === 0) {
                return 
            }
            // 遗留问题：如果 oldChildren 为空数组怎么解决？
            let tailRange = oldChildren[oldChildren.length - 1]._range

            for (let i = 0; i < newChildren.length; i++) {
                let newChild = newChildren[i];
                let oldChild = oldChildren[i];

                if(i < oldChildren.length) {
                    update(oldChild, newChild)
                } 
                // 如果 newChildren 的长度大于 oldChildren的长度
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
        this._vdom = this.vdom;
        this._vdom[RENDER_TO_DOM](range)
    }
}