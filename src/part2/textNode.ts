import { RENDER_TO_DOM } from './constants';

export default class TextNode {
    root: Text

    constructor(content: string) {
        this.root = document.createTextNode(content)
    }

    [RENDER_TO_DOM](range: Range) {
        range.deleteContents()
        range.insertNode(this.root)
    }
}