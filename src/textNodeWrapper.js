import Component from './component';
import { RENDER_TO_DOM } from './constants'

export default class TextNodeWrapper extends Component{
    constructor(content) {
        super();
        this.type = '#text'
        this.content = content
    }
    get vdom() {
        return this;
    }
    [RENDER_TO_DOM](range) {
        const root = document.createTextNode(this.content)
        range.deleteContents()
        this._range = range;
        range.insertNode(root)
    }
}
