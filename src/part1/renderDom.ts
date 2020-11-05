import { Component, ElementNode } from './types';

export default function renderDom (component: Component | ElementNode, parent: HTMLElement) {
    parent.appendChild(component.root);
}