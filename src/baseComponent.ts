import { ReactComponent, IBaseObject, InnerComponent } from './types'
import { RENDER_TO_DOM } from './constants'

export default abstract class BaseComponent {
    _range: Range;
    children: ReactComponent[];
    props: IBaseObject;
    _vdom: InnerComponent;
    constructor() {
        this._range = null;
        this.children = [];
        this.props = Object.create(null);
        this._vdom = null;
    }
    setAttribute(name: string,value: any) {
        this.props[name] = value
    }
    appendChild(component: ReactComponent) {
        this.children.push(component)
    }
    abstract [RENDER_TO_DOM](range: Range): void
    abstract get vdom(): InnerComponent
}