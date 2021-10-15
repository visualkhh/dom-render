export type Attr = {name: string, value: any}
export class DomUtils {
    static selectorElements(selector: string, element: Element|Document = document): Element[] {
        return Array.prototype.slice.call(element.querySelectorAll(selector));
    }

    static selectorNodes(selector: string, element: Element|Document = document) {
        return element.querySelectorAll(selector);
    }

    static removeAttribute(result: Element, attrs: string[]) {
        attrs.forEach(it => {
            result.removeAttribute(it)
        });
    }

    static setAttribute(result: Element, attrs: string[]) {
        attrs.forEach(it => {
            result.setAttribute(it, '')
        });
    }

    static setAttributeAttr(result: Element, attrs: Attr[]) {
        attrs.forEach(it => {
            result.setAttribute(it.name, it.value)
        });
    }

    static getAttributeToObject(input: Element): any {
        const attribute = {} as any;
        input.getAttributeNames().forEach(ait => {
            attribute[ait] = input.getAttribute(ait);
        });
        return attribute;
    }

    static getStyleToObject(input: HTMLElement): any {
        const style = {} as any;
        for (let i = 0; i < input.style.length; i++) {
            const key = input.style[i];
            style[key] = (input.style as any)[key];
        }
        return style;
    }
}
