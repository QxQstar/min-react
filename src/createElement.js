import ElementNodeWrapper from './elementNodeWrapper';
import TextNodeWrapper from './textNodeWrapper';

export default function createElement(type,attrs,...children) {
    let component;
    if(typeof type === 'string') {
        component = new ElementNodeWrapper(type)
    } else {
        component = new type()
    }
    
    for(const attrName in attrs) {
        component.setAttribute(attrName, attrs[attrName])
    }
    function insertChildren(children) {
        for(let child of children) {
            if(child === null) {
                continue;
            }
            if(typeof child === 'string') {
                child = new TextNodeWrapper(child)
            }
            if(Array.isArray(child)) {
                insertChildren(child)
            } else {
                component.appendChild(child)
            }
        }
    }
    insertChildren(children)
    return component
}