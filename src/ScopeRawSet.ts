import {eventManager} from './events/EventManager';
import {RandomUtils} from './utils/random/RandomUtils';
import {NodeUtils} from './utils/node/NodeUtils';

export class ScopeRawSet {
    public node: DocumentFragment | Node;
    public usingVars: string[] = [];
    public static readonly DR_IF_NAME = 'dr-if';
    public static readonly DR_FOR_OF_NAME = 'dr-for-of';
    public static readonly DR_INCLUDE_NAME = 'dr-include';
    public static readonly DR_REPLACE_NAME = 'dr-replace';
    public static readonly DR_ATTRIBUTES = [ScopeRawSet.DR_IF_NAME, ScopeRawSet.DR_FOR_OF_NAME, ScopeRawSet.DR_INCLUDE_NAME, ScopeRawSet.DR_REPLACE_NAME];

    constructor(public document: Document, public raw: string | Node, public styles: string[] = []) {
        if (typeof this.raw === 'string') {
            const template = this.document.createElement('template');
            template.innerHTML = this.raw;
            this.node = template.content
        } else {
            this.node = this.raw;
        }

        // let nodeIterator = this.findScopeElementTagName('scope');
        // let node: Node | null;
        // const nodes: Element[] = [];
        // // eslint-disable-next-line no-cond-assign
        // while (node = nodeIterator.nextNode()) {
        //     nodes.push(node as Element);
        // }
        // nodes.reverse().forEach(element => {
        //     let content = `write(\`${element.innerHTML}\`)`;
        //     const ifStatement = element.getAttribute('if');
        //     if (ifStatement) {
        //         console.log('---fif', ifStatement)
        //         content = `ifWrite(${ifStatement},\`${element.innerHTML}\`)`;
        //     }
        //     const forStatement = element.getAttribute('forOf');
        //     if (forStatement) {
        //         content = 'for(const it of ' + forStatement + '){' + content + '}'
        //     }
        //
        //     const newComment = document.createComment('%' + content + '%')
        //     console.log('----->', newComment)
        //     element.parentNode?.replaceChild(newComment, element);
        //     // NodeUtils.replaceNode(node, newComment);
        // })
        //
        // //
        // const nodes = this.findScopeElementTagNames('');
        // nodes.reverse().forEach(element => {
        //     const html = element.outerHTML.replace(/\r?\n/g, '');
        //     let content = `write('${html}')`;
        //     const ifStatement = element.getAttribute('dr-if');
        //     if (ifStatement) {
        //         console.log('---fif', ifStatement)
        //         content = `writeIf(${ifStatement},'${html}')`;
        //     }
        //     const forStatement = element.getAttribute('dr-for-of');
        //     if (forStatement) {
        //         content = `(() => {var temp=''; for(const it of ${forStatement}){ temp+='${html}' } return(temp); })()`
        //     }
        //
        //     content = content.replace(/<!--%/g, "'+").replace(/%-->/g, "+'")
        //     content = content.replace(/(\$\{)(.*?)(\})/g, "'+$2+'")
        //     // content = content.replace(/\$\{/g, "'+").replace(/\}/g, "+'")
        //     // if (!content.startsWith('write')) {
        //     //     content = `write(${content});`
        //     // }
        //     const newComment = document.createComment('%' + content + '%')
        //     console.log('----->', newComment)
        //     element.parentNode?.replaceChild(newComment, element);
        // })
       this.changeElementToScope(this.node)
        // style
        // Node.ELEMENT_NODE = 1, DOCUMENT_FRAGMENT = 11
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

    changeElementToScope(rootNode: Node) {
        const nodeIterator = this.findScopeElement({
            acceptNode(node: Element): number {
                // console.log('node-->', node, rootNode)
                if (node === rootNode) {
                    return 2;
                }
                // NodeFilter.FILTER_ACCEPT: 1, NodeFilter.FILTER_REJECT: 2
                return ScopeRawSet.DR_ATTRIBUTES.filter(it => node.getAttribute(it)).length > 0 ? 1 : 2
            }
        }, rootNode);

        // nodeIterator.forEach(element => {
        //     const html = element.outerHTML;
        //     const newComment = document.createComment(`%include(this, {template: \`${html}\`})%`);
        //     element.parentNode?.replaceChild(newComment, element);
        //     console.log('--->', element)
        // })

        let node: Node | null;
        // eslint-disable-next-line no-cond-assign
        while (node = nodeIterator.nextNode()) {
            const element = node as Element;
            const ifAttribute = element.getAttribute(ScopeRawSet.DR_IF_NAME);
            const forOfAttribute = element.getAttribute(ScopeRawSet.DR_FOR_OF_NAME);
            const include = element.getAttribute(ScopeRawSet.DR_INCLUDE_NAME);
            const replace = element.getAttribute(ScopeRawSet.DR_REPLACE_NAME);
            let content = '';
            if (ifAttribute) {
                element.removeAttribute(ScopeRawSet.DR_IF_NAME);
                const html = this.escapeContent(element.outerHTML);
                content = ` if(${ifAttribute}){ include(this, {template: '${html}'}) } `;
            }
            if (forOfAttribute) {
                element.removeAttribute(ScopeRawSet.DR_FOR_OF_NAME);
                const html = this.escapeContent(element.outerHTML);
                content = ` for(const it of ${forOfAttribute}){ include(this, {template: '${html}'}) } `;
            }
            if (include) {
                element.removeAttribute(ScopeRawSet.DR_INCLUDE_NAME);
                const html = this.escapeContent(element.outerHTML);
                content = ` const it = ${include}; include(this, {template: '${html}'}) `;
            }
            if (replace) {
                element.removeAttribute(ScopeRawSet.DR_REPLACE_NAME);
                const html = this.escapeContent(element.innerHTML);
                content = ` const it = ${replace}; include(this, {template: '${html}'}) `;
            }
            this.changeElementToScope(element);
            const newComment = document.createComment('%' + content + '%')
            element.parentNode?.replaceChild(newComment, element);
        }
    }

    escapeContent(content: string) {
        return content.replace(/\r?\n/g, '').replace(/'/g, '\\\'').replace(/\$\{(.*?)\}/g, '\'+($1)+\'');
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

    findScopeElementTagNames(tagName: string) {
        const nodes: Element[] = [];
        const nodeIterator = this.findScopeElementTagName(tagName);
        let node: Node | null;
        // eslint-disable-next-line no-cond-assign
        while (node = nodeIterator.nextNode()) {
            nodes.push(node as Element);
        }
        return nodes;
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

    findScopeElements(filter?: NodeFilter, rootNode = this.node) {
        const nodes: Element[] = [];
        const nodeIterator = this.document.createNodeIterator(rootNode, 1, filter);
        let node: Node | null;
        // eslint-disable-next-line no-cond-assign
        while (node = nodeIterator.nextNode()) {
            nodes.push(node as Element);
        }
        return nodes;
    }

    findScopeElement(filter?: NodeFilter, node = this.node) {
        // whatToShow https://developer.mozilla.org/en-US/docs/Web/API/Document/createNodeIterator
        return this.document.createNodeIterator(node, 1, filter)
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
    }
}
