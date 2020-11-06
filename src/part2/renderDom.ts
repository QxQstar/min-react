import { Component, ElementNode } from './types';
import { RENDER_TO_DOM } from './constants';


export default function renderDom (component: Component | ElementNode, parent: HTMLElement) {
    const range = document.createRange()
    range.setStart(parent,0)
    range.setEnd(parent,parent.childNodes.length)
    range.deleteContents()
    component[RENDER_TO_DOM](range)
}