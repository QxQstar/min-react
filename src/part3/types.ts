export { default as ElementNode } from './elementNode';
export { default as TextNode } from './textNode';
export { default as Component } from './component';
export interface ConstructorOf<T> {
    new(...args: any[]): T;
}
