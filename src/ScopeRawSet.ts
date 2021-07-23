import {eventManager} from './events/EventManager';
import {RandomUtils} from './utils/random/RandomUtils';
import {NodeUtils} from './utils/node/NodeUtils';

export class ScopeRawSet {
    public node: DocumentFragment | Node;
    public usingVars: string[] = [];

    constructor(public document: Document, public raw: string | Node, public styles: string[] = []) {
        if (typeof this.raw === 'string') {
            const template = this.document.createElement('template');
            template.innerHTML = this.raw;
            this.node = template.content
        } else {
            this.node = this.raw;
        }

        // style
        // Node.ELEMENT_NODE = 1, DOCUMENT_FRAGMENT = 11
        // if (this.styles.length > 0 && (this.node.nodeType === 1 || this.node.nodeType === 11)) {
        //     const fragment = this.makeFragment(this.styles.join(' '));
        //     const style = document.createElement('style')
        //     style.appendChild(fragment);
        //     (this.node as Element).prepend(style);
        // }
        if (this.styles.length > 0 && (this.node.nodeType === 1 || this.node.nodeType === 11)) {
            const style = document.createElement('style')
            style.innerHTML = this.styles.join(' ');
            (this.node as Element).prepend(style);
        }

        const nodeIterator = this.findScopeElementTagName('STYLE')
        let node: Node | null;
        // eslint-disable-next-line no-cond-assign
        while (node = nodeIterator.nextNode()) {
            const style = node as Element;
            if (!style.textContent) {
                continue;
            }
            let text = style.textContent ?? '';
            const varRegex = /\/\*%(.*)%\*\//gm;
            let varExec = varRegex.exec(text)
            while (varExec) {
                text = text.replace(varExec[0], '<!--%' + varExec[1] + '%-->');
                varExec = varRegex.exec(varExec.input)
            }
            const fragment = this.makeFragment(text);
            const newStyle = document.createElement('style')
            newStyle.appendChild(fragment);
            style.parentNode?.replaceChild(newStyle, style);
            nodeIterator.nextNode();
        }
        this.usingVars = this.usingThisVar(this.node.textContent ?? '');
    }

    makeFragment(str: string): DocumentFragment {
        const template = this.document.createElement('template');
        template.innerHTML = str;
        return template.content;
    }

    findScopeComment() {
        const nodeIterator = this.document.createNodeIterator(
            this.node,
            // https://developer.mozilla.org/ko/docs/Web/API/Document/createTreeWalker
            // NodeFilter.SHOW_COMMENT: 128
            128,
            {
                acceptNode: (node: Comment) => {
                    const coment = (node as Comment).data.replace(/[\r\n]/g, '');
                    const b = (coment.startsWith('%') && coment.endsWith('%') && node !== this.node);
                    // NodeFilter.FILTER_ACCEPT: 1, NodeFilter.FILTER_REJECT: 2
                    return b ? 1 : 2;
                }
            }
        )
        return nodeIterator;
    }

    findScopeElementTagName(tagName: string) {
        const nodeIterator = this.document.createNodeIterator(
            this.node,
            // https://developer.mozilla.org/ko/docs/Web/API/Document/createTreeWalker
            // NodeFilter.SHOW_ELEMENT: 1
            1,
            {
                acceptNode: (node: Element) => {
                    const b = ((node.tagName.toUpperCase() === tagName.toUpperCase()) && node !== this.node);
                    // NodeFilter.FILTER_ACCEPT: 1, NodeFilter.FILTER_REJECT: 2
                    return b ? 1 : 2;
                }
            }
        )
        return nodeIterator;
    }

    public getScopeCommentData() {
        // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
        // Node.COMMENT_NODE: 8, Node.DOCUMENT_FRAGMENT_NODE: 11
        // console.log('-', this.node, this.node.nodeType)
        if (this.node.nodeType === 8) {
            const comment = (this.node as Comment).data
            if (comment.startsWith('%') && comment.endsWith('%')) {
                return comment.substring(1, comment.length - 1)
            }
        }
    }

    private usingThisVar(raws: string): string[] {
        return eventManager.usingThisVar(raws)
        // const regex = /["'].*["']/gm;
        // raws = raws.replace(regex, '');
        // const varRegexStr = 'this\\.([a-zA-Z_$][a-zA-Z_.$0-9]*)';
        // const varRegex = RegExp(varRegexStr, 'gm');
        // let varExec = varRegex.exec(raws)
        // const usingVars = [];
        // while (varExec) {
        //     usingVars.push(varExec[1]);
        //     varExec = varRegex.exec(varExec.input)
        // }
        // return usingVars;
    }
}
