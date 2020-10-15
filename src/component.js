import { RENDER_TO_DOM } from './constants'

export default class Component {
    constructor() {
        this._range = null;
        this.state = null;
        // 旧的 vdom
        this._vdom = null;
        this.props = Object.create(null)
        this.children = []
    }
    get vdom() {
        return this.render().vdom
    }
    setState(newState) {
        if(this.state === null || typeof this.state !== 'object') {
            this.state = newState;
            this.rerender()
            return ;
        }
        const merge = (oldState, newState) => {
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
        function isSameNode(oldNode, newNode) {
            if(oldNode.type !== newNode.type) {
                return false
            }

            if(newNode.type === '#text' && newNode.content !== oldNode.content) {
                return false
            }

            for (const name in newNode.props) {
                if(oldNode[name] !== newNode[name]) {
                    return false
                }
            }
            if (Object.keys(newNode.props).length < Object.keys(oldNode.props).length) {
                return false
            }

            return true
        }
        const update = (oldNode, newNode) => {
            if (!isSameNode(oldNode, newNode)) {
                newNode[RENDER_TO_DOM](oldNode._range)
                return;
            }
            newNode._range = oldNode._range

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
    setAttribute(name,value) {
        this.props[name] = value
    }
    appendChild(component) {
        this.children.push(component)
    }
    [RENDER_TO_DOM](range) {
        this._range = range
        this._vdom = this.vdom;
        this._vdom[RENDER_TO_DOM](range)
    }
}