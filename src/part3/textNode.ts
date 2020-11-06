import { RENDER_TO_DOM } from './constants';

export default class TextNode {
    type: string;
    content: string;
    _range: Range;
    constructor(content: string) {
        this.type = '#text';
        this.content = content;
        this._range = null
    }
    get vdom(): TextNode {
        return this;
    }
    [RENDER_TO_DOM](range: Range) {
        const root = document.createTextNode(this.content)
        range.deleteContents()
        this._range = range;
        range.insertNode(root)
    }
}