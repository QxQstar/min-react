export default class TextNode {
    root: Text

    constructor(content: string) {
        this.root = document.createTextNode(content)
    }
}