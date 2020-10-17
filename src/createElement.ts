import ElementNode from './elementNode';
import TextNode from './textNode';
import { CustomNode, IBaseObject, ReactComponent } from './types'

export default function createElement(type: any,attrs: IBaseObject,...children: []) {
    let component: CustomNode | ElementNode;
    if(typeof type === 'string') {
        component = new ElementNode(type)
    } else {
        component = new type()
    }
    
    for(const attrName in attrs) {
        component.setAttribute(attrName, attrs[attrName])
    }
    function insertChildren(children: []) {
        for(let child of children) {
            let childComponent: ReactComponent
            if(child === null) {
                continue;
            }
            if(typeof child === 'string') {
                childComponent = new TextNode(child)
            } else {
                childComponent = child
            }
            if(Array.isArray(child)) {
                insertChildren(child)
            } else {
                component.appendChild(childComponent)
            }
        }
    }
    insertChildren(children)
    return component
}