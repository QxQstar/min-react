import { RENDER_TO_DOM } from './constants'
import { ReactComponent } from './types'

export default function renderDom(compnent: ReactComponent, parent: HTMLElement) {
    const range = document.createRange()
    range.setStart(parent,0)
    range.setEnd(parent,parent.childNodes.length)
    range.deleteContents()
    compnent[RENDER_TO_DOM](range)
}