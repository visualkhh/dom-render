import {eventManager} from './events/EventManager';

export class ScopeRawSet {
    public node: DocumentFragment | Node;
    public usingVars: string[] = [];
    public static readonly DR_IF_NAME = 'dr-if';
    public static readonly DR_FOR_OF_NAME = 'dr-for-of';
    public static readonly DR_INCLUDE_NAME = 'dr-include';
    public static readonly DR_REPLACE_NAME = 'dr-replace';
    public static readonly DR_FOR_NAME = 'dr-for';
    public static readonly DR_STATEMENT_NAME = 'dr-statement';
    public static readonly DR_IT_OPTIONNAME = 'dr-it';
    public static readonly DR_ATTRIBUTES = [ScopeRawSet.DR_IF_NAME, ScopeRawSet.DR_FOR_OF_NAME, ScopeRawSet.DR_INCLUDE_NAME, ScopeRawSet.DR_REPLACE_NAME, ScopeRawSet.DR_FOR_NAME, ScopeRawSet.DR_STATEMENT_NAME];

    constructor(public window: Window, public raw: string | Node, public styles: string[] = [], public itPath?: string) {
        if (typeof this.raw === 'string') {
            const template = this.window.document.createElement('template');
            template.innerHTML = this.raw;
            this.node = template.content
        } else {
            this.node = this.raw;
        }
        this.usingVars = [];
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
            console.log('style-->', style.outerHTML)
            style.parentNode?.replaceChild(newStyle, style);
            nodeIterator.nextNode();
        }
        this.usingVars = this.usingThisVar(this.node.textContent ?? '');
        // console.log('usingVar2', this.usingVars, this.node.textContent)
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
            const forr = element.getAttribute(ScopeRawSet.DR_FOR_NAME);
            const statement = element.getAttribute(ScopeRawSet.DR_STATEMENT_NAME);
            const drIt = element.getAttribute(ScopeRawSet.DR_IT_OPTIONNAME);
            let content = '';
            if (ifAttribute) {
                element.removeAttribute(ScopeRawSet.DR_IF_NAME);
                const html = ScopeRawSet.replaceThisToDhis(this.genHTML(element, true));
                let destIf = ifAttribute;
                if (this.itPath) {
                    destIf = destIf.replace(/it/g, this.itPath)
                }
                content = `if(${destIf}){ includeDhis(this, {template: '${html}'}) } `; // const dhis = this;
            }
            if (include) {
                element.removeAttribute(ScopeRawSet.DR_INCLUDE_NAME);
                const html = ScopeRawSet.replaceThisToDhis(this.genHTML(element, true));
                content = `includeDhis(this, {template: '${html}'}, '${include}') `; // const dhis = this;
            }
            if (replace) {
                element.removeAttribute(ScopeRawSet.DR_REPLACE_NAME);
                const html = ScopeRawSet.replaceThisToDhis(this.genHTML(element, false)
                    .replace(/\(it/g, '(' + replace));
                content = `includeDhis(this, {template: '${html}'}, '${replace}') `; // const dhis = this;
            }
            if (statement) {
                element.removeAttribute(ScopeRawSet.DR_STATEMENT_NAME);
                const html = ScopeRawSet.replaceThisToDhis(this.genHTML(element, true));
                content = `${statement}{
                    const destHtml = '${html}'.replace(/\\(it/g, '('+${drIt});
                    includeDhis(this, {template: destHtml})
                } `; // const dhis = this;
            }
            if (forr) {
                element.removeAttribute(ScopeRawSet.DR_FOR_NAME);
                element.removeAttribute(ScopeRawSet.DR_IT_OPTIONNAME);
                const html = ScopeRawSet.replaceThisToDhis(this.genHTML(element, true));
                let destFor = forr;
                let destIt = drIt ?? '';
                if (this.itPath) {
                    destFor = destFor.replace(/it/g, this.itPath)
                    destIt = destIt.replace(/it/g, this.itPath)
                }
                content = `for(${destFor}){
                    const currentThis = '${destIt.replace(/\[(.*)\]/g, '[\'+$1+\']')}'
                    includeDhis(this, {template: '${html}'}, currentThis)
                } `; // const dhis = this;
            }
            if (forOfAttribute) {
                element.removeAttribute(ScopeRawSet.DR_FOR_OF_NAME);
                element.removeAttribute(ScopeRawSet.DR_IT_OPTIONNAME);
                let destFor = forOfAttribute;
                let destIt = drIt ?? '';
                if (this.itPath) {
                    destFor = destFor.replace(/it/g, this.itPath)
                    destIt = destIt.replace(/it/g, this.itPath)
                }
                const html = ScopeRawSet.replaceThisToDhis(this.genHTML(element, true));
                content = `const datas = ${destFor}; for(var i = 0; i < datas.length; i++){ 
                    const paths = '${destFor}['+i+']';
                    includeDhis(this, {template: '${html}', paths})
                } `; // const dhis = this;
                // content = `for(const it of ${forOfAttribute}){ includeDhis(this, {template: '${html}'}) } `; // const dhis = this;
            }
            // this.changeElementToScope(element);
            const newComment = document.createComment('%' + content + '%')
            // console.log('---------------createComment', newComment.data)
            element.parentNode?.replaceChild(newComment, element);
        }
    }

    genHTML(element: Element, isOuter = true) {
        const attributeNames = element.getAttributeNames();
        for (let i = 0; i < attributeNames.length; i++) {
            attributeNames[i] += `="${element.getAttribute(attributeNames[i])}"`
        }

        let html = isOuter ? `<${element.tagName} ${attributeNames.join(' ')}>` : '';
        element.childNodes.forEach((n, k) => {
            if (n.nodeType === 1) {
                const element = n as Element;
                if (ScopeRawSet.DR_ATTRIBUTES.filter(it => element.getAttribute(it)).length > 0) {
                    html += this.escapeNoExpressionContent(element.outerHTML ?? '')
                } else {
                    const genData = this.escapeContent(element.outerHTML ?? '');
                    // this.usingVars.push(...this.usingThisVar(genData))
                    html += genData
                }
            } else if (n.nodeType === 3) {
                const text = (n as Text).data ?? '';
                // this.usingVars.push(...this.usingThisVar(text))
                html += this.escapeContent(text)
            }
        })
        html += (isOuter ? `</${element.tagName}>` : '');
        return html;
    }

    public static replaceThisToDhis(content: string) {
        return content
            // .replace(/it\./g, 'dit.')
            .replace(/this\./g, 'dhis.')
    }

    public static replaceDhisToThis(content: string) {
        return content
            // .replace(/dit\./g, 'it.')
            .replace(/dhis\./g, 'this.')
    }

    escapeContent(content: string) {
        return this.escapeNoExpressionContent(content)
            // .replace(/\$\$\{(.*?)\}/g, '\\<\\!\\-\\-%write($1)%\\-\\-\\>')
            .replace(/\$\{(.*?)\}/g, '<!--%write($1)%-->')
            .replace(/#\{(.*?)\}/g, '\'+($1)+\'');
    }

    escapeNoExpressionContent(content: string) {
        return content.replace(/\r?\n/g, '')
            .replace(/'/g, '\\\'');
    }

    makeFragment(str: string): DocumentFragment {
        const template = this.window.document.createElement('template');
        template.innerHTML = str;
        return template.content;
    }

    findScopeComment() {
        const nodeIterator = this.window.document.createNodeIterator(
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
        const nodeIterator = this.window.document.createNodeIterator(
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
        const nodeIterator = this.window.document.createNodeIterator(rootNode, 1, filter);
        let node: Node | null;
        // eslint-disable-next-line no-cond-assign
        while (node = nodeIterator.nextNode()) {
            nodes.push(node as Element);
        }
        return nodes;
    }

    findScopeElement(filter?: NodeFilter, node = this.node) {
        // whatToShow https://developer.mozilla.org/en-US/docs/Web/API/Document/createNodeIterator
        return this.window.document.createNodeIterator(node, 1, filter)
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
